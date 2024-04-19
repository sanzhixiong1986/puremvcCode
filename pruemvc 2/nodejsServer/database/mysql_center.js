const mysql = require("mysql");
const util = require('util');
const Respones = require("../apps/Respones");
const log = require("../utils/log.js");
const game_config = require("../apps/game_config.js");

// 创建数据库连接池
const conn_pool = mysql.createPool({
    host: game_config.center_database.host,
    port: game_config.center_database.port,
    database: game_config.center_database.db_name,
    user: game_config.center_database.uname,
    password: game_config.center_database.upwd,
});

/**
 * 数据库的执行
 * @param {string} sql SQL查询语句
 * @param {Array} params 参数化查询的参数数组
 * @param {Function} callback 回调函数
 */
function mysql_exec(sql, params, callback) {
    conn_pool.getConnection(function (err, conn) {
        if (err) {
            if (callback) {
                callback(err, null, null);
            }
            return;
        }

        conn.query(sql, params, function (sql_err, sql_result, fields_desic) {
            conn.release();
            if (sql_err) {
                if (callback) {
                    callback(sql_err, null, null);
                }
                return;
            }
            if (callback) {
                callback(null, sql_result, fields_desic);
            }
        });
    });
}

/**
 * 获得用户相关的属性
 * @param {string} ukey 用户键
 * @param {Function} callback 回调函数
 */
function get_guest_uinfo_by_ukey(ukey, callback) {
    let sql = "SELECT uid, unick, usex, uface, uvip, guest_key,status,uname,is_guest FROM uinfo WHERE guest_key = ?";
    mysql_exec(sql, [ukey], function (err, sql_ret, fields_desic) {
        if (err) {
            callback(Respones.SYSTEM_ERR, null);
            return;
        }
        callback(Respones.OK, sql_ret);
    });
}

/**
 * 如果没有注册的话就直接进行注册操作
 * @param {string} unick 用户昵称
 * @param {number} uface 用户头像
 * @param {number} usex 用户性别
 * @param {string} ukey 用户键
 * @param {Function} callback 回调函数
 */
function insert_guest_user(unick, uface, usex, ukey, callback) {
    let sql = "INSERT INTO uinfo(`guest_key`, `unick`, `uface`, `usex`) VALUES (?, ?, ?, ?)";
    mysql_exec(sql, [ukey, unick, uface, usex], function (err, sql_ret, fields_desic) {
        if (err) {
            callback(Respones.SYSTEM_ERR);
            return;
        }
        callback(Respones.OK);
    });
}

/**
 * 用户的信息修改
 * @param {*} uid      用户的uid（数据库id） 
 * @param {*} unick    用户的姓名（需要修改成一个对象，然后根据对象把你要的数据进行修改，不然修改了就需要操作）
 * @param {*} callback 返回函数
 */
function edit_profile(uid, unick, callback) {
    var sql = "update uinfo set unick = \"%s\" where uid = %d";
    var sql_cmd = util.format(sql, unick, uid);
    mysql_exec(sql_cmd, function (err, sql_ret, fields_desic) {
        if (err) {
            callback(Respones.SYSTEM_ERR);
            return;
        }
        callback(Respones.OK);
    })
}

/**
 * 升级用户账号
 * @param {*} uid 
 * @param {*} uname 
 * @param {*} pwd 
 * @param {*} callback 
 */
function do_upgrade_guest_account(uid, uname, pwd, callback) {
    let sql = "update uinfo set uname=\"%s\",upwd=\"%s\",is_guest=1 where uid=%d";
    let sql_cmd = util.format(sql, uname, pwd, uid);
    log.info(sql_cmd);
    //执行sql语句
    mysql_exec(sql_cmd, function (err, sql_ret, fields_desic) {
        if (err) {
            callback(Respones.SYSTEM_ERR);
        } else {
            callback(Respones.OK);
        }
    });
}

module.exports = {
    get_guest_uinfo_by_ukey: get_guest_uinfo_by_ukey,
    insert_guest_user: insert_guest_user,
    edit_profile: edit_profile,
    do_upgrade_guest_account: do_upgrade_guest_account,
};
