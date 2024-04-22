const log = require("../../utils/log.js");
const Respones = require("../Respones.js");
const Stype = require("../Stype.js");
const Cmd = require("../Cmd.js");
const utils = require("../../utils/utils.js");


var five_chess_model = require("./five_chess_model.js");
require("../gateway/bc_service.js");


//进入房间的函数
function enter_zone(session, utag, body) {
    //判断数据出现问题
    if (!body) {
        session.send_cmd(Stype.Game5Chess, Cmd.Game5Chess.ENTER_ZONE, Respones.INVALID_PARAMS, uid);
        return;
    }

    let zid = body;//发送zid为数据
    //2024.4.17添加参数session
    five_chess_model.enter_zone(utag, zid, session, function (res) {
        //进行数据库的相关查询
        session.send_cmd(Stype.Game5Chess, Cmd.Game5Chess.ENTER_ZONE, res, utag);
    })
}

//退出房间
function user_quit(session, utag, body) {
    five_chess_model.user_quit(utag, function (res) {
        session.send_cmd(Stype.Game5Chess, Cmd.Game5Chess.USER_QUIT, res, utag);
    })
}

//发送礼物的消息
function send_prop(session, utag, body) {
    if (!body) {
        session.send_cmd(Stype.Game5Chess, Cmd.Game5Chess.SEND_PROP, Respones.INVALID_PARAMS, utag);
        return;
    }
    let propid = body[0];       //礼物的id
    let to_seatid = body[1];    //要发送给谁
    five_chess_model.send_prop(utag, to_seatid, propid, function (res) {
        session.send_cmd(Stype.Game5Chess, Cmd.Game5Chess.SEND_PROP, res, utag);
    })
}

//用户准备的消息
function do_player_ready(session, utag, body) {
    five_chess_model.do_player_ready(utag, function (res) {
        session.send_cmd(Stype.Game5Chess, 23, res, utag);
    });
}

var service = {
    name: "five_chess_service", // 服务名称
    is_transfer: false, // 是否为转发模块,

    init: function () {
        log.info("five_chess_service is start");
    },

    // 收到客户端给我们发来的数据
    on_recv_player_cmd: function (session, stype, ctype, body, utag, str_of_buf) {
        log.info(this.name + " on_recv_player_cmd: ", ctype, body, utag);
        switch (ctype) {
            //进入游戏
            case Cmd.Game5Chess.ENTER_ZONE:
                enter_zone(session, utag, body);
                break;
            case Cmd.Game5Chess.USER_QUIT:
                user_quit(session, utag, body)
                break;
            case Cmd.USER_DISCONNECT://主动退出
                five_chess_model.user_lost_connect(utag);
                break;
            case 22://游戏发送礼物
                send_prop(session, utag, body);
                break;
            case 23: //发送准备消息
                do_player_ready(session, utag, body);
                break;
        }
    },

    // 收到我们连接的服务给我们发过来的数据;
    on_recv_server_return: function (session, stype, ctype, body, utag, proto_type, raw_cmd) {
    },

    // 收到客户端断开连接;
    on_player_disconnect: function (stype, session) {
    },
};

module.exports = service;