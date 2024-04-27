// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import ProtoMan from "./core/ProtoMan";
import SocketService from "./core/SocketService";
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

        let opts = {
            'reconnection': true,
            'force new connection': true,
            'transports': ['websocket', 'polling'],
            reconnectionAttempts: Infinity, // 重连尝试次数，无限次
            reconnectionDelay: 1000,      // 初始重连延迟（毫秒）
            reconnectionDelayMax: 5000,   // 最大重连延迟（毫秒）
            randomizationFactor: 0.5      // 重连延迟随机化因子
        }
        this._socket = globalThis["io"].connect('http://localhost:3000', opts);
        this._socket.emit("message", ProtoMan.encode(1, 1, { data: "helloworld" }));
        this._socket.on("connectend", (data) => {
            console.log("111111", data);
        });
        this._socket.on("message", (data) => {
            let result = new Uint8Array(data);
            console.log(ProtoMan.decode(result));
        })
    }
}
