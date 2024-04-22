var Respones = require("../Respones.js");
var redis_center = require("../../database/redis_center.js");
var redis_game = require("../../database/redis_game.js");
var mysql_game = require("../../database/mysql_game.js");
var utils = require("../../utils/utils.js");
var log = require("../../utils/log.js");
var Stype = require("../Stype.js");
var Cmd = require("../Cmd.js");
const proto_man = require("../../netbus/proto_man.js");


var INVIEW_SEAT = 20;
var GAME_SEAT = 2; // 

/**
 * 发送错误信息的功能
 * @param {*} status 
 * @param {*} ret_func 
 */
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
}

five_chess_room.prototype.search_empty_seat_inview = function () {
	for (var i = 0; i < INVIEW_SEAT; i++) {
		if (this.inview_players[i] == null) {
			return i;
		}
	}

	return -1;
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
	// 对坐下来的两个人进行操作
	for (let i = 0; i < GAME_SEAT; i++) {
		if (!this.seats[i]) {
			continue;
		}

		let other = this.seats[i];
		let body = {
			0: other.seatid,
			1: other.unick,
			2: other.usex,
			3: other.uface,
			4: other.uchip,
			5: other.uexp,
			6: other.uvip,
		}
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

	// 广播给所有的玩家(旁观的玩家),玩家坐下,
	var body = {
		0: sv_seat,
		1: p.unick,
		2: p.usex,
		3: p.uface,
		4: p.uchip,
		5: p.uexp,
		6: p.uvip,
	};
	this.room_broadcast(Stype.Game5Chess, Cmd.Game5Chess.USER_ARRIVED, body, p.uid);
	// end  
}

five_chess_room.prototype.do_exit_room = function (p) {
	// ....
	if (p.seatid != -1) {
		var seatid = p.seatid;
		log.error(p.uid, "standup at seat: ", p.seatid);
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

	// 广播给所有的玩家(旁观的玩家), 玩家离开了房间
	// end 
}

five_chess_room.prototype.search_empty_seat = function () {
	for (var i = 0; i < GAME_SEAT; i++) {
		if (this.seats[i] === null) {
			return i;
		}
	}

	return -1;
}

/**
 * 空位置
 * @returns 
 */
five_chess_room.prototype.empty_seat = function () {
	var num = 0;
	for (var i in this.seats) {
		if (this.seats[i] === null) {
			num++;
		}
	}
	return num;
}

/**
 * 广播
 * @param {*} stype 
 * @param {*} ctype 
 * @param {*} body 
 * @param {*} not_to_uid 
 */
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
			log.warn("群发数据");
			gw_session.send_cmd(Stype.Broadcast, Cmd.BROADCAST, body, this.inview_players[i].uid);
		}
	}
}

/**
 * 发送礼物相关的操作
 * @param {*} p 		用户的信息
 * @param {*} to_seatid 发送人物的信息相关
 * @param {*} propid 	礼物的id
 * @param {*} ret_func 		返回函数
 */
five_chess_room.prototype = function send_prop(p, to_seatid, propid, ret_func) {
	//用户没有进入房间
	if (p.seatid === -1) {
		write_err(Respones.INVALIDI_OPT, ret_func);
		return;
	}

	//判断这两个人是不是房间里面并且是坐下的状态
	if (p != this.seats[p.seatid]) {
		write_err(Respones.INVALIDI_OPT, ret_func);
		return;
	}

	if (!this.seats[to_seatid]) {
		write_err(Respones.INVALIDI_OPT, ret_func);
		return;
	}
	//end

	//礼物不是在范围内的就报错
	if (propid <= 0 || propid > 5) {
		write_err(Respones.INVALIDI_OPT, ret_func);
		return;
	}

	let body = {
		0: Respones.OK,
		1: p.seatid,
		2: to_seatid,
		3: propid,
	}

	this.room_broadcast(Stype.Game5Chess, Cmd.Game5Chess.SEND_PROP, body);
}

module.exports = five_chess_room;