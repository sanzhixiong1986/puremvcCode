import MyData from "../model/MyData";

import { regUiEvent, updateUI } from "./ui/DataUiEvent";

// 显示类
export default class DataMediator extends puremvc.Mediator {
    public mediatorName = "DataMediator"//key
    //构造
    constructor(root: cc.Node) {
        super();
        regUiEvent(this, root);
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
                let data: MyData = notification.getBody();
                updateUI(data.Level);
                break;
        }
    }
}