var Respones = require("../Respones.js");
var redis_center = require("../../database/redis_center.js");
var redis_game = require("../../database/redis_game.js");
var mysql_game = require("../../database/mysql_game.js");
var utils = require("../../utils/utils.js");
var log = require("../../utils/log.js");
var Stype = require("../Stype.js");
var Cmd = require("../Cmd.js");
var proto_man = require("../../netbus/proto_man.js");
var State = require("./State.js");

var five_chess_model = require("./five_chess_model.js");
let QuitReason = require("./QuitReason.js");

var INVIEW_SEAT = 20;
var GAME_SEAT = 2; // 
var DISK_SIZE = 15;//棋盘大小

var ChessType = {
	NONE: 0,
	BLACK: 1,
	WHITE: 2,
}

function write_err(status, ret_func) {
	var ret = {};
	ret[0] = status;
	ret_func(ret);
}

function five_chess_room(room_id, zone_conf) {
	this.zid = zone_conf.zid; // 玩家当前所在的区间
	this.room_id = room_id; // 玩家当前所在的房间ID号
	this.think_time = zone_conf.think_time;
	this.min_chip = zone_conf.min_chip; // 玩家有可能一直游戏， 
	this.bet_chip = zone_conf.one_round_chip;
	this.state = State.Ready;

	//2024.4.22 添加游戏准备开始游戏代码
	this.black_rand = true;//随机生成
	this.black_seatid = -1;//黑色的作为
	//end
	//2024.4.23 添加一个属性是否是该玩家
	this.cur_seatid = -1;

	// 0, INVIEW_SEAT
	this.inview_players = [];
	for (var i = 0; i < INVIEW_SEAT; i++) {
		this.inview_players.push(null);
	}
	// end

	// 游戏座位
	this.seats = [];
	for (var i = 0; i < GAME_SEAT; i++) {
		this.seats.push(null);
	}
	// end 

	//创建棋盘
	this.chess_disk = [];
	for (let i = 0; i < DISK_SIZE * DISK_SIZE; i++) {
		this.chess_disk.push(ChessType.NONE);//初始化棋盘
	}
	//end

	//4.25号增加一个定时器对象
	this.action_timer = null;
	this.action_timeout_timestamp = 0;//玩家这个超时的时间戳
	//end
}

/**
 * 重新弄棋盘
 */
five_chess_room.prototype.reset_chess_disk = function () {
	for (let i = 0; i < DISK_SIZE * DISK_SIZE; i++) {
		this.chess_disk[i] = ChessType.NONE;
	}
}

five_chess_room.prototype.search_empty_seat_inview = function () {
	for (var i = 0; i < INVIEW_SEAT; i++) {
		if (this.inview_players[i] == null) {
			return i;
		}
	}

	return -1;
}

five_chess_room.prototype.get_user_arrived = function (other) {
	var body = {
		0: other.seatid,

		1: other.unick,
		2: other.usex,
		3: other.uface,

		4: other.uchip,
		5: other.uexp,
		6: other.uvip,
		7: other.state, // 玩家当前游戏状态
	};
	return body;
}

// 玩家进入到我们的游戏房间
five_chess_room.prototype.do_enter_room = function (p) {
	var inview_seat = this.search_empty_seat_inview();
	if (inview_seat < 0) {
		log.warn("inview seat is full!!!!!");
		return;
	}

	this.inview_players[inview_seat] = p;
	p.room_id = this.room_id;
	p.enter_room(this);

	// 如果你觉得有必要，那么需要把玩家进入房间的消息，玩家的信息
	// 广播给所有的人，有玩家进来旁观了
	// 。。。。
	// end 

	//我们要把座位上的所有的玩家，发送给进来旁观的这位同学
	for (var i = 0; i < GAME_SEAT; i++) {
		if (!this.seats[i]) {
			continue;
		}
		var other = this.seats[i];

		// var body = {
		// 	0: other.seatid,

		// 	1: other.unick,
		// 	2: other.usex,
		// 	3: other.uface,

		// 	4: other.uchip,
		// 	5: other.uexp,
		// 	6: other.uvip,
		// 	7: other.state,//4.22新增加的状态属性，客户端也需要添加这个属性
		// };
		let body = this.get_user_arrived(other);
		p.send_cmd(Stype.Game5Chess, Cmd.Game5Chess.USER_ARRIVED, body);
	}
	// end 

	log.info("player:", p.uid, "enter room:", this.zid, "--", this.room_id);
	var body = {
		0: Respones.OK,
		1: this.zid,
		2: this.room_id,
		// .... 房间信息
	};

	p.send_cmd(Stype.Game5Chess, Cmd.Game5Chess.ENTER_ROOM, body);
	// 自动分配一个座位给我们的玩家，学员也可以改成发送命令手动分配
	this.do_sitdown(p);
	// end 
}
// end

