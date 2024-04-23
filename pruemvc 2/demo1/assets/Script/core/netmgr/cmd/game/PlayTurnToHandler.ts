import EventManager from "../../../event/EventManager";

/**
 * 轮到那个玩家的操作
 */
export default class PlayTurnToHandler {
    handle(oMsgBody: any) {
        EventManager.getInstance().dispenseEvent({ msg_id: "updatePlayTurnTo", data: oMsgBody });
    }
}
