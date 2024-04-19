var log = require("../utils/log.js");
var netbus = require("../netbus/netbus.js");


/**
 * 加密
 * @param {*} str_of_buf 需要加密得数据 
 */
function encrypt_cmd(str_of_buf) {
    return str_of_buf;
}

/**
 * 解密
 * @param {*} str_of_buf 解密数据 
 */
function decrypt_cmd(str_of_buf) {
    return str_of_buf;
}

/**
 * 接受数据构建
 * @param {*} stype 
 * @param {*} ctype 
 * @param {*} body 
 */
function encode_cmd(stype, ctype, body, utag) {
    let buf = null;
    buf = _json_encode(stype, ctype, body, utag);

    if (buf) {
        buf = encrypt_cmd(buf);
    }
    return buf;
}

/**
 * 构造json数据得操作
 * @param {*} stype 服务器
 * @param {*} ctype 序列号
 * @param {*} body  具体得数据
 */
function _json_encode(stype, ctype, body, utag) {
    let cmd = {};
    cmd[0] = stype;
    cmd[1] = ctype;
    cmd[2] = body;
    cmd[3] = utag;
    var str = JSON.stringify(cmd);
    return str;
}

/**
 * 数据得构建
 * @param {*} str_or_buf 
 */
function decode_cmd(str_or_buf) {
    str_or_buf = decrypt_cmd(str_or_buf);//解密数据相关
    return json_decode(str_or_buf);
}

/**
 * 
 * @param {*} cmd_json 
 */
function json_decode(cmd_json) {
    let cmd = JSON.parse(cmd_json);
    if (!cmd ||
        typeof (cmd[0]) == "undefined" ||
        typeof (cmd[1]) == "undefined" ||
        typeof (cmd[2]) == "undefined") {
        return null;
    }
    return cmd;
}

var proto_man = {}
proto_man.decode_cmd = decode_cmd;
proto_man.encode_cmd = encode_cmd;
proto_man.encrypt_cmd = encrypt_cmd;
proto_man.decrypt_cmd = decrypt_cmd;


module.exports = proto_man;