five_chess_room.prototype.do_sitdown = function (p) {
	if (p.seatid !== -1) {
		return;
	}

	// 搜索一个可用的空位
	var sv_seat = this.search_empty_seat();
	if (sv_seat === -1) { // 只能旁观
		return;
	}
	// end
	log.info(p.uid, "sitdown at seat: ", sv_seat);
	this.seats[sv_seat] = p;
	p.seatid = sv_seat;
	p.sitdown(this);

	// 发送消息给客户端，这个玩家已经坐下来了
	var body = {
		0: Respones.OK,
		1: sv_seat,
	};
	p.send_cmd(Stype.Game5Chess, Cmd.Game5Chess.SITDOWN, body);
	// end
	log.error("自动发送坐下消息")
	//广播给所有的其他玩家(旁观的玩家),玩家坐下,
	// var body = {
	// 	0: sv_seat,

	// 	1: p.unick,
	// 	2: p.usex,
	// 	3: p.uface,

	// 	4: p.uchip,
	// 	5: p.uexp,
	// 	6: p.uvip,
	// 	7: p.state,
	// };
	let body = this.get_user_arrived(p);
	this.room_broadcast(Stype.Game5Chess, Cmd.Game5Chess.USER_ARRIVED, body, p.uid);
	//end
}

five_chess_room.prototype.do_exit_room = function (p, quit_reason) {
	//短线重连流程
	if (quit_reason = QuitReason.UserLostConn
		&& this.state == State.Playing && p.state == State.Playing) {
		return false;
	}

	//离开房间的操作
	let winnner = null;
	if (p.seatid != -1) {
		//4.25添加用户的离开房间
		if (p.state == State.Playing) {
			let winner_seatid = GAME_SEAT - p.seatid - 1;//换一个人赢
			winnner = this.seats[winner_seatid];
			if (winnner) {
				this.checkout_game(1, winnner);
			}
		}
		//end
		var seatid = p.seatid;
		log.info(p.uid, "standup at seat: ", p.seatid);
		p.standup(this);
		this.seats[p.seatid] = null;
		p.seatid = -1;

		// 广播给所有的玩家(旁观的玩家),玩家站起,
		var body = {
			0: Respones.OK,
			1: seatid,
		};
		this.room_broadcast(Stype.Game5Chess, Cmd.Game5Chess.STANDUP, body, null);
		// end 
	}
	// end 
	log.info("player:", p.uid, "exit room:", this.zid, "--", this.room_id);
	// 把玩家从旁观列表里面删除
	for (var i = 0; i < INVIEW_SEAT; i++) {
		if (this.inview_players[i] == p) {
			this.inview_players[i] = null;
		}
	}
	// end
	p.exit_room(this);
	p.room_id = -1;

	// 广播给所有的玩家(旁观的玩家), 玩家离开了房间,(如果有必要)
	// 。。。。
	// end 
	return true;
}

five_chess_room.prototype.search_empty_seat = function () {
	// for(var i in this.seats) { // bug
	for (var i = 0; i < GAME_SEAT; i++) {
		if (this.seats[i] === null) {
			return i;
		}
	}

	return -1;
}

five_chess_room.prototype.empty_seat = function () {
	var num = 0;
	for (var i in this.seats) {
		if (this.seats[i] === null) {
			num++;
		}
	}
	return num;
}

// 基于旁观列表来广播
// 我们是分了json, buf协议的
five_chess_room.prototype.room_broadcast = function (stype, ctype, body, not_to_uid) {
	let json_uid = [];
	let cmd_json = null;
	let gw_session = null;
	for (let i = 0; i < this.inview_players.length; i++) {
		if (!this.inview_players[i] ||
			this.inview_players[i].session === null ||
			this.inview_players[i].uid == not_to_uid) {
			continue;
		}
		gw_session = this.inview_players[i].session;
		json_uid.push(this.inview_players[i].uid);
		if (!cmd_json) {
			cmd_json = proto_man.encode_cmd(stype, ctype, body, this.inview_players[i].uid);
		}

		//判断数据
		if (json_uid.length > 0) {
			let body = {
				cmd_buf: cmd_json,
				users: json_uid,
			};
			//群发数据操作
			log.warn("群发数据", stype, ctype);
			gw_session.send_cmd(Stype.Broadcast, Cmd.BROADCAST, body, this.inview_players[i].uid);
		}
	}
}

