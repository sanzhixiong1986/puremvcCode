import ConstMgr from "../ConstMgr";

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
import PlayDoReadyHandle from "./game/PlayDoReadyHandle";
import PlayRoundStarHandler from "./game/PlayRoundStarHandler";
import PlayTurnToHandler from "./game/PlayTurnToHandler";
/**
 * 游戏消息的工厂类
 */
export default class GameFactory {


    static createCommand(command: number) {
        switch(command){
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
            case ConstMgr.Cmd.SEND_DO_READY:
                return new PlayDoReadyHandle();
            case ConstMgr.Cmd.ROUND_START:
                return new PlayRoundStarHandler();
            case ConstMgr.Cmd.TURN_TO_PLAYER:
                return new PlayTurnToHandler();
        }
    }
}
