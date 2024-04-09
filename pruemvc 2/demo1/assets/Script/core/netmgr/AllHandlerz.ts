import TestHander from "./cmd/chat/TestHander";
import UserArrivedHandler from "./cmd/chat/UserArrivedHandler";
import UserEixtHandler from "./cmd/chat/UserEixtHandler";
import UserExitOtherHandler from "./cmd/chat/UserExitOtherHandler";
import UserSendMsgHandler from "./cmd/chat/UserSendMsgHandler";
import UserMsgHandler from "./cmd/chat/UserMsgHandler";
import GuestLoginHandler from "./cmd/login/GuestLoginHandler";
import EditPlayHandler from "./cmd/login/EditPlayHandler";
import GuestUpgreadeHandler from "./cmd/login/GuestUpgreadeHandler";
import SystemGameInfoHandler from "./cmd/gamesystem/SystemGameInfoHandler";
import SystemGameInfoBoundHandler from "./cmd/login/SystemGameInfoBoundHandler";
import SystemGameInfoBoundsHandler from "./cmd/gamesystem/SystemGameInfoBoundsHandler";
import ConstMgr from "./ConstMgr";
export default class AllHandlerz {
    private readonly _oHandlerMap: { [nkey: number]: any } = {};

    constructor() {
        //聊天的相关操作
        this._oHandlerMap[ConstMgr.Cmd.UserEnter] = new TestHander();            //用户进入
        this._oHandlerMap[ConstMgr.Cmd.UserExit] = new UserEixtHandler();       //用户离开
        this._oHandlerMap[ConstMgr.Cmd.UserArrived] = new UserArrivedHandler();    //用户加入
        this._oHandlerMap[ConstMgr.Cmd.UserExitOther] = new UserExitOtherHandler();  //别人离开
        this._oHandlerMap[ConstMgr.Cmd.UserSendMsg] = new UserSendMsgHandler();    //自己发送消息
        this._oHandlerMap[ConstMgr.Cmd.UserMsg] = new UserMsgHandler();        //收到别人的消息
        //end
        //登录相关
        this._oHandlerMap[ConstMgr.Cmd.GuestLogin] = new GuestLoginHandler();     //用户登录信息操作
        this._oHandlerMap[ConstMgr.Cmd.EditPlay] = new EditPlayHandler();       //用户修改的事件
        this._oHandlerMap[ConstMgr.Cmd.GuestUpgre] = new GuestUpgreadeHandler();  //用户升级成正式账户
        //end
        //游戏服务器的相关操作
        this._oHandlerMap[ConstMgr.Cmd.GET_GAME_INFO] = new SystemGameInfoHandler();//游戏的信息
        this._oHandlerMap[ConstMgr.Cmd.LOGIN_BONUES_INFO] = new SystemGameInfoBoundHandler();//游戏的登录节点的相关操作
        this._oHandlerMap[ConstMgr.Cmd.RECV_LOGIN_BUNUES] = new SystemGameInfoBoundsHandler();//游戏领取
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