five_chess_room.prototype.send_prop = function (p, to_seatid, propid, ret) {
	if (p.seatid === -1) {
		write_err(Respones.INVALIDI_OPT, ret_func);
		return;
	}

	if (p != this.seats[p.seatid]) {
		write_err(Respones.INVALIDI_OPT, ret_func);
		return;
	}

	if (!this.seats[to_seatid]) {
		write_err(Respones.INVALIDI_OPT, ret_func);
		return;
	}

	if (propid <= 0 || propid > 5) {
		write_err(Respones.INVALID_PARAMS, ret_func);
		return;
	}
	// 在房间里面广播，发送道具也能收到
	var body = {
		0: Respones.OK,
		1: p.seatid,
		2: to_seatid,
		3: propid,
	};
	this.room_broadcast(Stype.Game5Chess, 22, body);
	// end 
}

/**
 * 准备好开始 2024.4.22 添加
 * @param {*} p 
 * @param {*} ret_func 
 */
five_chess_room.prototype.do_player_ready = function (p, ret_func) {
	//玩家是否在房间内
	if (p != this.seats[p.seatid]) {
		write_err(Respones.INVALIDI_OPT, ret_func);
		return;
	}
	//end

	//房间是否已经准备好
	if (this.state != State.Ready || p.state != State.InView) {
		write_err(Respones.INVALIDI_OPT, ret_func);
		return;
	}
	//end

	p.do_ready();

	let body = {
		0: Respones.OK,
		1: p.seatid
	}
	this.room_broadcast(Stype.Game5Chess, 23, body, null);

	//准备开始游戏
	this.check_game_start();
}

/**
 * 检查是否可以开始游戏
 */
five_chess_room.prototype.check_game_start = function () {
	let ready_num = 0;//判断是否是两个都准备好了
	for (let i = 0; i < GAME_SEAT; i++) {
		if (!this.seats[i] || this.seats[i].state != State.Ready) {
			continue;
		}
		ready_num++;
	}

	if (ready_num >= 2) {
		this.game_start();//游戏准备开始
	}
}

/**
 * 游戏准备开始
 */
five_chess_room.prototype.game_start = function () {
	//改变状态
	this.state = State.Playing;
	//清理相关数据
	this.reset_chess_disk();
	//通知所有玩家游戏开始
	for (let i = 0; i < GAME_SEAT; i++) {
		//修改了一个bug 状态是不相同的时候进行操作 2024.4.24
		if (!this.seats[i] || this.seats[i].state != State.Ready) {
			continue;
		}
		this.seats[i].on_round_start();//设置成开始状态
	}

	//如果是黑子就是先开始
	if (this.black_rand) {
		this.black_rand = false;
		this.black_seatid = Math.random() * 2;
		this.black_seatid = Math.floor(this.black_seatid);
	} else {
		this.black_seatid = this.next_seat(this.black_seatid);
	}

	//广播到所有人
	// let body = {
	// 	0: this.think_time,
	// 	1: 3,
	// 	2: this.black_seatid
	// }
	let body = this.get_round_start_info();
	this.room_broadcast(Stype.Game5Chess, 24, body, null);
	this.cur_seatid = -1;//在这个游戏已经开始了，但是要等这个时间段
	setTimeout(this.trun_to_player.bind(this), 4500, this.black_seatid);
}

/**
 * 用户时间到了没有下棋就判输了
 * @param {*} seatid 
 */
five_chess_room.prototype.do_player_action_timeout = function (seatid) {
	this.action_timer = null;
	//结算
	// let winner_seat = GAME_SEAT - seatid - 1;
	// let winner = this.seats[winner_seat];
	// this.checkout_game(1, winner);
	//end
	this.turn_to_next();
}

/**
 * 归谁了
 * @param {*} seatid 
 */
five_chess_room.prototype.trun_to_player = function (seatid) {
	log.warn("turn_to_player", this.seats[seatid].state);
	if (this.action_timer != null) {
		clearTimeout(this.action_timer);
		this.action_timer = null;
	}

	if (!this.seats[seatid] || this.seats[seatid].state != State.Playing) {
		log.warn("turn_to_player: ", seatid, "seat is invalid!!!!");
		return;
	}

	//启动定时器
	this.action_timer = setTimeout(this.do_player_action_timeout.bind(this), this.think_time * 1000, seatid);
	this.action_timeout_timestamp = utils.timestamp() + this.think_time;
	//end

	let p = this.seats[seatid];
	p.turn_to_player(room);

	this.cur_seatid = seatid;
	let body = {
		0: this.think_time,
		1: seatid,
	};
	this.room_broadcast(Stype.Game5Chess, 25, body, null);
}

