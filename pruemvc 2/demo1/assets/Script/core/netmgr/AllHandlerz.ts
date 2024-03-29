import TestHander from "./cmd/chat/TestHander";
import UserArrivedHandler from "./cmd/chat/UserArrivedHandler";
import UserEixtHandler from "./cmd/chat/UserEixtHandler";
import UserExitOtherHandler from "./cmd/chat/UserExitOtherHandler";
import UserSendMsgHandler from "./cmd/chat/UserSendMsgHandler";
export default class AllHandlerz {
    private readonly _oHandlerMap: { [nkey: number]: any } = {};

    constructor() {
        //聊天的相关操作
        this._oHandlerMap[1] = new TestHander();            //用户进入
        this._oHandlerMap[2] = new UserEixtHandler();       //用户离开
        this._oHandlerMap[3] = new UserArrivedHandler();    //用户加入
        this._oHandlerMap[4] = new UserExitOtherHandler();  //别人离开
        this._oHandlerMap[5] = new UserSendMsgHandler();    //自己发送消息
        this._oHandlerMap[6] = new UserMsgHandler();        //收到别人的消息
        //end
    }

    /**
     * 出现得事件
     * @param nMsgCode 
     * @param oMsgBody 
     */
    handle(nMsgCode: number, oMsgBody: any): void {
        if (nMsgCode < 0 || null == oMsgBody) {
            return;
        }
        let oHandler = this._oHandlerMap[nMsgCode];//创建对象
        oHandler.handle(oMsgBody);
    }
}
