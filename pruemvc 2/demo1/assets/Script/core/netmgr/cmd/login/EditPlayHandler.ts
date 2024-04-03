import Model from "../../../ components/Model";
import EventManager from "../../../event/EventManager";

export default class EditPlayHandler {

    handle(oMsgBody: any) {
        console.log("编辑用户收到服务器发送过来的消息" + oMsgBody);
        if (oMsgBody.status > 0) {
            Model.getIntance().setUnick(oMsgBody.unick);
            EventManager.getInstance().dispenseEvent({ msg_id: "updateUnick" });
        }
    }
}
