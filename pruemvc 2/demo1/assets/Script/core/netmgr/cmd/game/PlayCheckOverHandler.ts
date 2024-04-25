import EventManager from "../../../event/EventManager";

/**
 * 服务器游戏数据清理完毕
 */
export default class PlayCheckOverHandler {
    handle(oMsgBody: any) {
        //清理相关数据完毕
        console.log("游戏已经结束");
        EventManager.getInstance().dispenseEvent({ msg_id: "CheckGameOver" });
    }
}
