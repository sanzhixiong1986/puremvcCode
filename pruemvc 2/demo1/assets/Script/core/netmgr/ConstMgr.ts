/**
 * 常量的地方
 */
export default class ConstMgr {
    public static moduleName: string = "assets/Script/module/";

    public static Stype = {
        Talkroom: 1,
        Auth: 2,
        GameSystem: 3,
        GameFiveChess: 4,
    }

    public static Cmd = {
        //聊天相关
        UserEnter: 1,
        UserExit: 2,
        UserArrived: 3,
        UserExitOther: 4,
        UserSendMsg: 5,
        UserMsg: 6,
        //登录部分
        GuestLogin: 7,
        EditPlay: 8,
        GuestUpgre: 9,
        //系统相关的
        GET_GAME_INFO: 10,
        LOGIN_BONUES_INFO: 11,//获取登录奖励信息
        RECV_LOGIN_BUNUES: 12,//领取奖励
        GET_WORLD_RANK_INFO: 13,//获得排行榜的数据
        ENTER_ZONE: 14,//进入游戏场景
        USER_QUIT: 15,//退出游戏
    }

    public static BonuesArray = ["100", "200", "300", "400", "500"]; //金币的测试环境
}
