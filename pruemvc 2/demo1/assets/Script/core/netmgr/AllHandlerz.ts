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
        //登录相关
        this._oHandlerMap[7] = new GuestLoginHandler();     //用户登录信息操作
        this._oHandlerMap[8] = new EditPlayHandler();       //用户修改的事件
        this._oHandlerMap[9] = new GuestUpgreadeHandler();  //用户升级成正式账户
        //end
        //游戏服务器的相关操作
        this._oHandlerMap[10] = new SystemGameInfoHandler();//游戏的信息
        this._oHandlerMap[11] = new SystemGameInfoBoundHandler();//游戏的登录节点的相关操作
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
