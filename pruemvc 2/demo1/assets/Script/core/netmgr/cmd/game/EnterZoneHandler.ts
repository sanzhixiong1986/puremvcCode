import SceneXLoader from "../../../ components/SceneXLoader";
import ConstMgr from "../../ConstMgr";

/**
 * 进入游戏
 */
export default class EnterZoneHandler {
    handle(oMsgBody: any) {
        console.log("进入游戏区域" + oMsgBody);
        if (oMsgBody == 1) {
            SceneXLoader.startLoad(ConstMgr.moduleName + ConstMgr.gameScene, ConstMgr.gameScene);//进入游戏
        }
    }
}
