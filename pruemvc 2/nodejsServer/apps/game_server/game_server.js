var game_config = require("../game_config.js");
var netbus = require("../../netbus/netbus.js");
var service_manager = require("../../netbus/service_manager.js");
var Stype = require("../Stype.js");
const log = require("../../utils/log.js");
const five_chess_service = require("./five_chess_service.js");

//启动游戏服务器
const game_server = game_config.game_five_server;
netbus.start_ws_server(game_server.host, game_server.port);
//end
//注册游戏服务
service_manager.register_service(Stype.Game5Chess, five_chess_service);
//end

//链接中心数据库
const center_redis_config = game_config.center_redis;
const redis_center = require("../../database/redis_center.js");
redis_center.connect(center_redis_config.host, center_redis_config.port, center_redis_config.db_index);
//end

//链接游戏redis
const game_redis_config = game_config.game_redis;
const redis_game = require("../../database/redis_game.js");
redis_game.connect(game_redis_config.host, game_redis_config.port, game_redis_config.db_index);
//end

//链接游戏数据库
const game_mysql_config = game_config.game_database;
const mysql_game = require("../../database/mysql_game.js");
//end