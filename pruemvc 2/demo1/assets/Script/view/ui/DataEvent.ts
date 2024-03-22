import Util from "../../core/util/Util";

export default class DataEvent {

    private text: cc.Label = null;
    private btn: cc.Button = null;

    regUiEvent(root: cc.Node) {
        this.text = root.getChildByName("lable").getComponent(cc.Label);
        this.btn = root.getChildByName("addNum").getComponent(cc.Button);
        this.btn.node.on('click', this.clickCallBack, this);
    }

    //事件
    private clickCallBack(): void {
        //发送事件
        Util.getPureFacade("gameRoot").sendNotification("Reg_StartDataCommand");
    }

    updateUI(num: number) {
        this.text.string = num + "";
    }
}
