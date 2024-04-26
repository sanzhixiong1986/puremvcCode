// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import ProtoMan from "./core/ProtoMan";
import SocketService from "./core/SocketService";

const { ccclass, property } = cc._decorator;

//初始化test引用包

@ccclass
export default class Test extends cc.Component {

    onLoad() {
        // //测试msgpack操作
        // let obj = ProtoMan.encode(1, 1, { data: "hello" });
        // console.log(">>>>>>", obj);
        // let obj1 = ProtoMan.decode(obj)
        // console.log(">>>>>>", obj1);

        let socket: SocketService = new SocketService();
        socket.connoect("http://127.0.0.1:3000");
        socket.sendMessage("helloworld");
    }
}
