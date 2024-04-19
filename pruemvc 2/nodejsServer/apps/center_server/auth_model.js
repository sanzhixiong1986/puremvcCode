var Respones = require("../Respones.js");
var mysql_center = require("../../database/mysql_center.js");
var utils = require("../../utils/utils.js");
const log = require("../../utils/log.js");
const redis_center = require("../../database/redis_center.js");

function guest_login_success(data, ret_func) {
    let ret = {};
    ret.status = Respones.OK;
    ret.uid = data.uid;
    ret.unick = data.unick;
    ret.usex = data.usex;
    ret.uface = data.uface;
    ret.uvip = data.uvip;
    ret.guest_key = data.guest_key;
    ret.uname = data.uname;
    ret.is_guest = data.is_guest;

    //数据缓存
    redis_center.set_uinfo_inredis(data.uid, {
        unick: data.unick,
        uface: data.uface,
        usex: data.usex,
        uvip: data.uvip,
        guest_key: data.guest_key,
        uname: data.uname,
        is_guest: data.is_guest
    });

    ret_func(ret);
}

function write_err(status, ret_func) {
    let ret = {};
    ret.status = status;
    ret_func(ret);
}

/**
 * 
 * @param {*} ukey 
 * @param {*} ret_func 
 */
function guest_login(ukey, ret_func) {
    var unick = "游客" + utils.random_int_str(4); // 游客9527
    var usex = utils.random_int(0, 1); // 性别
    var uface = 0; // 系统只有一个默认的uface,要么就是自定义face;

    // 查询数据库有无用户, 数据库
    mysql_center.get_guest_uinfo_by_ukey(ukey, function (status, data) {
        if (status != Respones.OK) {
            write_err(status, ret_func);
            return;
        }

        if (data.length <= 0) { // 没有这样的key, 注册一个
            mysql_center.insert_guest_user(unick, uface, usex, ukey, function (status) {
                if (status != Respones.OK) {
                    write_err(status, ret_func);
                    return;
                }
                guest_login(ukey, ret_func);
            });
        }
        else {
            if (data[0].status != 0) { // 游客账号被封
                write_err(Respones.ILLEGAL_ACCOUNT, ret_func);
                return;
            }
            //注册成功以后返回数据
            log.error("data[0]={}", data[0]);
            guest_login_success(data[0], ret_func);
        }
    });
}

/**
 * 用户的编辑的操作
 * @param {*} uid 
 * @param {*} unick 
 * @param {*} ret_func 
 */
function edit_profile(uid, unick, ret_func) {
    mysql_center.edit_profile(uid, unick, function (status) {
        if (status != Respones.OK) {
            //出现错误
            write_err(status, ret_func);
            return;
        }

        let body = {
            status: status,
            unick: unick,
        }
        ret_func(body);
    })
}

/**
 * 升级用户的相关操作
 * @param {*} uid 
 * @param {*} uname 
 * @param {*} pwd_md5 
 * @param {*} ret_func 
 */
function do_upgrade_guest_account(uid, uname, pwd_md5, ret_func) {
    mysql_center.do_upgrade_guest_account(uid, uname, pwd_md5, function (status) {
        ret_func(status);
    })
}

module.exports = {
    guest_login: guest_login,
    edit_profile: edit_profile,
    do_upgrade_guest_account: do_upgrade_guest_account
}