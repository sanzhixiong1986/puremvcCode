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
import WorldRankInfoHandler from "./gamesystem/WorldRankInfoHandler";
import EnterZoneHandler from "./game/EnterZoneHandler";
import UserQuitHandler from "./game/UserQuitHandler";
import EnterRoomHandler from "./game/EnterRoomHandler";
import ExitRoomHandler from "./game/ExitRoomHandler";
import PlaySitDownHandler from "./game/PlaySitDownHandler";
import BroadCastHandler from "./game/BroadCastHandler";
import PlayArrivedHandler from "./game/PlayArrivedHandler";
import PlayStandUpHandler from "./game/PlayStandUpHandler";
import PlayPropHandler from "./game/PlayPropHandler";
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
            case ConstMgr.Cmd.GET_WORLD_RANK_INFO:
                return new WorldRankInfoHandler();
            case ConstMgr.Cmd.ENTER_ZONE:
                return new EnterZoneHandler();
            case ConstMgr.Cmd.USER_QUIT:
                return new UserQuitHandler();
            case ConstMgr.Cmd.ENTER_ROOM:
                return new EnterRoomHandler();
            case ConstMgr.Cmd.EXIT_ROOM:
                return new ExitRoomHandler();
            case ConstMgr.Cmd.SITDOWN:
                return new PlaySitDownHandler();
            case ConstMgr.Cmd.BROADCAST:
                return new BroadCastHandler();
            case ConstMgr.Cmd.USER_ARRIVED:
                return new PlayArrivedHandler();
            case ConstMgr.Cmd.STANDUP:
                return new PlayStandUpHandler();
            case ConstMgr.Cmd.SEND_PROP:
                return new PlayPropHandler();
        }
    }
}
