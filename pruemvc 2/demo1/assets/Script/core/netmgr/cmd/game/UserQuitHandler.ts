/**
 * 用户推出的信息返回
 */
export default class UserQuitHandler {
    handle(oMsgBody: any) {
        console.log("收到用户退出消息");
        cc.director.loadScene("home");
    }
}
