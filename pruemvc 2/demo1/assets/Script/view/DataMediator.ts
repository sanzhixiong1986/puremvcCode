import SceneXLoader from "../core/ components/SceneXLoader";
import ConstMgr from "../core/netmgr/ConstMgr";
import MyData from "../model/MyData";
import DataEvent from "./ui/DataEvent";

// 显示类
export default class DataMediator extends puremvc.Mediator {
    public mediatorName = "DataMediator"//key
    private dataui: DataEvent;
    //构造
    constructor(root: cc.Node) {
        super();
        this.dataui = new DataEvent();
        this.dataui.regUiEvent(root)
    }

    //监听事件
    public listNotificationInterests() {
        let list: Array<string> = [];
        list.push("Msg_AddLevel");
        return list;
    }

    public handleNotification(notification: puremvc.INotification) {
        switch (notification.getName()) {
            case "Msg_AddLevel":
                SceneXLoader.startLoad(ConstMgr.moduleName + "home", "home");
                break;
        }
    }
}