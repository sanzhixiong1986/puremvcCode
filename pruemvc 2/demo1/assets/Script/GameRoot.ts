// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
import ApplicationFacade from "./ApplicationFacade";
import AllHandlerz from "./core/netmgr/AllHandlerz";
import MsgSender from "./core/netmgr/MsgSender";
const { ccclass, property } = cc._decorator;

@ccclass
export default class GameRoot extends cc.Component {
    //初始化操作
    start() {
        console.log("游戏开始");
        //注册websocket和
        MsgSender.getIntance().connect(() => {
            let oAllHandlerz = new AllHandlerz();
            MsgSender.getIntance().onMsgReceived = (nMsgCode, oMsgBody) => {
                oAllHandlerz.handle(nMsgCode, oMsgBody);
            }
        })
        new ApplicationFacade(this.node);
    }
}
