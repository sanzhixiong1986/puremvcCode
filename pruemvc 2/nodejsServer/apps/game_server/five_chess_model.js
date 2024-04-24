const Respones = require("../Respones.js");
const redis_center = require("../../database/redis_center.js");
const redis_game = require("../../database/redis_game.js");
const mysql_game = require("../../database/mysql_game.js");
const utils = require("../../utils/utils.js");
const log = require("../../utils/log.js");
const game_config = require("../game_config.js");
const five_chess_player = require("./five_chess_player.js");
const five_chess_room = require("./five_chess_room.js");

const zones = {};
var player_set = {}; // uid --> player对应表

/**
 * 房间的相关配置信息
 * @param {*} config 
 */
function zone(config) {
    this.config = config;
    this.wait_list = {};
    this.room_list = {};//房间id和房间绑定
    this.autoinc_roomid = 1;//自增房间号
}

/**
 * 获得用户对象
 * @param {*} uid 
 */
function get_player(uid) {
    if (player_set[uid]) {
        return player_set[uid];
    }
    return null;
}

/**
 * 创建对象
 * @param {*} uid 用户的id
 * @param {*} session 客户端的引用 
 */
function alloc_player(uid, session) {
    if (player_set[uid]) {
        log.error("alloc_player: user is exit!!!!!!");
        return player_set[uid];
    }

    let p = new five_chess_player(uid); //创建人物对象
    p.init_session(session);//初始化session
    return p;
}

/**
 * 删除player对象
 * @param {*} uid 
 */
function delete_player(uid) {
    if (player_set[uid]) {
        log.warn("清空了对应的退出数据");
        player_set[uid].init_session(null, -1);
        player_set[uid] = null;
        delete player_set[uid];
    } else {
        log.warn("delete_player:", uid, "is not in game server!!!!")
    }
}


/**
 * 初始化空间
 */
function init_zones() {
    let zones_config = game_config.game_data.five_chess_zones;
    for (var i in zones_config) {
        let zid = zones_config[i].zid;
        let z = new zone(zones_config[i]);
        zones[zid] = z;
    }
}

init_zones();//初始化


function write_err(status, ret_func) {
    let ret = {};
    ret[0] = status;
    ret_func(ret);
}

/**
 * 获得redis的人物数据
 * @param {*} uid 
 * @param {*} player 
 * @param {*} zid 
 * @param {*} ret_func 
 */
function get_uinfo_inredis(uid, player, zid, ret_func) {
    redis_center.get_uinfo_inredis(uid, function (status, data) {
        if (status != Respones.OK) {
            ret_func(status);
            return;
        }

        player.init_uinfo(data);
        player_set[uid] = player;//对应每一个人的数据
        //end

        player_enter_zone(player, zid, ret_func);
    })
}

/**
 * 用户进入场景
 * @param {*} player 
 * @param {*} zid 
 * @param {*} ret_func 
 */
function player_enter_zone(player, zid, ret_func) {
    let zone = zones[zid];
    player.zid = zid;
    //判断合法性
    if (!zones[zid]) {
        ret_func(Respones.INVALID_ZONE);
        return;
    }

    // //玩家的金币是否足够
    // if (player.uchip < zone.config.min_chip) {
    //     ret_func(Respones.CHIP_IS_NOT_ENOUGH);
    //     return;
    // }

    // //玩家的vip等级是否足够
    // if (player.uvip < zone.config.vip_level) {
    //     ret_func(Respones.VIP_IS_NOT_ENOUGH);
    //     return;
    // }

    log.info("进入到等待列表中了", player.uid, zid);
    zone.wait_list[player.uid] = player;//放入到等待列表中
    ret_func(Respones.OK);
}

/**
 * 进入房间相关操作
 * @param {*} uid 我自己的id
 * @param {*} zid 进入区域的id
 * @param {*} ret_func 返回函数
 * @param {*} session 添加了一个session客户端的引用
 */
