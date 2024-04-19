/**
 * 中心redis的操作
 */

const redis = require("redis");
const log = require("../utils/log.js");
const Respones = require("../apps/Respones.js");
const util = require("util");
const utils = require("../utils/utils.js");

var center_redis = null;

/**
 * 链接redis数据库
 * @param {*} host 
 * @param {*} port 
 * @param {*} db_index 
 */
function connect_to_center(host, port, db_index) {
    center_redis = redis.createClient({
        host: host,
        port: port,
        db: db_index
    });

    if (!center_redis.isOpen) {
        center_redis.connect()

    }

    center_redis.on("error", function (err) {
        log.error(err);
    });

    center_redis.on("connect", () => {
        log.info('Connected to Center_Redis')
    })
}

log.info("redis =", center_redis)
async function set_uinfo_inredis(uid, uinfo) {
    if (center_redis === null) {
        log.error("center_redis = null")
        return;
    }

    var key = "bycw_center_user_uid_" + uid;
    uinfo.uface = uinfo.uface.toString();
    uinfo.usex = uinfo.usex.toString();
    uinfo.uvip = uinfo.uvip.toString();
    uinfo.is_guest = uinfo.is_guest.toString();
    uinfo.guest_key = uinfo.guest_key.toString();
    uinfo.uname = uinfo.uname.toString();
    uinfo.is_guest = uinfo.is_guest.toString();

    log.info("redis center hmset " + key);
    const fieldsAndValues = Object.entries(uinfo).flat();
    log.info("redis center hmset " + fieldsAndValues);
    try {
        // 假设 fieldsAndValues 是一个对象或者键值对数组
        await center_redis.HSET(key, fieldsAndValues);
        log.info("插入成功");
    } catch (err) {
        log.error(err);
    }
}

// callback(status, body)
async function get_uinfo_inredis(uid, callback) {
    if (center_redis === null) {
        callback(Respones.SYSTEM_ERR, null);
        return;
    }

    var key = "bycw_center_user_uid_" + uid;
    log.info("HGETALL ", key);
    try {
        let results = null
        results = await center_redis.HGETALL(key);
        log.info("Results:================================================", results);
        callback(Respones.OK, results);

    } catch (err) {
        log.error('Redis operation error:', err);
    }
}


module.exports = {
    connect: connect_to_center,
    set_uinfo_inredis: set_uinfo_inredis,
    get_uinfo_inredis: get_uinfo_inredis,
};