/**
 * 获得黑子的机会
 * @param {*} cur_seateid 
 * @returns 
 */
five_chess_room.prototype.next_seat = function (cur_seateid) {
	let i = cur_seateid;
	for (i = cur_seateid + 1; i < GAME_SEAT; i++) {
		if (this.seats[i] && this.seats[i].state == State.Playing) {
			return i;
		}
	}

	for (let i = 0; i < GAME_SEAT; i++) {
		if (this.seats[i] && this.seats[i].state == State.Playing) {
			return i;
		}
	}

	return -1;
}

five_chess_room.prototype.get_round_start_info = function () {
	let wait_client_time = 3000;
	let body = {
		0: this.think_time,
		1: wait_client_time,
		2: this.black_seatid
	}
	return body;
}

/**
 * 下棋的操作
 * @param {*} p 
 * @param {*} block_x 
 * @param {*} block_y 
 * @param {*} ret_func 
 */
five_chess_room.prototype.do_player_put_chess = function (p, block_x, block_y, ret_func) {
	//1.用户是否在房间
	if (p != this.seats[p.seatid]) {
		write_err(Respones.INVALIDI_OPT, ret_func);
		return;
	}
	//2.当前是否是这个玩家
	if (p.seatid != this.cur_seatid) {
		write_err(Respones.NOT_YOUR_TURN, ret_func);
		return;
	}
	//3.当前玩家是不是游戏状态
	if (this.state != State.Playing || p.state != State.Playing) {
		write_err(Respones.INVALIDI_OPT, ret_func);
		return;
	}
	//end
	//4.就是你发过来的区域是否合法.这里的算法是和飞机游戏的出界算法一样的
	if (block_x < 0 || block_x > 14 || block_y < 0 || block_y > 14) {
		write_err(Respones.INVALID_PARAMS, ret_func);
		return;
	}
	//end
	//判断是否已经有棋子了
	let index = block_y * 15 + block_x;
	if (this.chess_disk[index] != ChessType.NONE) {
		write_err(Respones.INVALIDI_OPT, ret_func);
		return;
	}

	//判断黑白子
	if (p.seatid == this.black_seatid) {
		this.chess_disk[index] = ChessType.BLACK;
	} else {
		this.chess_disk[index] = ChessType.WHITE;
	}

	//广播所有人
	let body = {
		0: Respones.OK,
		1: block_x,
		2: block_y,
		3: this.chess_disk[index],//黑白子的具体数据
	}
	this.room_broadcast(Stype.Game5Chess, 26, body, null);
	//停止计时器
	if (this.action_timer != null) {
		clearTimeout(this.action_timer);
		this.action_timer = null;
	}
	//结算部分
	let check_ret = this.check_game_over(this.chess_disk[index]);
	if (check_ret != 0) {
		log.error("game over!!!!", this.chess_disk[index], "result=", check_ret);
		this.checkout_game(check_ret, p);//检查是否有赢的状态
		return;
	}


	this.turn_to_next();
	// this.trun_to_player(next_seat);
}

five_chess_room.prototype.turn_to_next = function () {
	//下一个玩家操作
	let next_seat = this.get_next_seat();
	if (next_seat === -1) {
		log.error("cannot find next_seat !!!!");
		return;
	}

	this.trun_to_player(next_seat);
}

/**
 * 短线重连
 * @param {*} p 
 */
five_chess_room.prototype.do_reconnect = function (p) {
	if (room.state != State.Playing && p.state != State.Playing) {
		return;
	}

	//其他的玩家数据
	let seats_data = [];
	for (let i = 0; i < GAME_SEAT; i++) {
		if (!this.seats[i] || this.seats[i] == p || this.seats[i].state != State.Playing) {
			continue;
		}
		let arrived_data = this.get_user_arrived(this.seats[i]);
		seats_data.push(arrived_data);
	}

	//获得开局信息
	let round_start_info = this.get_round_start_info();
	let game_ctrl = [
		this.cur_seatid,
		this.action_timeout_timestamp - utils.timestamp(),
	];
	//传玩家自己的数据
	let body = {
		0: p.seatid,
		1: seats_data,
		2: round_start_info,
		3: this.chess_disk,
		4: game_ctrl
	}
	p.send_cmd(Stype.Game5Chess, 29, body);
}

/**
 * 获得下一个相关的操作
 */
five_chess_room.prototype.get_next_seat = function () {
	//从当前的seatid往后操作
	for (let i = this.cur_seatid + 1; i < GAME_SEAT; i++) {
		if (!this.seats[i] || this.seats[i].state != State.Playing) {
			continue;
		}
		return i;
	}

	for (let i = 0; i < this.cur_seatid; i++) {
		if (!this.seats[i] || this.seats[i].state != State.Playing) {
			continue;
		}
		return i;
	}

	return -1;
}


