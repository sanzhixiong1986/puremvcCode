import EventManager from "../../../event/EventManager";

/**
 * 游戏结算
 */
export default class PlayCheckOutHandler {
    handle(oMsgBody: any) {
        EventManager.getInstance().dispenseEvent({ msg_id: "gameEndOpenation", data: oMsgBody });
    }
}
