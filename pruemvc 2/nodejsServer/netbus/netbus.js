var net = require("net");
var ws = require("ws");

var log = require("../utils/log.js");//日志类
var service_manager = require("../netbus/service_manager.js");
var proto_man = require("../netbus/proto_man.js");

var netbus = {};


var global_session_list = {}; //列表
var global_session_key = 1;   //关键字

/**
 * 开启ws服务
 * @param {*} ip 
 * @param {*} port 
 */
function start_ws_server(ip, port) {
    log.info("start ws server ..", ip, port);
    //创建对象
    var server = new ws.Server({
        host: ip,
        port: port
    })

    server.on("connection", function (client_sock) {
        ws_add_client_session_event(client_sock);
    });

    server.on("error", function (error) {
        log.error("ws server listen error=" + error);
    });

    server.on("close", function (error) {
        log.error("ws server listen close=" + error);
    });
}

/**
 * 添加客户端
 * @param {*} session 
 */
function ws_add_client_session_event(session) {
    //关闭
    session.on("close", function () {
        on_session_exit(session);
    })

    //错误事件
    session.on("error", function (error) {
    })

    //收到消息
    session.on("message", function (data) {
        on_session_recv_cmd(session, data);
    });

    on_session_enter(session);
}

/**
 * hu
 * @param {*} session 
 * @param {*} str_or_buf 
 */
function on_session_recv_cmd(session, str_or_buf) {
    //客户端发送的消息接收端
    if (!service_manager.on_recv_client_cmd(session, str_or_buf)) {
        session_close();
    }
}

/**
 * 关闭相关的操作
 * @param {*} session 
 */
function on_session_exit(session) {
    log.info("session exit !!!!");
    session.is_connected = false;
    service_manager.on_client_lost_connect(session);//处理下线的相关操作
    if (global_session_list[global_session_key]) {
        global_session_list[global_session_key] = null;
        delete global_session_list[global_session_key]; //删除对应的数据
        session.session_key = null;
    }
}

/**
 * 引用用户的信息
 * @param {*} session 
 */
function on_session_enter(session) {
    session.is_connected = true;//是否是鏈接狀態
    session.uid = 0; //用户的唯一id

    //session擴展的兩個方法
    session.send_encoded_cmd = session_send_encoded_cmd;//發送數據
    session.send_cmd = session_send_cmd;
    //end

    global_session_list[global_session_key] = session;//装入列表中
    session.session_key = global_session_key;
    global_session_key++;
}

/**
 * 关闭链接
 * @param {*} session 
 */
function session_close(session) {
    if (session) {
        session.close();//关闭链接
        session = null;
    }
}

//session的发送方法
function session_send_encoded_cmd(cmd) {
    if (!this.is_connected) {
        log.warn("session_send_encoded_cmd = session is null");
        return;
    }
    if (typeof (cmd) === 'object') {
        this.send(JSON.stringify(cmd));
    } else {
        this.send(cmd);
    }
}

/**
 * session 的扩展方法
 * @param {*} ctype 
 * @param {*} ctype 
 * @param {*} body 
 */
function session_send_cmd(stype, ctype, body, utag) {
    if (!this.is_connected) {
        return;
    }

    let cmd = null;
    cmd = proto_man.encode_cmd(stype, ctype, body, utag);
    if (cmd) {
        this.send_encoded_cmd(cmd);
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////
//链接服务的关键代码
//作为客户端链接对应的服务器
function connect_tcp_server(stype, host, port) {
    let url = `ws://${host}:${port}/ws`
    let session = new ws(url);
    session.is_connected = false;//没有链接
    session.on("open", function () {
        //链接成功
        on_session_connected(stype, session);
    })

    //关闭操作
    session.on("close", function () {
        //相关的操作
        if (session.is_connected == true) {
            on_session_disconnect(session);
        }
        session.close();
        //每隔一段时间进行链接一次
        setTimeout(function () {
            log.warn("reconnect: ", stype, host, port);
            connect_tcp_server(stype, host, port);
        }, 3000);
    })

    session.on("message", function (data) {
        //接受到数据部分
        if (data == null) {
            session_close();
            return;
        }
        on_recv_cmd_server_return(session, data);//接受数据的地方
    })

    session.on("error", function () {
        //错误信息
    })
}

//接入服务器的session列表
var server_connect_list = {};
function on_session_connected(stype, session) {
    session.last_pkg = null;
    session.is_connected = true;
    //扩展方法
    session.send_encoded_cmd = session_send_encoded_cmd;
    session.send_cmd = session_send_cmd;
    //扩展结束
    //加入到session列表中
    server_connect_list[stype] = session;
    // session.session_key = global_session_key;
    //修改时间为2024.4.15
    session.session_key = stype;
}

//客户端关闭操作
function on_session_disconnect(session) {
    session.is_connected = false;
    let stype = session.session_key;
    session.last_pkg = null;
    session.session_key = null;
    //判断是否存在如果存在就清除出列表中
    if (server_connect_list[stype]) {
        server_connect_list[stype] = null;
        delete server_connect_list[stype];
    }
}

//接受数据的地方
function on_recv_cmd_server_return(session, str_or_buf) {
    log.info("on_recv_cmd_server_return={}{}", str_or_buf);
    if (!service_manager.on_recv_server_return(session, str_or_buf)) {
        session_close();
    }
}

//session接入服务器
function get_server_session(stype) {
    return server_connect_list[stype];
}

//获得客户端的操作
function get_client_session(session_key) {
    return global_session_list[session_key];
}
////////////////////////////////////////////////////////////////////////////////////////////////////

//关闭相关的操作
netbus.start_ws_server = start_ws_server;
netbus.session_close = session_close;
netbus.connect_tcp_server = connect_tcp_server;
netbus.get_server_session = get_server_session;
netbus.get_client_session = get_client_session;

module.exports = netbus;