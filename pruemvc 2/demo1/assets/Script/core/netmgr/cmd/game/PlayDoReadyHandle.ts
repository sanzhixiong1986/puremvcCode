import EventManager from "../../../event/EventManager";

/**
 * 做准备的回收事件
 */
export default class PlayDoReadyHandle {

    handle(oMsgBody: any) {
        EventManager.getInstance().dispenseEvent({ msg_id: "updateStateReady", data: oMsgBody });
    }
}
