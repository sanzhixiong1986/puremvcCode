// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import AllHandlerz from "./core/AllHandlerz";
import MsgSender from "./core/MsgSender";
import ProtoMan from "./core/ProtoMan";
import SocketService from "./core/SocketService";
import SceneXLoader from "./core/components/SceneXLoader";
import socketio = require("./core/socket.io");
const { ccclass, property } = cc._decorator;

//初始化test引用包

@ccclass
export default class Test extends cc.Component {
    private _socket: socketio = null;
    onLoad() {
        // //测试msgpack操作
        // let obj = ProtoMan.encode(1, 1, { data: "hello" });
        // console.log(">>>>>>", obj);
        // let obj1 = ProtoMan.decode(obj)
        // console.log(">>>>>>", obj1);

        // MsgSender.getIntance().connect(() => {
        //     let oAllHandlerz = new AllHandlerz();
        //     MsgSender.getIntance().onMsgReceived = (nMsgCode, oMsgBody) => {
        //         oAllHandlerz.handle(nMsgCode, oMsgBody);
        //     },
        //     MsgSender.getIntance().sendMsg(ProtoMan.encode(1, 1, { data: "helloworld" }));
        // })
        SceneXLoader.startLoad("assets/Script/module/hall", "hall");
    }
}
