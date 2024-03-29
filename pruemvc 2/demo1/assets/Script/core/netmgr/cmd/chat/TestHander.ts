import EventManager from "../../../event/EventManager";

export default class TestHander {

    handle(oMsgBody: any) {
        console.log("收到来自服务器的数据" + oMsgBody);
        //发送事件
        EventManager.getInstance().dispenseEvent({ "msg_id": "test", data: oMsgBody });
    }
}
