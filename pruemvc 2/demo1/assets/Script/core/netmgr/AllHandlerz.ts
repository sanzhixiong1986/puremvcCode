import TestHander from "./cmd/TestHander";
import UserArrivedHandler from "./cmd/UserArrivedHandler";

export default class AllHandlerz {
    private readonly _oHandlerMap: { [nkey: number]: any } = {};

    constructor() {
        this._oHandlerMap[1] = new TestHander();
        this._oHandlerMap[3] = new UserArrivedHandler();
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
