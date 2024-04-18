/**
 * 广播收到消息
 */
export default class BroadCastHandler {

    handle(oMsgBody: any) {
        console.log("收到广播消息" + oMsgBody);
    }
}
