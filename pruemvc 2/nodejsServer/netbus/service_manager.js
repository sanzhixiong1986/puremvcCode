/**
 * 模块的相关操作
 */
var log = require("../utils/log.js");
var proto_man = require("../netbus/proto_man.js");

var service_modules = {};//模块的绑定操作数据

/**
 * 注册绑定模块
 * @param {*} stype 
 * @param {*} session 
 */
function register_service(stype, service) {
    if (service_modules[stype]) {
        log.warn("service is registed");
    }

    service_modules[stype] = service;
    service.init();//初始化模块的操作
}

/**
 * 获得客户端指令
 * @param {*} session 
 * @param {*} str_of_buf 
 */
function on_recv_client_cmd(session, str_of_buf) {
    let cmd = proto_man.decode_cmd(str_of_buf);
    if (!cmd) {
        return false;
    }
    let stype, ctype, body, utag;
    stype = cmd[0];
    ctype = cmd[1];
    body = cmd[2];
    utag = cmd[3];//添加一个标识
    if (!service_modules[stype]) {
        return;
    }

    //对应的模块
    if (service_modules[stype].is_transfer) {
        //根据
        service_modules[stype].on_recv_player_cmd(session, stype, ctype, body, utag, str_of_buf);
        return true
    }

    service_modules[stype].on_recv_player_cmd(session, stype, ctype, body, utag, str_of_buf);
    return true;
}

/**
 * 客户端关闭的走
 * @param {*} session 
 */
function on_client_lost_connect(session) {
    let uid = session.uid;
    if (uid === 0) {
        log.warn("on_client_lost_connect uid == 0");
        return;
    }
    session.uid = 0;
    for (var key in service_modules) {
        service_modules[key].on_player_disconnect(key, uid);
    }
}

//////////////////////////////////////////////////////////////////////////////////////////


//服务器返回数据的方法
function on_recv_server_return(session, cmd_buf) {
    //session是否要加密
    cmd_buf = proto_man.decrypt_cmd(cmd_buf);

    //组装数据
    let stype, ctype, body, utag;
    let cmd = proto_man.decode_cmd(cmd_buf);
    if (!cmd) {
        return false;
    }

    //把数据取出来
    stype = cmd[0];
    ctype = cmd[1];
    utag = cmd[3];
    //判断是否返回的操作方法
    if (service_modules[stype].is_transfer) {
        //返回对应的数据相关
        service_modules[stype].on_recv_server_return(session, stype, ctype, null, utag, cmd);
        return true;
    }

    var cmd_bufs = proto_man.decode_cmd(cmd_buf);
    if (!cmd_bufs) {
        return false;
    }
    body = cmd[2];
    service_modules[stype].on_recv_server_return(session, stype, ctype, body, utag, cmd);
}


/////////////////////////////////////////////////////////////////////////////////////////

var service_manager = {
    on_client_lost_connect: on_client_lost_connect,
    on_recv_client_cmd: on_recv_client_cmd,
    register_service: register_service,
    on_recv_server_return: on_recv_server_return
};

module.exports = service_manager;