import ConstMgr from "../ConstMgr";

import TestHander from "./chat/TestHander"
import UserEixtHandler from "./chat/UserEixtHandler";
import UserArrivedHandler from "./chat/UserArrivedHandler";
import UserExitOtherHandler from "./chat/UserExitOtherHandler";
import UserSendMsgHandler from "./chat/UserSendMsgHandler";
import UserMsgHandler from "./chat/UserMsgHandler";

export default class TalkRoomFactory {
    static crateTalkRoom(command: number) {
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
        }
    }
}
