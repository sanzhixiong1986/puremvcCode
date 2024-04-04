// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import Model from "../../../core/ components/Model";
import MsgSender from "../../../core/netmgr/MsgSender";
import proto_man from "../../../core/netmgr/proto_man";

const { ccclass, property } = cc._decorator;

@ccclass
export default class editNode extends cc.Component {

    private _userBase = null;
    private label: cc.EditBox = null;
    onLoad() {
        this._userBase = Model.getIntance().getUserBase();
        this.label = this.node.getChildByName("EditBox").getComponent(cc.EditBox);
        if (this._userBase) {
            this.label.string = this._userBase.unick;
        }
    }

    onSendMsg() {
        let buf = proto_man.encode_cmd(2, 3, { uid: this._userBase.uid, unick: this.label.string });
        MsgSender.getIntance().sendMsg(buf);
    }

    onClose() {
        if (this.node.parent) {
            this.node.removeFromParent();
        }
    }
}
