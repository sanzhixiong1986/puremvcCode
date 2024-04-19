var log = require("../utils/log.js");
var netbus = require("../netbus/netbus.js");
var proto_man = require("../netbus/proto_man.js");

var data = {
    uname: "black",
    upwd: "123456",
}

var buf = proto_man.encode_cmd(1, 1, data);
log.info(buf);
var cmd = proto_man.decode_cmd(buf);
log.info(cmd);