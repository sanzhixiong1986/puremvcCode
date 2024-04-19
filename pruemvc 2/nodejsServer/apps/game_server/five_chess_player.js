function five_chess_player(uid) {
	this.uid = uid;

	this.uchip = 0;
	this.uvip = 0;
	this.uexp = 0;

	this.unick = "";
	this.usex = -1;
	this.uface = 0;

	this.zid = -1; // 玩家当前所在的区间
	this.room_id = -1;//玩家当前所在的房间id

	this.session = null; //客户端的引用
	this.seatid = -1;//玩家当前在房间的座位号，没有坐下就是-1
}

five_chess_player.prototype.init_ugame_info = function (ugame_info) {
	this.uchip = ugame_info.uchip;
	this.uvip = ugame_info.uvip;
	this.uexp = ugame_info.uexp;
}

five_chess_player.prototype.init_uinfo = function (uinfo) {
	this.unick = uinfo.unick;
	this.usex = uinfo.usex;
	this.uface = uinfo.uface;
}

/////////////////////4.16添加了两个属性//////////////////////////////
/**
 * 用户初始化session
 * @param {*} session 
 */
five_chess_player.prototype.init_session = function (session) {
	this.session = session;
}

/**
 * 发送数据部分
 * @param {*} stype 
 * @param {*} ctype 
 * @param {*} body 
 */
five_chess_player.prototype.send_cmd = function (stype, ctype, body) {
	if (!this.session) {
		return;
	}
	this.session.send_cmd(stype, ctype, body, this.uid);
}

/////////////////////end///////////////////////////////////////////

//2024.4.17 
/**
 * 进入房间
 * @param {*} room 
 */
five_chess_player.prototype.enter_room = function (room) {
}
/**
 * 退出房间
 * @param {*} room 
 */
five_chess_player.prototype.exit_room = function (room) {
}

/**
 * 坐下
 * @param {*} room 
 */
five_chess_player.prototype.sitdown = function (room) {
}

/**
 * 站起来的相关操作
 * @param {*} room 
 */
five_chess_player.prototype.standup = function (room) {
}
//end

module.exports = five_chess_player;