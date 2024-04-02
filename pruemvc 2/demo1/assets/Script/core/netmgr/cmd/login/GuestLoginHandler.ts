import Model from "../../../ components/Model";
import SceneXLoader from "../../../ components/SceneXLoader";
import ConstMgr from "../../ConstMgr";

export default class GuestLoginHandler {

    handle(oMsgBody: any) {
        console.log("游客登录收到服务器返回数据");
        if (oMsgBody == -1001) {
            console.log("用户被挤下来了");
        }
        else {
            //把基础的数据赋值
            Model.getIntance().setUserBase(oMsgBody);
            //跳转场景
            SceneXLoader.startLoad(ConstMgr.moduleName + "home", "home");
        }
    }
}
