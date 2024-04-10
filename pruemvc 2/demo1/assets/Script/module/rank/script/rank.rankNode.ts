// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import Util from "../../../core/util/Util";

const { ccclass, property } = cc._decorator;

@ccclass
export default class rankNode extends cc.Component {


    onLoad() {
        Util.BundleLoad("Script/module/rank", "res/rankItem", (oDialogNode: cc.Node) => {
            if (oDialogNode) {
                console.log("加载资源成功");
            }
        });

        let closebtn = this.node.getChildByName("close").getComponent(cc.Button);

        closebtn.node.on("click", this.onClose, this);
    }

    private onClose() {
        if (this.node.parent) {
            this.node.removeFromParent();
        }
    }
}
