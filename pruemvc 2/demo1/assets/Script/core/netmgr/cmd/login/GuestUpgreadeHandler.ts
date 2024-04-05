import Model from "../../../ components/Model";
import EventManager from "../../../event/EventManager";

export default class GuestUpgreadeHandler {
    handle(oMsgBody: any) {
        console.log("编辑用户收到服务器发送过来的消息" + oMsgBody);
        if (oMsgBody > 0) {
            //升级成功
            Model.getIntance().setGuest(1);
            EventManager.getInstance().dispenseEvent({ msg_id: "closePanel" });
        }
    }
}
