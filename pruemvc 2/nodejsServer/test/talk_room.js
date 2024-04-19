var log = require("../utils/log.js");
var proto_man = require("../netbus/proto_man.js");

//相关的操作数据
var SYSTEM_TALKROOM = 1; //这个是代表服务器的相关操作
//消息的编号
var TalkCmd = {
    Enter: 1, // 用户进来
    Exit: 2, // 用户离开ia
    UserArrived: 3, // 别人进来;
    UserExit: 4, // 别人离开

    SendMsg: 5, // 自己发送消息,
    UserMsg: 6, // 收到别人的消息
};
//发送服务器的返回数据相关
var Respones = {
    OK: 1,
    IS_IN_TALKROOM: -100, // 玩家已经在聊天室
    NOT_IN_TALKROOM: -101, // 玩家不在聊天室
    INVALD_OPT: -102, // 玩家非法操作
    INVALID_PARAMS: -103, // 命令格式不对
};

/**
 * 用户进入聊天室的操作
 * @param {*} session 进入聊天室的客户端 
 * @param {*} body    消息的主体
 */
var room = {};//是否在一个聊天室里面
function on_user_enter_talkroom(session, body) {
    //如果姓名或者性别为null则给出错误的判断
    if (!body.uname || !body.usex) {
        session.send_cmd(SYSTEM_TALKROOM, TalkCmd.Enter, Respones.INVALID_PARAMS);
        return;
    }
    //是否在聊天室
    if (room[session.session_key]) {
        session.send_cmd(SYSTEM_TALKROOM, TalkCmd.Enter, Respones.IS_IN_TALKROOM);
        return;
    }
    //所有条件都满足了就是成功了
    session.send_cmd(SYSTEM_TALKROOM, TalkCmd.Enter, Respones.OK);

    //广播所有人
    broadcast_cmd(TalkCmd.UserArrived, body, session);

    //广播在聊天室的所有人
    for (var key in room) {
        session.send_cmd(SYSTEM_TALKROOM, TalkCmd.UserArrived, room[key].uinfo);
    }
    //把用户保存到聊天室里
    let talkman = {
        session: session,
        uinfo: body
    }
    room[session.session_key] = talkman;
}

//离开操作
function on_user_exit_talkroom(session, is_lost_connect) {
    //是否在聊天室不在就不用往下继续了
    if (!room[session.session_key]) {
        if (!is_lost_connect) {
            session.send_cmd(SYSTEM_TALKROOM, TalkCmd.Exit, Respones.NOT_IN_TALKROOM);
        }
        return;
    }
    //全体广播
    broadcast_cmd(TalkCmd.UserExit, room[session.session_key].uinfo, session);
    //从数据中把对象移除
    room[session.session_key] = null;
    delete room[session.session_key];

    if (!is_lost_connect) {
        session.send_cmd(SYSTEM_TALKROOM, TalkCmd.Exit, Respones.OK);
    }
}

//广播操作
function broadcast_cmd(ctype, body, noto_user) {
    var json_encoded = null;
    for (var key in room) {
        if (room[key].session == noto_user) {
            continue;
        }
        var session = room[key].session;
        if (json_encoded == null) {
            json_encoded = proto_man.encode_cmd(SYSTEM_TALKROOM, ctype, body);
        }
        session.send_encoded_cmd(json_encoded);//转发对应的消息
    }
}

//收到发送消息的信息
function on_user_send_msg(session, msg) {
    log.info("收到客户端发送的消息");
    //首先判断是否在聊天室里面
    if (!room[session.session_key]) {
        session.send_cmd(SYSTEM_TALKROOM, TalkCmd.SendMsg, { 0: Respones.INVALD_OPT });
        return;
    }

    //返回给客户端发送消息
    session.send_cmd(SYSTEM_TALKROOM, TalkCmd.SendMsg, {
        0: Respones.OK,
        1: room[session.session_key].uinfo.uname,
        2: room[session.session_key].uinfo.usex,
        3: msg
    });
    //广播对应的消息
    broadcast_cmd(TalkCmd.UserMsg, {
        0: room[session.session_key].uinfo.uname,
        1: room[session.session_key].uinfo.usex,
        2: msg,
    }, session);
}

var service = {
    stype: SYSTEM_TALKROOM,
    name: "talkroom",

    //模块的初始化
    init: function () {
        log.info(this.name + "services init!!!!");
    },

    //接受客户端返回来的数据
    on_recv_player_cmd: function (session, ctype, body) {
        log.info(this.name + " on_recv_player_cmd: ", ctype, body);
        switch (ctype) {
            case TalkCmd.Enter://进入游戏的消息
                on_user_enter_talkroom(session, body);
                break;
            case TalkCmd.Exit://主动离开
                on_user_exit_talkroom(session, false);
                break;
            case TalkCmd.SendMsg://聊天的发送
                on_user_send_msg(session, body);
                break;
        }
    },

    //服务器链接掉线的相关的操作
    on_player_disconnect: function (session) {
        log.info(this.name + " on_player_disconnect: ", session.session_key);
        on_user_exit_talkroom(session, true);
    }
}

module.exports = service;
