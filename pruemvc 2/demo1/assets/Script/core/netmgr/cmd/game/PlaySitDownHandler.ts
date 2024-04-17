import EventManager from "../../../event/EventManager";

/**
 * 用户坐下
 */
export default class PlaySitDownHandler {
    handle(oMsgBody: any) {
        console.log("用户坐下的消息收到");
        let status = oMsgBody[0];
        if (status != 1) {
            return;
        }

        let sv_seatid = oMsgBody[1];
        console.log("you sitdown in seat", sv_seatid);

        //用户的信息发送
        EventManager.getInstance().dispenseEvent({ msg_id: "updateGamePlayInfoA" });
        //使用登录的缓存信息
    }
}
