var log = require("../../utils/log.js");
const Cmd = require("../Cmd.js");
const Stype = require("../Stype.js");
const Respones = require("../Respones.js");
const auth_model = require("./auth_model.js");
const CryptoJS = require("crypto-js");
const { center_redis } = require("../game_config.js");
const redis_center = require("../../database/redis_center.js");

/**
 * 游客登录
 * @param {*} session 
 * @param {*} utag 
 * @param {*} proto_type 
 * @param {*} body 
 */
function guest_login(session, utag, body) {
    if (!body) {
        session.send_cmd(Stype.Auth, Cmd.Auth.RES_GUEST_LOGIN, Respones.INVALID_PARAMS, utag);
        return;
    }

    var ukey = body;
    //创建数据库
    auth_model.guest_login(ukey, function (ret) {

        session.send_cmd(Stype.Auth, Cmd.Auth.RES_GUEST_LOGIN, ret, utag);
    })
}

/**
 * 用户相关的数据操作
 * @param {*} session 
 * @param {*} utag 
 * @param {*} body 
 * @returns 
 */
function exit_play(session, utag, body) {
    if (!body) {
        session.send_cmd(Stype.Auth, Cmd.Auth.RES_EDIT_PROFILE, Respones.INVALID_PARAMS, utag);
        return;
    }

    auth_model.edit_profile(body.uid, body.unick, function (res) {
        session.send_cmd(Stype.Auth, Cmd.Auth.RES_EDIT_PROFILE, res, utag);
    })
}
/**
 * 用户的升级账号操作
 * @param {*} session 
 * @param {*} uid 
 * @param {*} body 
 * @returns 
 */
function guest_bind_unmae_num(session, uid, body) {
    if (!body) {
        session.send_cmd(Stype.Auth, Cmd.Auth.RES_DO_GUEST, Respones.INVALID_PARAMS, uid);
        return;
    }
    log.error("upwd={}", body.upwd)
    auth_model.do_upgrade_guest_account(uid, body.uname, body.upwd, function (body) {
        session.send_cmd(Stype.Auth, Cmd.Auth.RES_DO_GUEST, body, uid);
    })
}

var service = {
    name: "auth_service", // 服务名称
    is_transfer: false, // 是否为转发模块,
    init: function () {
        log.info("auth_service service is start");
    },

    // 收到客户端给我们发来的数据
    on_recv_player_cmd: function (session, stype, ctype, body, utag, str_of_buf) {
        log.info(this.name + " on_recv_player_cmd: ", ctype, body, utag);
        switch (ctype) {
            case Cmd.Auth.GUEST_LOGIN:
                guest_login(session, utag, body);
                break;
            case Cmd.Auth.EDIT_PLAYER://用户编辑
                exit_play(session, utag, body);
                break;
            case Cmd.Auth.DO_GUEST_BIND://账号绑定相关
                guest_bind_unmae_num(session, utag, body);
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
