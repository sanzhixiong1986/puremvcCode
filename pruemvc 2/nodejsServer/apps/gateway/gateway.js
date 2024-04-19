var proto_man = require("../../netbus/proto_buf.js");
var netbus = require("../../netbus/netbus.js");
var service_manager = require("../../netbus/service_manager.js");
const game_config = require("../game_config.js");
var gw_service = require("./gw_service.js");
var bc_service = require("./bc_service.js");
var Stype = require("../Stype.js");

let host = game_config.gateway_config.host;
let posts = game_config.gateway_config.ports;

netbus.start_ws_server(host, posts[1]);

service_manager.register_service(Stype.Broadcast, bc_service);//启动广播服务

//游戏服务器
var game_server = game_config.game_server;
for (let key in game_server) {
    netbus.connect_tcp_server(game_server[key].stype, game_server[key].host, game_server[key].port);
    service_manager.register_service(game_server[key].stype, gw_service);
}