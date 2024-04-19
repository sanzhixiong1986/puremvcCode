var Stype = {
    Broadcast: 10000,//广播服务

    TalkRoom: 1,
    Auth: 2,
    GameSystem: 3,//系统服务，个人和系统，不会存在多个玩家交互
    Game5Chess: 4,//五子棋的游戏服务器
}

module.exports = Stype;