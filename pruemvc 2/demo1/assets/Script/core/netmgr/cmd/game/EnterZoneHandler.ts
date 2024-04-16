import SceneXLoader from "../../../ components/SceneXLoader";
import ConstMgr from "../../ConstMgr";

/**
 * 进入游戏
 */
export default class EnterZoneHandler {
    handle(oMsgBody: any) {
        console.log("排行榜获得数据" + oMsgBody);
        if (oMsgBody == 1) {
            SceneXLoader.startLoad(ConstMgr.moduleName + "game", "game");//进入游戏
        }
    }
}
