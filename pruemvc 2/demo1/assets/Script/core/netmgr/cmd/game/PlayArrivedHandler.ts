import EventManager from "../../../event/EventManager";

export default class PlayArrivedHandler {
    handle(oMsgBody: any) {
        console.log("玩家进入了");
        var player_info = {
            sv_seatid: oMsgBody[0],
            unick: oMsgBody[1],
            usex: oMsgBody[2],
            uface: oMsgBody[3],
            uchip: oMsgBody[4],
            uexp: oMsgBody[5],
            uvip: oMsgBody[6],
        };
        console.log("玩家进入了", player_info);
        EventManager.getInstance().dispenseEvent({ msg_id: "updateSeatPlayInfo", data: player_info });
    }
}
