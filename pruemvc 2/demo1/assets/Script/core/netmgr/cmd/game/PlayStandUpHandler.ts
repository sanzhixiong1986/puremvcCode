/**
 * 用户站起来的相关操作
 */
export default class PlayStandUpHandler {
    handle(oMsgBody: any) {
        if (oMsgBody[0] != 1) {
            return;
        }

        let seatid = oMsgBody[1];
        console.log("seatid" + seatid);
    }
}