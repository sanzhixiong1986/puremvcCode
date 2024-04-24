import ConstMgr from "../ConstMgr";

import GuestLoginHandler from "./login/GuestLoginHandler";
import EditPlayHandler from "./login/EditPlayHandler";
import GuestUpgreadeHandler from "./login/GuestUpgreadeHandler";

export default class SystemFactory {

    static createCommand(command: number) {
        switch (command) {
            case ConstMgr.Cmd.GuestLogin:
                return new GuestLoginHandler();
            case ConstMgr.Cmd.EditPlay:
                return new EditPlayHandler();
            case ConstMgr.Cmd.GuestUpgre:
                return new GuestUpgreadeHandler();
        }
    }
}
