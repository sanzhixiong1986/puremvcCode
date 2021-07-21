import MyData from "./MyData";
// 显示类
export default class DataMediator extends puremvc.Mediator{
    public mediatorName = "DataMediator"//key

    //ui
    private text:cc.Label;
    private btn:cc.Button;
    //end

    //构造
    constructor(root:cc.Node){
        super();
        this.text = root.getChildByName("lable").getComponent(cc.Label);
        this.btn = root.getChildByName("addNum").getComponent(cc.Button);

        this.btn.node.on('click',this.clickCallBack,this);
    }

    clickCallBack(){
        //发送事件
        this.sendNotification("Reg_StartDataCommand");
    }

    //监听事件
    public listNotificationInterests() {
        let list: Array<string> = [];
        list.push("Msg_AddLevel");
        return list;
    }
 
    public handleNotification(notification: puremvc.INotification) {
        switch(notification.getName()) {
            case "Msg_AddLevel": 
                let data: MyData = notification.getBody();
                this.text.string = "" + data.Level;
            break;
        }
    }
}