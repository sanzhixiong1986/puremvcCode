
export default class UserSendMsgHandler {

    handle(oMsgBody: any) {
        console.log("收到自己发送的消息" + oMsgBody[1]);
        console.log("收到自己发送的消息" + oMsgBody[2]);
        console.log("收到自己发送的消息" + oMsgBody[3].msg);
    }
}
