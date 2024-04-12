// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import EventManager from "../../../core/event/EventManager";
import MsgSender from "../../../core/netmgr/MsgSender";
import proto_man from "../../../core/netmgr/proto_man";
import Util from "../../../core/util/Util";

const { ccclass, property } = cc._decorator;

@ccclass
export default class rankNode extends cc.Component {

    private _itemNode: cc.Node = null; //加载成功

    private _ontext: cc.Node = null;
    onLoad() {
        Util.BundleLoad("Script/module/rank", "res/rankItem", (oDialogNode: cc.Node) => {
            if (oDialogNode) {
                this._itemNode = oDialogNode;
            }
        });

        //列表的父对象
        this._ontext = this.node.getChildByName("view").getChildByName("content");

        let closebtn = this.node.getChildByName("close").getComponent(cc.Button);
        closebtn.node.on("click", this.onClose, this);

        //发送数据
        let buf = proto_man.encode_cmd(3, 13, null);
        MsgSender.getIntance().sendMsg(buf);
        //请求数据
        EventManager.getInstance().registerHandler("worldRank", this);
    }

    onDestroy(): void {
        EventManager.getInstance().removeHandler("worldRank", this);
    }

    private updateInfo(data: any): void {
        if (data == null) {
            return;
        }
        this._ontext.removeAllChildren();
        let datas = [
            {
                urank: 1,
                unickName: "sanzhixiong",
                umoney: 100000,
            },
            {
                urank: 2,
                unickName: "sanzhixiong1",
                umoney: 10000,
            },
            {
                urank: 3,
                unickName: "sanzhixiong3",
                umoney: 100,
            }
        ]

        for (let i = 0; i < datas.length; i++) {
            const item = cc.instantiate(this._itemNode)
            item.getComponent("rank.rankItem").updateInfo(datas[i]);
            this._ontext.addChild(item);
        }
        this._ontext.height = 160 * datas.length + 10;
    }

    processEvent(event) {
        let msg_id: string = event.msg_id;
        console.log("收到消息" + msg_id);
        switch (msg_id) {
            case "worldRank"://更新相关的操作
                this.updateInfo(event.data);
                break;
        }
    }

    private onClose() {
        if (this.node.parent) {
            this.node.removeFromParent();
        }
    }
}
