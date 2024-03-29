import EventManager from "../../../event/EventManager";

export default class UserEixtHandler {
    handle(oMsgBody: any) {
        console.log("得到用户离开消息" + oMsgBody);
        EventManager.getInstance().dispenseEvent({ "msg_id": "UserEixt", data: oMsgBody });
    }
}
