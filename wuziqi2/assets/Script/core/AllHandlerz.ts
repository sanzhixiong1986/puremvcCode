import CmdFactory from "./CmdFactory";
import ConstMgr from "./ConstMgr";

export default class AllHandlerz {
    private readonly _oHandlerMap: { [nkey: number]: any } = {};


    constructor() {
        this._oHandlerMap = {};
        let len = Object.keys(ConstMgr.Cmd).length + 1;//个数
        for (let i = 1; i < len; i++) {
            this._oHandlerMap[i] = CmdFactory.createHandler(i);
        }
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
