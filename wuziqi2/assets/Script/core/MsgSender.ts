import ProtoMan from "./ProtoMan";
import socketio = require("./socket.io");


/**
 * websocket操作相关
 */
const SERVER_HOST = "127.0.0.1";
const SERVER_PORT = 3000;

export default class MsgSender {
    //单例模式
    private static _oInstance: MsgSender = new MsgSender();
    //websocket对象
    private _oWebSocket: socketio = null;
    //构造函数
    private constructor() { };

    public static getIntance(): MsgSender {
        return this._oInstance;
    }

    /**
     * 链接服务器得相关操作
     * @param funCallback 
     */
    connect(funCallback: () => void = null): void {
        let strURL = `ws://${SERVER_HOST}:${SERVER_PORT}`;
        // let strURL = `ws://${SERVER_HOST}/ws`;
        cc.log(`准备连接服务器, URL = ${strURL}`);

        //相关的操作
        let opts = {
            'reconnection': false,
            'force new connection': false,
            'transports': ['websocket', 'polling'],
        }

        this._oWebSocket = globalThis["io"].connect(strURL, opts);

        //链接服务器是否成功
        this._oWebSocket.on('connect', () => {
            cc.log(`已连接服务器, URL = ${strURL}`);
            if (null != funCallback) {
                funCallback();
            }
        })

        //重连尝试失败时触发。
        this._oWebSocket.on('reconnect_error', (error) => {
            console.log('Reconnect failed:', error);
        });

        //接收到来自服务器的消息时触发。
        this._oWebSocket.on('message', (oEvent: MessageEvent) => {
            console.log('New message:', oEvent);
            if (null == oEvent) {
                return;
            }

            //先把节点
            let jsonObj = ProtoMan.decode(oEvent)
            if (!jsonObj) {
                return;
            }
            this.onMsgReceived(jsonObj[1], jsonObj[2]);
        });
    }

    /**
     * 发送消息
     * 
     * @param nMsgCode 消息编号
     * @param oMsgBody 消息体
     */
    sendMsg(str: string): void {
        if (this._oWebSocket) {
            console.log("发送数据", str);
            this._oWebSocket.emit("message", str);
        }
        else {
            cc.log("this._oWebSocket 没有初始化完成")
        }
    }

    /**
     * 当收到消息
     * 
     * @param nMsgCode 消息编号
     * @param oMsgBody 消息体
     */
    onMsgReceived(nMsgCode: number, oMsgBody: any): void {
        if (nMsgCode < 0 ||
            null == oMsgBody) {
            return;
        }
    }
}
