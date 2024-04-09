import SceneXLoader from "../../../ components/SceneXLoader";
import ConstMgr from "../../ConstMgr";

export default class SystemGameInfoHandler {

    handle(oMsgBody: any) {
        console.log("游戏初始化数据");
        let status = oMsgBody[0];
        if (status != 1) {
            console.log("SystemGameInfoHandler err status: ", status);
            return;
        }
        localStorage.setItem("gamePlay", oMsgBody);
        //跳转场景
        SceneXLoader.startLoad(ConstMgr.moduleName + "home", "home");
    }
}
