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
        ENTER_ROOM: 16,//进入房间
        EXIT_ROOM: 17,//退出房间
        SITDOWN: 18,//玩家坐下
        STANDUP: 19,//玩家站起
        USER_ARRIVED: 20,//玩家更近
        BROADCAST: 21, //播放收到的消息
        SEND_PROP: 22, //发送道具
        SEND_DO_READY: 23,//用户准备消息
        ROUND_START: 24,//游戏准备开始
        TURN_TO_PLAYER: 25,//轮到那个玩家
        PUT_CHESS:26,//用户下棋操作
    }

    public static BonuesArray = ["100", "200", "300", "400", "500"]; //金币的测试环境

    public static gameScene: string = "game";

    public static homeScene: string = "home";

    //进入的是那个对应的房间
    public static EnterRoomId: number = -1;
}
