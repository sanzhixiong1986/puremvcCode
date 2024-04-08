import Model from "../../../ components/Model";
import SceneXLoader from "../../../ components/SceneXLoader";
import ConstMgr from "../../ConstMgr";
import MsgSender from "../../MsgSender";
import proto_man from "../../proto_man";

export default class SystemGameInfoHandler {

    handle(oMsgBody: any) {
        console.log("游戏基础数据");
        if (oMsgBody[0] > 0) {
            console.log("获得游戏初始化据");
        }
    }
}
