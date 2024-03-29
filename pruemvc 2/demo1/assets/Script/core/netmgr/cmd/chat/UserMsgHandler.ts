import EventManager from "../../../event/EventManager";

export default class UserMsgHandler {
    handle(oMsgBody: any) {
        console.log("收到别人发的消息" + oMsgBody[0]);
        console.log("收到别人发的消息" + oMsgBody[1]);
        console.log("收到别人发的消息" + oMsgBody[2].msg);
        EventManager.getInstance().dispenseEvent({ msg_id: "UserMsg", data: oMsgBody });
    }
}
