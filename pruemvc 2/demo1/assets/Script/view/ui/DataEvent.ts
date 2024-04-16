import Model from "../../core/ components/Model";
import SceneXLoader from "../../core/ components/SceneXLoader";
import ConstMgr from "../../core/netmgr/ConstMgr";
import MsgSender from "../../core/netmgr/MsgSender";
import proto_man from "../../core/netmgr/proto_man";
import Util from "../../core/util/Util";

export default class DataEvent {

    private text: cc.Label = null;
    private btn: cc.Button = null;
    private UI: cc.Node = null;
    private clickBtn: cc.Button = null;
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
            this.clickBtn = nodes.getChildByName("click").getComponent(cc.Button);
            this.btn.node.on('click', this.clickCallBack, this);
            this.clickBtn.node.on("click", this.onClick, this);
        });

        // this.isCheckLoginTime();
        // 使用 URLSearchParams 来解析查询字符串
        // const username = Util.getUrlProperties('username');
        // console.log("username:" + username);
    }

    private isCheckLoginTime() {
        //时间差
        let uid = localStorage.getItem("uid");
        let model = localStorage.getItem(uid);
        let now = Date.now();
        if (model) {
            if (model && parseInt(uid) > 0) {
                Model.getIntance().setUserBase(JSON.parse(model));
                if (now - JSON.parse(model).now > 3600000) {
                    localStorage.removeItem(uid);
                    localStorage.removeItem("uid");
                }
                else {
                    window.setTimeout(() => {
                        //自动登录
                        var key = null; // 从本地获取
                        if (!key) {
                            key = JSON.parse(model).guest_key;//Util.random_string(32);
                        }
                        let buf = proto_man.encode_cmd(2, 1, key);
                        MsgSender.getIntance().sendMsg(buf);
                    }, 1500);

                }
            }
        }
    }

    private onClick(): void {
        var key = Util.getUrlProperties('key')//"33nB8mDa6FEtaXKiZA8X4wAGj8ahYQWN";//Util.random_string(32);
        console.log("key=====", key);

        let buf = proto_man.encode_cmd(2, 1, key);
        MsgSender.getIntance().sendMsg(buf);
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