function enter_zone(uid, zid, session, ret_func) {
    let player = get_player(uid);//获得用户信息
    if (!player) {
        player = alloc_player(uid, session);//创建一个对象
        //获取我们的信息给对象
        mysql_game.get_ugame_info_by_uid(uid, function (status, data) {
            //状态进行判断
            if (status != Respones.OK) {
                ret_func(status);
                return;
            }
            //返回数据不对的情况
            if (data.length < 0) {
                ret_func(Respones.ILLEGAL_ACCOUNT);
                return;
            }

            let ugame_info = data[0];
            if (ugame_info.status != 0) {
                ret_func(Respones.ILLEGAL_ACCOUNT);
                return;
            }
            //人物初始化游戏的数据
            player.init_ugame_info(ugame_info);
            //获得redis的相关数据
            get_uinfo_inredis(uid, player, zid, ret_func);
        })
        //end
    } else {
        log.error("进入空间的操作")
        player_enter_zone(player, zid, ret_func);
    }
}

var QuitReason = {
    UserQuit: 0, // 主动离开
    UserLostConn: 1, // 用户掉线
    VipKick: 2, // VIP踢人
    SystemKick: 3, // 系统踢人
};

/**
 * 用户主动掉线
 * @param {*} uid 
 * @param {*} ret_func 
 */
function user_quit(uid, ret_func) {
    do_user_quit(uid, QuitReason.UserQuit);
    ret_func(Respones.OK);
}

/**
 * 用户掉线
 * @param {*} uid 
 */
function user_lost_connect(uid) {
    do_user_quit(uid, QuitReason.UserLostConn);
}

//玩家离开动作
function do_user_quit(uid, quit_reason) {
    let player = get_player(uid);
    if (!player) {
        log.error("do_user_quit uid player 不存在", uid)
        return;
    }

    //2024.4.17 添加了退出的时候进行清理对象的session 
    if (quit_reason == QuitReason.UserLostConn) {
        player.init_session(null, -1);
    }

    log.warn("player uid=", uid, "quit game_server reason:", quit_reason);
    log.warn("player zid=", player.zid, "quit game_server reason:", player.room_id);
    if (player.zid != -1 && zones[player.zid]) { //4.18修改，我把zid变成roomid
        log.warn("进行退出的流程1")
        let zone = zones[player.zid];
        if (player.room_id != -1) {
            //2024.4.17 清空对应房间列表的操作
            log.warn("进行退出的流程2")
            let room = zone.room_list[player.room_id];
            if (room) {
                room.do_exit_room(player);
            } else {
                player.room_id = -1;
            }
            player.zid = -1;
            //end
            log.info("房间退出后player uid:", uid, "exit zone:", player.zid, "at room:", player.room_id);
        }
        else {
            if (zone.wait_list[uid]) {
                log.info("player uid", uid, "remove from waitlist at zone:", player.zid);
                player.zid = -1;
                player.room_id = -1;
                zone.wait_list[uid] = null;
                delete zone.wait_list[uid];
            }
        }
    }

    delete_player(uid);//2024.4.18删除操作
}

/**
 * 创建房间信息
 * @param {*} zone 
 */
function alloc_room(zone) {
    let room = new five_chess_room(zone.autoinc_roomid++, zone.config);
    zone.room_list[room.room_id] = room;//绑定房间列表
    return room;
}

/**
 * 搜索房间信息
 * @param {*} zone 
 */
function do_search_room(zone) {
    let min_empty = 1000000;
    let min_room = null;
    //循环当前的房间列表
    for (let key in zone.room_list) {
        room = zone.room_list[key];
        let empty_num = room.empty_seat(); //是否有2个人如果有就加入，没有就创建
        if (room && empty_num >= 1) {
            if (empty_num < min_empty) {
                min_room = room;
                min_empty = empty_num;
            }
        }
    }

    if (min_room) {
        return min_room;
    }

    min_room = alloc_room(zone);//创建房间
    return min_room;
}

