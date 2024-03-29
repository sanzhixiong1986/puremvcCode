import EventManager from "../../../event/EventManager";

export default class UserExitOtherHandler {
    handle(oMsgBody: any) {
        console.log("收到别人离开的消息" + oMsgBody);
        EventManager.getInstance().dispenseEvent({ msg_id: "otherExit", data: oMsgBody });
    }
}