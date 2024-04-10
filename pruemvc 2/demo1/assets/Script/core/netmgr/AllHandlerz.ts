import TestHander from "./cmd/chat/TestHander";
import UserArrivedHandler from "./cmd/chat/UserArrivedHandler";
import UserEixtHandler from "./cmd/chat/UserEixtHandler";
import UserExitOtherHandler from "./cmd/chat/UserExitOtherHandler";
import UserSendMsgHandler from "./cmd/chat/UserSendMsgHandler";
import UserMsgHandler from "./cmd/chat/UserMsgHandler";
import GuestLoginHandler from "./cmd/login/GuestLoginHandler";
import EditPlayHandler from "./cmd/login/EditPlayHandler";
import ConstMgr from "./ConstMgr";
import CmdFactory from "./cmd/CmdFactory";
export default class AllHandlerz {
    private readonly _oHandlerMap: { [nkey: number]: any } = {};

    constructor() {
        this._oHandlerMap = {};
        for (let i = 1; i < Object.keys(ConstMgr.Cmd).length + 1; i++) {
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
