import Model from "../../../ components/Model";
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

        let ugame = Model.getIntance().getUserBase();

        let play_info = {
            unick: ugame.unick,
            usex: ugame.usex,
            uface: ugame.uface,

            uvip: ugame.uvip,
            uchip: ugame.uchip,
            uexp: ugame.uexp,

            sv_seatid: sv_seatid,
        }

        //用户的信息发送
        EventManager.getInstance().dispenseEvent({ msg_id: "updateGamePlayInfoA", data: play_info });
        //使用登录的缓存信息
    }
}
