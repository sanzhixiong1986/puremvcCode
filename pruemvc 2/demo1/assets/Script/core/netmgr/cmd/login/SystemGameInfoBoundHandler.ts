import EventManager from "../../../event/EventManager";

export default class SystemGameInfoBoundHandler {

    handle(oMsgBody: any) {
        console.log("登录初始化的数据");
        EventManager.getInstance().dispenseEvent({ msg_id: "updateLoginBonuse", data: oMsgBody });
    }
}