//寻找空位置
function do_assign_room() {
    for (var i in zones) { // 遍历所有的区间
        // 查询等待列表，看有么有玩家
        var zone = zones[i];
        for (var key in zone.wait_list) { // 遍历区间的等待列表
            var p = zone.wait_list[key];

            var room = do_search_room(zone);
            if (room) {
                // 玩家加入到房间
                room.do_enter_room(p);
                log.error("有玩家加入房间");
                zone.wait_list[key] = null;
                delete zone.wait_list[key];
            }
        }
    }
}

setInterval(do_assign_room, 500);//每隔一段时间看看是否有空位置

/**
 * 发送礼物的相关操作
 * @param {*} uid           我自己的id
 * @param {*} to_seatid     给谁发送的id
 * @param {*} propid        礼物的id
 * @param {*} ret_func      返回函数
 */
function send_prop(uid, to_seatid, propid, ret_func) {
    let player = get_player(uid);//获得用户数据
    //用户不存在
    if (!player) {
        write_err(Respones.INVALIDI_OPT, ret_func);
        return;
    }
    //这个地方在退出的时候有问题，后面在退出的时候需要修改2024.4.22
    // if (player.zid == -1) {
    //     player.zid = 1;
    // }
    //判断用户没有在房间也标识用户不存在
    if (player.zid === -1 || player.room_id === -1) {
        write_err(Respones.INVALIDI_OPT, ret_func);
        return;
    }
    //用户进入了对应的区间
    let zone = zones[player.zid];
    if (!zone) {
        write_err(Respones.INVALIDI_OPT, ret_func);
        return;
    }
    //判断用户是否已经进入房间列表中
    let room = zone.room_list[player.room_id];
    if (!room) {
        write_err(Respones.INVALIDI_OPT, ret_func);
        return;
    }
    room.send_prop(player, to_seatid, propid, ret_func);
}

/**
 * 用户是否准备好
 * @param {*} uid 
 * @param {*} ret_func 
 */
function do_player_ready(uid, ret_func) {
    let player = get_player(uid);
    if (!player) {
        write_err(Respones.INVALIDI_OPT, ret_func);
        return;
    }

    //这个地方在退出的时候有问题，后面在退出的时候需要修改2024.4.22
    // if (player.zid == -1) {
    //     player.zid = 1;
    // }
    //判断用户没有在房间也标识用户不存在
    if (player.zid === -1 || player.room_id === -1) {
        write_err(Respones.INVALIDI_OPT, ret_func);
        return;
    }
    //用户进入了对应的区间
    let zone = zones[player.zid];
    if (!zone) {
        write_err(Respones.INVALIDI_OPT, ret_func);
        return;
    }
    //判断用户是否已经进入房间列表中
    let room = zone.room_list[player.room_id];
    if (!room) {
        write_err(Respones.INVALIDI_OPT, ret_func);
        return;
    }

    room.do_player_ready(player, ret_func);//群发对应的消息
}

/**
 * 用户下棋操作
 * @param {*} uid       是谁在下棋
 * @param {*} block_x   下载那个点上
 * @param {*} block_y 
 * @param {*} ret_func  返回函数
 */
function do_player_put_chess(uid, block_x, block_y, ret_func) {
    let player = get_player(uid);
    //用户不存在的情况
    if (!player) {
        write_err(Respones.INVALIDI_OPT, ret_func);
        return;
    }

    if (player.zid === -1 || player.room_id === -1) {
        write_err(Respones.INVALIDI_OPT, ret_func);
        return;
    }

    var zone = zones[player.zid];
    if (!zone) {
        write_err(Respones.INVALIDI_OPT, ret_func);
        return;
    }

    var room = zone.room_list[player.room_id];
    if (!room) {
        write_err(Respones.INVALIDI_OPT, ret_func);
        return;
    }

    room.do_player_put_chess(player, block_x, block_y, ret_func);
}

module.exports = {
    enter_zone: enter_zone,//进入房间相关操作
    user_quit: user_quit,//主动离开
    user_lost_connect: user_lost_connect,//服务器断开出现
    send_prop: send_prop,
    do_player_ready: do_player_ready,//用户的准备
    do_player_put_chess: do_player_put_chess,//用户下棋操作
}