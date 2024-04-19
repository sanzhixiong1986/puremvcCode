/**
 * 命令的相关
 */
var Cmd = {
    USER_DISCONNECT: 1000000,
    BROADCAST: 21,//广播

    Auth: {
        GUEST_LOGIN: 1,//游客登录
        EDIT_PLAYER: 3,//编辑账号
        DO_GUEST_BIND: 4,//绑定用户信息
        RES_GUEST_LOGIN: 7,//返回给客户端的消息
        RES_EDIT_PROFILE: 8,//编辑用户的相关操作
        RES_DO_GUEST: 9,//用户绑定账号
    },
    GameSystem: {
        GET_GAME_INFO: 10,
        LOGIN_BONUES_INFO: 11,//获取登录奖励信息
        RECV_LOGIN_BUNUES: 12,//领取奖励
        GET_WORLD_RANK_INFO: 13,//获得世界排行榜
    },
    Game5Chess: {
        ENTER_ZONE: 14,//进入游戏区间
        USER_QUIT: 15,//自己退出
        ENTER_ROOM: 16,//进入房间的信息
        EXIT_ROOM: 17,//退出房间
        SITDOWN: 18,//玩家坐下
        STANDUP: 19,//玩家站起
        USER_ARRIVED: 20,//玩家抵达
        SEND_PROP: 22,//游戏道具
    }
}

module.exports = Cmd;