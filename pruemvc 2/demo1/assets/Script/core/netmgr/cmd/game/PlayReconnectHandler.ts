import EventManager from "../../../event/EventManager";

export default class PlayReconnectHandler {
    handle(oMsgBody: any) {
        EventManager.getInstance().dispenseEvent({ msg_id: "playReconnectHandler", data: oMsgBody });
    }
}
