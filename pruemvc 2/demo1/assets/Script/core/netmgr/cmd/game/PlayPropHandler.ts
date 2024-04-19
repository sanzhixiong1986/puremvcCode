import EventManager from "../../../event/EventManager";

/**
 * 发送礼物的相关消息操作
 */
export default class PlayPropHandler {
    handle(oMsgBody: any) {
        if (oMsgBody[0] != 1) {
            return;
        }

        //发送道具成功
        console.log("form seat", oMsgBody[1], "to seat", oMsgBody[2], "porp", oMsgBody[3]);

        //发送给游戏场景进行操作
        EventManager.getInstance().dispenseEvent({ msg_id: "sendProp", data: oMsgBody });
    }
}
