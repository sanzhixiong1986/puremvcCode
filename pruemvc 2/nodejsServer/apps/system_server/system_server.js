//游戏系统的服务器
const game_config = require("../game_config.js");
const Stype = require("../Stype.js");
const netbus = require("../../netbus/netbus.js");
const service_manager = require("../../netbus/service_manager.js");
const game_system_service = require("./game_system_service.js");

const game_system = game_config.game_system_server;             //大的游戏服务器
netbus.start_ws_server(game_system.host, game_system.port);     //链接游戏的服务器

service_manager.register_service(Stype.GameSystem, game_system_service); //注册gateway里面

//链接中心服务器
const center_eredis_config = game_config.center_redis;
const redis_center = require("../../database/redis_center.js");
redis_center.connect(center_eredis_config.host, center_eredis_config.port, center_eredis_config.db_index);
//end

//链接游戏redis
const game_redis_config = game_config.game_redis;
const redis_game = require("../../database/redis_game.js");
redis_game.connect(game_redis_config.host, game_redis_config.port, game_redis_config.db_index);
//end

//链接中心数据库
const mysql_center = require("../../database/mysql_center.js");//链接数据库

//链接游戏服务器
const mysql_game = require("../../database/mysql_game.js");//链接游戏服务器