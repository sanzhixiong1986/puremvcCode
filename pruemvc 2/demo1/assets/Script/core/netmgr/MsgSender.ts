import proto_man from "./proto_man";


/**
 * websocket操作相关
 */
const SERVER_HOST = "192.168.10.131";
const SERVER_PORT = 6081;

export default class MsgSender {
    //单例模式
    private static _oInstance: MsgSender = new MsgSender();
    //websocket对象
    private _oWebSocket: WebSocket = null;


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
        let strURL = `ws://${SERVER_HOST}:${SERVER_PORT}/ws`;
        // let strURL = `ws://${SERVER_HOST}/ws`;
        cc.log(`准备连接服务器, URL = ${strURL}`);

        let oWebSocket = new WebSocket(strURL);

        //链接服务器
        oWebSocket.onopen = (): void => {
            cc.log(`已连接服务器, URL = ${strURL}`);
            this._oWebSocket = oWebSocket;

            if (null != funCallback) {
                funCallback();
            }
        }

        // 异常
        oWebSocket.onerror = (): void => {
            cc.error(`连接异常, URL = ${strURL}`);
            this._oWebSocket = null;
        }

        // 断开服务器
        oWebSocket.onclose = (): void => {
            cc.warn("服务器连接已关闭");
            this._oWebSocket = null;
        }

        // 收到消息
        oWebSocket.onmessage = (oEvent: MessageEvent): void => {
            if (null == oEvent ||
                null == oEvent.data) {
                return;
            }

            //先把节点
            let jsonObj = proto_man.decode_cmd(oEvent.data)//(oEvent.data);
            if (!jsonObj) {
                return;
            }
            this.onMsgReceived(jsonObj[1], jsonObj[2]);
        }
    }

    /**
     * 发送消息
     * 
     * @param nMsgCode 消息编号
     * @param oMsgBody 消息体
     */
    sendMsg(str: string): void {
        if (this._oWebSocket) {
            this._oWebSocket.send(str);
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
