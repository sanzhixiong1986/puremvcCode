import EventManager from "../../../event/EventManager";

/**
 * 领取奖励的消息
 */
export default class SystemGameInfoBoundsHandler {

    handle(oMsgBody: any) {
        console.log("领取奖励收到消息");
        if (oMsgBody < 0) {
            EventManager.getInstance().dispenseEvent({ msg_id: "errorCode", data: oMsgBody });
        }
        if (oMsgBody[0] == 1) {
            console.log("status err:", oMsgBody);
            return;
        }

        console.log("领取成功");
    }
}
