import ConstMgr from "../ConstMgr"
import TalkRoomFactory from "./TalkRoomFactory";
import SystemFactory from "./SystemFactory";
import GameFactory from "./GameFactory";
/**
 * 命令的工厂类
 */
export default class CmdFactory {
    /**
     * 创建对应的类
     * @param command 
     */
    public static createHandler(command: number) {
        let obj = null;
        //优化部分
        if (command >= ConstMgr.Cmd.UserEnter && command < ConstMgr.Cmd.GuestLogin) {
            obj = TalkRoomFactory.crateTalkRoom(command);
        } else if (command >= ConstMgr.Cmd.GuestLogin && command <= ConstMgr.Cmd.GuestUpgre) {
            obj = SystemFactory.createCommand(command);
        }
        else {
            obj = GameFactory.createCommand(command);
        }
        return obj;
    }
}
