// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import MsgSender from "../../../core/netmgr/MsgSender";
import proto_man from "../../../core/netmgr/proto_man";
import Util from "../../../core/util/Util";

const { ccclass, property } = cc._decorator;

@ccclass
export default class rankNode extends cc.Component {

    private _itemNode: cc.Node = null; //加载成功


    onLoad() {
        Util.BundleLoad("Script/module/rank", "res/rankItem", (oDialogNode: cc.Node) => {
            if (oDialogNode) {
                this._itemNode = oDialogNode;
            }
        });

        //列表的父对象
        let context = this.node.getChildByName("view").getChildByName("content");

        //清楚所有的显示对象
        context.removeAllChildren();

        let closebtn = this.node.getChildByName("close").getComponent(cc.Button);
        closebtn.node.on("click", this.onClose, this);

        //发送数据
        let buf = proto_man.encode_cmd(3, 13, null);
        MsgSender.getIntance().sendMsg(buf);
        //请求数据
    }

    private onClose() {
        if (this.node.parent) {
            this.node.removeFromParent();
        }
    }
}
