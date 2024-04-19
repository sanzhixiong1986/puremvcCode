var proto_man = require("../../netbus/proto_buf.js");
var netbus = require("../../netbus/netbus.js");
var service_manager = require("../../netbus/service_manager.js");
var talkroom = require("./talkroom.js");
const game_config = require("../game_config.js");

netbus.start_ws_server(game_config.game_server[0].host, game_config.game_server[0].port);

service_manager.register_service(1, talkroom);