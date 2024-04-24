/**
 * 中心redis的操作
 */

const redis = require("redis");
const log = require("../utils/log.js");
const Respones = require("../apps/Respones.js");
const util = require("util");
const utils = require("../utils/utils.js");

var game_redis = null;

/**
 * 链接redis数据库
 * @param {*} host 
 * @param {*} port 
 * @param {*} db_index 
 */
async function connect_to_center(host, port, db_index) {
    game_redis = redis.createClient({
        host: host,
        port: port,
        db: db_index
    });

    if (!game_redis.isOpen) {
        await game_redis.connect()

    }

    game_redis.on("error", function (err) {
        log.error(err);
    });

    game_redis.on("connect", () => {
        log.info('Connected to game_Redis!!!!!!')
    })
}

async function set_ugame_info_inredis(uid, ugame_info) {
    if (game_redis === null) {
        log.error("game_redis = null")
        return;
    }

    let key = "bycw_game_user_uid_" + uid;
    ugame_info.uchip = ugame_info.uchip.toString();
    ugame_info.uexp = ugame_info.uexp.toString();
    ugame_info.uvip = ugame_info.uvip.toString();

    const fieldsAndValues = Object.entries(ugame_info).flat();
    try {
        // 假设 fieldsAndValues 是一个对象或者键值对数组
        await game_redis.HSET(key, fieldsAndValues);
        log.info("插入game_redis成功");
    } catch (err) {
        log.error(err);
    }
}

// callback(status, body)
async function get_ugame_info_inredis(uid, callback) {
    if (game_redis === null) {
        callback(Respones.SYSTEM_ERR, null);
        return;
    }

    let key = "bycw_game_user_uid_" + uid;
    try {
        const results = await game_redis.HGETALL(key);
        let ugame_info = results;
        ugame_info.uchip = parseInt(ugame_info.uchip);
        ugame_info.uexp = parseInt(ugame_info.uexp);
        ugame_info.uvip = parseInt(ugame_info.uvip);
        callback(Respones.OK, ugame_info);
    } catch (err) {
        log.error('Redis operation error:', err);
    }
}

/**
 * 缓存添加对应的数据
 * @param {*} uid 
 * @param {*} uchip 
 * @param {*} is_add 
 */
function add_ugame_uchip(uid, uchip, is_add) {
    get_ugame_info_inredis(uid, function (status, ugame_info) {
        if (status != Respones.OK) {
            return;
        }

        if (!is_add) {
            uchip = -uchip;
        }

        ugame_info.uchip += uchip;
        set_ugame_info_inredis(uid, ugame_info);//插入到数据库中操作
    })
}

/**
 * 更新游戏的排名
 * @param {*} rank_name 
 * @param {*} uid 
 * @param {*} uchip 
 */
async function update_game_world_rank(rank_name, uid, uchip) {
    const score = Number(uchip);
    try {
        //搞了两个小时才搞定
        await game_redis.zAdd(rank_name, [{ score: score, value: uid + "" }], { NX: true });
    } catch (error) {
        log.error('Error adding multiple members to sorted set:', error);
        return;
    }
}


/**
 * 获得排行榜
 */
async function get_world_rank_info(rank_name, rank_num, callback) {

    if (game_redis === null) {
        return;
    }

    const results = await game_redis.zRange(rank_name, 0, rank_num, "WITHSCORES");
    if (results) {
        //数据有问题的时候
        if (!results || results.length <= 0) {
            callback(Respones.RANK_IS_EMPTY, null);
            return;
        }

        for (let i = 0; i < results.length; i++) {
            results[i] = parseInt(results[i]);
        }
        callback(Respones.OK, results);
    } else {
        callback(Respones.SYSTEM_ERR, null);
    }
}


module.exports = {
    connect: connect_to_center,
    set_ugame_info_inredis: set_ugame_info_inredis,
    get_ugame_info_inredis: get_ugame_info_inredis,
    update_game_world_rank: update_game_world_rank,
    get_world_rank_info: get_world_rank_info,
    add_ugame_uchip: add_ugame_uchip
};