/**
 * 检查五子棋是否连线
 * @param {*} board 
 * @param {*} x 
 * @param {*} y 
 * @param {*} dx 
 * @param {*} dy 
 * @param {*} chess_type 
 * @returns 
 */
five_chess_room.prototype.checkFiveInLine = function (board, x, y, dx, dy, chess_type) {
	for (let i = 0; i < 5; i++) {
		if (board[(y + i * dy) * 15 + x + i * dx] !== chess_type) {
			return false;
		}
	}
	return true;
}

/**
 * 游戏是否已经结束 2024.4.24
 * @param {*} chess_type 
 */
five_chess_room.prototype.check_game_over = function (chess_type) {

	//检查四个方向
	const directions = [
		{ dx: 1, dy: 0 },  // 横向
		{ dx: 0, dy: 1 },  // 纵向
		{ dx: 1, dy: 1 },  // 左上到右下
		{ dx: 1, dy: -1 }  // 右上到左下
	];

	for (let y = 0; y < 15; y++) {
		for (let x = 0; x < 15; x++) {
			for (let direction of directions) {
				if (x + 4 * direction.dx < 15 && y + 4 * direction.dy < 15 && y + 4 * direction.dy >= 0 && this.checkFiveInLine(this.chess_disk, x, y, direction.dx, direction.dy, chess_type)) {
					return 1;  // 赢
				}
			}
		}
	}

	// 检查棋盘是否全部满了，如果没有满，表示游戏可以继续
	if (this.chess_disk.some(cell => cell === ChessType.NONE)) {
		return 0;  // 游戏继续
	}

	return 2;  // 平局
}

/**
 * 判断是否游戏结束，并且有用户过来
 * @param {*} ret 
 * @param {*} winner 
 */
five_chess_room.prototype.checkout_game = function (ret, winner) {
	//停掉计时器
	if (this.action_timer != null) {
		clearTimeout(this.action_timer);
		this.action_timer = null;
	}
	//是把房间的状态修改过来
	this.state = State.CheckOut;//检查状态
	//便利游戏进行结算
	for (let i = 0; i < GAME_SEAT; i++) {
		//判断是否不是游戏状态，因为现在已经都修改到了检查状态
		if (this.seats[i] === null || this.seats[i].state != State.Playing) {
			continue;
		}
		this.seats[i].checkout_game(this, ret, this.seats[i] === winner);//
	}

	let winner_soure = this.bet_chip;//赢得分数
	let winner_seat = winner.seatid;//赢得人得位置，使用这个判断是否是自己或者别人
	//平局得情况就没有赢家
	if (ret === 2) {
		winner_seat = -1;//没有赢家
	}

	let body = {
		0: winner_seat,
		1: winner_soure
	}

	//广播
	this.room_broadcast(Stype.Game5Chess, 27, body, null);
	//踢掉不满足要求的玩家
	for (let i = 0; i < GAME_SEAT; i++) {
		if (!this.seats[i]) {
			continue;
		}

		//判断金钱够不够
		if (this.seats[i].uchip < this.min_chip) {
			five_chess_model.kick_player_chip_not_enough(this.seats[i]);
			continue;
		}
		//end

		if (this.seats[i].session === null) {
			five_chess_model.kick_player_chip_not_enough(this.seats[i]);
			continue;
		}
	}

	//4秒以后结算
	let check_time = 4000;
	setTimeout(this.on_checkout_over.bind(this), check_time);
}

/**
 * 游戏结束
 */
five_chess_room.prototype.on_checkout_over = function () {
	//首先改变状态
	this.state = State.Ready;
	//清理数据
	for (let i = 0; i < GAME_SEAT; i++) {
		if (!this.seats[i] || this.seats[i].state != State.CheckOut) {
			continue;
		}
		//通知玩家游戏结算完成
		this.seats[i].on_checkout_over(this);
	}
	//广播给所有人
	this.room_broadcast(Stype.Game5Chess, 28, {}, null);
	// //剔除不能玩下一把的玩家
	// for (let i = 0; i < GAME_SEAT; i++) {
	// 	if (!this.seats[i]) {
	// 		continue;
	// 	}
	// 	//判断当前的玩家的金币是不是不够了
	// 	if (this.seats[i].uchip < this.min_chip) {
	// 		five_chess_model.kick_player_chip_not_enough(this.seats[i]);
	// 		continue;
	// 	}
	// }
}

module.exports = five_chess_room;

