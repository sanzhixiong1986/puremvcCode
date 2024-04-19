const log = require("../../utils/log.js");
const Stype = require("../Stype.js");
const Cmd = require("../Cmd.js");
const Respones = require("../Respones.js");

const system_model = require("./game_system_model.js");
//获得游戏信息
function get_game_info(session, uid, body) {
    system_model.get_game_info(uid, function (body) {
        session.send_cmd(Stype.GameSystem, Cmd.GameSystem.GET_GAME_INFO, body, uid);
    })

}

//获得今天相关的操作
function get_login_bonuse_info(session, uid, body) {
    system_model.get_login_bonues_info(uid, function (res) {
        log.info("get_login_bonuse_info===", body);
        session.send_cmd(Stype.GameSystem, Cmd.GameSystem.LOGIN_BONUES_INFO, res, uid);
    });
}

//获得当前的奖品
function recv_login_bonuse(session, uid, body) {
    //数据错误
    if (!body) {
        session.send_cmd(Stype.GameSystem, Cmd.GameSystem.RECV_LOGIN_BUNUES, Respones.INVALID_PARAMS, uid);
        return;
    }

    let bonuesid = body;
    system_model.recv_login_bonues(uid, bonuesid, function (res) {
        session.send_cmd(Stype.GameSystem, Cmd.GameSystem.RECV_LOGIN_BUNUES, res, uid);
    });
}

//世界排行榜的操作函数
function get_world_rank_info(session, uid, body) {
    //查询数据库以一个排行进行取前10的操作
    system_model.get_world_rank_info(uid, function (res) {
        session.send_cmd(Stype.GameSystem, Cmd.GameSystem.GET_WORLD_RANK_INFO, res, uid);
    })
}

var service = {
    name: "game_system_service", // 服务名称
    is_transfer: false, // 是否为转发模块,
    init: function () {
        log.info("game_system_service service is start");
    },

    // 收到客户端给我们发来的数据
    on_recv_player_cmd: function (session, stype, ctype, body, utag, str_of_buf) {
        log.info(this.name + "=game_system_service on_recv_player_cmd: ", ctype, body, utag);
        switch (ctype) {
            case Cmd.GameSystem.GET_GAME_INFO:
                get_game_info(session, utag, body);
                break;
            case Cmd.GameSystem.LOGIN_BONUES_INFO:
                get_login_bonuse_info(session, utag, body);
                break;
            case Cmd.GameSystem.RECV_LOGIN_BUNUES:
                recv_login_bonuse(session, utag, body);
                break;
            case Cmd.GameSystem.GET_WORLD_RANK_INFO:
                get_world_rank_info(session, utag, body);
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