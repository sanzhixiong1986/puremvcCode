import EventManager from "../../../event/EventManager";

/**
 * 游戏开始的相关操作
 */
export default class PlayRoundStarHandler {
    handle(oMsgBody: any) {
        EventManager.getInstance().dispenseEvent({ msg_id: "updateGameStart", data: oMsgBody });
    }
}
