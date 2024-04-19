const gw_service = require("./gw_service.js");
const log = require("../../utils/log.js");

var service = {
    name: "broadcast service",
    is_transfer: false, // 是否为转发模块,
    init: function () {
        log.info(this.name + "is start");
    },

    // 收到客户端给我们发来的数据
    on_recv_player_cmd: function (session, stype, ctype, body, utag, str_of_buf) {
    },

    // 收到我们连接的服务给我们发过来的数据;
    on_recv_server_return: function (session, stype, ctype, body, utag, proto_type, raw_cmd) {
        let cmd_buf = body.cmd_buf;
        let users = body.users;//用户的对象
        //广播
        for (let i in users) {
            const client_session = gw_service.get_session_by_id(users[i]);
            if (!client_session) {
                continue;
            }
            client_session.send_encoded_cmd(cmd_buf);
        }
    },

    // 收到客户端断开连接;
    on_player_disconnect: function (stype, session) {
    },
}

module.exports = service;