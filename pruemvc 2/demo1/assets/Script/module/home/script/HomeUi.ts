import Model from "../../../core/ components/Model";
import EventManager from "../../../core/event/EventManager";
import Home from "./Home";

export default class HomeUi {

    private tab_button_com_set = []; //设置按钮
    private homeUI: Home = null;
    public addUI(home: Home) {
        this.tab_button_com_set = [];
        this.homeUI = home;
        for (let i = 0; i < home.tab_buttons.length; i++) {
            let com = home.tab_buttons[i].getComponent("tab_button");
            this.tab_button_com_set[i] = com;
            com.node.name = i + "";
            com.node.on("click", this.on_tab_button_click, this);
        }

        window.setTimeout(() => {
            this.setTabIndex(0);
            this.updataUserBase();
        }, 200)
    }

    private updataUserBase() {
        let modelData = Model.getIntance().getUserBase();
        let nickName = this.homeUI.node.getChildByName("content_root").getChildByName("uinfo").getChildByName("avator").getChildByName("unick").getComponent(cc.Label);
        if (modelData) {
            nickName.string = modelData.unick;
        }
    }

    private on_tab_button_click(event): void {
        let index = parseInt(event.node.name);
        this.setTabIndex(index);
    }

    private setTabIndex(index: number) {
        for (var i = 0; i < this.homeUI.tab_buttons.length; i++) {
            if (i == index) {
                this.enable_tab(i);
            }
            else {
                this.disable_tab(i);
            }
        }
    }

    private disable_tab(index: number): void {
        this.tab_button_com_set[index].getComponent("tab_button").set_actived(false);
        this.homeUI.tab_buttons[index].getComponent(cc.Button).interactable = true;
        this.homeUI.tab_content[index].active = false;
    }

    private enable_tab(index: number): void {
        this.tab_button_com_set[index].getComponent("tab_button").set_actived(true);
        this.homeUI.tab_buttons[index].getComponent(cc.Button).interactable = false;
        this.homeUI.tab_content[index].active = true;
    }

    public addEvent() {
        EventManager.getInstance().registerHandler("updateUnick", this);
        EventManager.getInstance().registerHandler("updateLoginBonuse", this);
    }

    public removeEvent() {
        EventManager.getInstance().removeHandler("updateUnick", this);
        EventManager.getInstance().removeHandler("updateLoginBonuse", this);
    }

    /**
     * 获得数据
     * @param data 
     */
    private on_get_login_bonues_today_return(body: any): void {
        console.log("on_get_login_bonues_today_return" + "获得数据");
        if (body[0] != 1) {
            console.log("status err:", body);
            return;
        }

        if (body[1] !== 1) {
            console.log("has no bunues", body);
            return;
        }

        let bonues_id = body[2];
        let bonues = body[3];
        let days = body[4];

        let login_bonuse = this.homeUI.node.getChildByName("login_bonues").getComponent("LoginBonues");
        login_bonuse.node.active = true;
        login_bonuse.show_login_bonuses(bonues_id, bonues, days);
    }

    processEvent(event) {
        let msg_id: string = event.msg_id;
        console.log("收到消息" + msg_id);
        switch (msg_id) {
            case "updateUnick":
                this.updataUserBase();
                break;
            case "closePanel":
                break;
            case "updateLoginBonuse":
                this.on_get_login_bonues_today_return(event.data);
                break;
        }
    }
}
