var game_config = require("../game_config.js");
var netbus = require("../../netbus/netbus.js");
var service_manager = require("../../netbus/service_manager.js");
var Stype = require("../Stype.js");
var auth_service = require("./auth_service.js");

//注册
var center = game_config.center_server;
netbus.start_ws_server(center.host, center.prot);
service_manager.register_service(Stype.Auth, auth_service);

var mysql_center = require("../../database/mysql_center.js");//链接数据库

const center_eredis_config = game_config.center_redis;
const redis_center = require("../../database/redis_center.js");
redis_center.connect(center_eredis_config.host, center_eredis_config.port, center_eredis_config.db_index);