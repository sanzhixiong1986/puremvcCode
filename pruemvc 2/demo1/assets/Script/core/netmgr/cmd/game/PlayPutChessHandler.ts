import EventManager from "../../../event/EventManager";

/**
 * 用户下棋相关操作
 */
export default class PlayPutChessHandler {
    handle(oMsgBody: any) {
        EventManager.getInstance().dispenseEvent({ msg_id: "updatePlayPutChess", data: oMsgBody });
    }
}
