import ConstMgr from "../ConstMgr"
import TestHander from "./chat/TestHander"
import UserEixtHandler from "./chat/UserEixtHandler";
import UserArrivedHandler from "./chat/UserArrivedHandler";
import UserExitOtherHandler from "./chat/UserExitOtherHandler";
import UserSendMsgHandler from "./chat/UserSendMsgHandler";
import UserMsgHandler from "./chat/UserMsgHandler";
import GuestLoginHandler from "./login/GuestLoginHandler";
import EditPlayHandler from "./login/EditPlayHandler";
import GuestUpgreadeHandler from "./login/GuestUpgreadeHandler";
import SystemGameInfoHandler from "./gamesystem/SystemGameInfoHandler";
import SystemGameInfoBoundHandler from "./login/SystemGameInfoBoundHandler";
import SystemGameInfoBoundsHandler from "./gamesystem/SystemGameInfoBoundsHandler";
/**
 * 命令的工厂类
 */
export default class CmdFactory {
    /**
     * 创建对应的类
     * @param command 
     */
    public static createHandler(command: number) {
        switch (command) {
            case ConstMgr.Cmd.UserEnter:
                return new TestHander();
            case ConstMgr.Cmd.UserExit:
                return new UserEixtHandler();
            case ConstMgr.Cmd.UserArrived:
                return new UserArrivedHandler();
            case ConstMgr.Cmd.UserExitOther:
                return new UserExitOtherHandler();
            case ConstMgr.Cmd.UserSendMsg:
                return new UserSendMsgHandler();
            case ConstMgr.Cmd.UserMsg:
                return new UserMsgHandler();
            case ConstMgr.Cmd.GuestLogin:
                return new GuestLoginHandler();
            case ConstMgr.Cmd.EditPlay:
                return new EditPlayHandler();
            case ConstMgr.Cmd.GuestUpgre:
                return new GuestUpgreadeHandler();
            case ConstMgr.Cmd.GET_GAME_INFO:
                return new SystemGameInfoHandler();
            case ConstMgr.Cmd.LOGIN_BONUES_INFO:
                return new SystemGameInfoBoundHandler
            case ConstMgr.Cmd.RECV_LOGIN_BUNUES:
                return new SystemGameInfoBoundsHandler();
        }
    }
}
