/**
 * 用户进入房间的信息
 */
export default class EnterRoomHandler {

    handle(oMsgBody: any) {
        console.log("收到房间的信息" + oMsgBody);
        if (oMsgBody[0] != 1) {
            return;
        }

        console.log("你进入了区域=" + oMsgBody[1]);
        console.log("进入房间号为" + oMsgBody[2]);
    }
}
