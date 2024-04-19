/**
 * gateway的注册类
 */

var netbus = require("../../netbus/netbus.js");
var proto_man = require("../../netbus/proto_buf.js");
var log = require("../../utils/log.js");
const Stype = require("../Stype.js");
const Cmd = require("../Cmd.js");
const Respones = require("../Respones.js");

//是否是登录命令
function is_login_cmd(stype, ctype) {
    if (stype == Stype.Auth && ctype == Cmd.Auth.GUEST_LOGIN) {
        return true;
    }
    return false;
}

function is_retuen_login(stype, ctype) {
    if (stype == Stype.Auth && ctype == Cmd.Auth.RES_GUEST_LOGIN) {
        return true;
    }
    return false;
}


var service = {
    name: "gw_service",  //服务器的名字
    is_transfer: true,   //是否是转发的模块

    init: function () {
        log.info("gateway init");
    },

    //收到客户端发给我们的消息 client->gateway
    on_recv_player_cmd: function (session, stype, ctype, body, utag, str_of_buf) {
        //获得session操作
        let server_session = netbus.get_server_session(stype);
        if (!server_session) {
            log.error("gateway on_recv_player_cmd server_session is error");
            return;
        }

        //判断是不是登录命令
        if (is_login_cmd(stype, ctype)) {
            utag = session.session_key;
        } else {
            //没有登录的话
            if (session.uid == 0) {
                return;
            }
            utag = session.uid;
        }
        let obj = JSON.parse(str_of_buf);
        obj['3'] = utag;
        server_session.send_encoded_cmd(JSON.stringify(obj));//发送数据
    },

    //收到我们链接服务器给我们的消息 module->gateway
    on_recv_server_return: function (session, stype, ctype, body, utag, raw_cmd) {
        //注册的相关操作
        let client_session;
        log.warn("on_recv_server_return={}", stype, ctype, raw_cmd, utag);
        if (is_retuen_login(stype, ctype)) {
            client_session = netbus.get_client_session(utag);
            if (!client_session) {
                log.warn("client_session is null");
                return;
            }

            //判断数据
            let cmd_ret = proto_man.decode_cmd(JSON.stringify(raw_cmd));
            body = cmd_ret[2];
            if (body.status == Respones.OK) {
                let prev_session = get_session_by_id(body.uid);
                if (prev_session) {
                    prev_session.send_cmd(stype, 7, -1001, utag);
                    prev_session.uid = 0;
                    netbus.session_close(prev_session);
                }

                client_session.uid = body.uid;
                save_session_width_uid(body.uid, client_session);
                raw_cmd = proto_man.encode_cmd(stype, ctype, body, utag);
            }
        }
        else {
            client_session = get_session_by_id(utag);
            if (!client_session) {
                log.warn("client_session is null get_session_by_id", utag);
                return;
            }
        }

        delete raw_cmd['3'];
        client_session.send_encoded_cmd(raw_cmd);
    },

    //收到客户端断开的消息
    on_player_disconnect: function (stype, uid) {
        //如果是登录模块
        if (stype == Stype.Auth) {
            clear_session_with_uid(uid)
        }

        let server_session = netbus.get_server_session(stype);
        if (!server_session) {
            log.error("gateway on_player_disconnect client_session is error")
            return;
        }
        let utag = uid;
        server_session.send_cmd(stype, Cmd.USER_DISCONNECT, null, utag);
    }
}

let uid_session_map = {};//uid的列表

/**
 * 根据id获得session
 * @param {*} uid 
 */
function get_session_by_id(uid) {
    return uid_session_map[uid];
}

/**
 * 注册对应的id
 * @param {*} uid 
 * @param {*} session 
 */
function save_session_width_uid(uid, session) {
    uid_session_map[uid] = session;
}

/**
 * 清空session的数据
 * @param {*} uid 
 */
function clear_session_with_uid(uid) {
    uid_session_map[uid] = null;
    delete uid_session_map[uid];
}

service.get_session_by_id = get_session_by_id;

module.exports = service;