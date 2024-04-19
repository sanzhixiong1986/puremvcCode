var netbus = require("../netbus/netbus.js");
var service_manager = require("../netbus/service_manager.js");
var talkroom = require("../test/talk_room.js");

netbus.start_ws_server("127.0.0.1", 6081);//默认为json输入格式

//注册聊天室的相关操作
service_manager.register_service(1, talkroom);