import Util from "../../core/util/Util";

export default class DataEvent {

    private text: cc.Label = null;
    private btn: cc.Button = null;
    private UI: cc.Node = null;
    /**
     * 
     * @param root 
     */
    regUiEvent(root: cc.Node) {
        this.UI = root.getChildByName("UI");
        this.UI.removeAllChildren();
        Util.removeAsset("/test", cc.Prefab);
        Util.loadAsset("/test", cc.Prefab, (error, assets) => {
            let nodes: cc.Node = cc.instantiate(assets as cc.Prefab);
            this.UI.addChild(nodes);
            this.text = nodes.getChildByName("lable").getComponent(cc.Label);
            this.btn = nodes.getChildByName("addNum").getComponent(cc.Button);
            this.btn.node.on('click', this.clickCallBack, this);
        })
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
