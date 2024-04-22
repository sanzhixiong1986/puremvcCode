// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import ConstMgr from "../../../core/netmgr/ConstMgr";
import MsgSender from "../../../core/netmgr/MsgSender";
import proto_man from "../../../core/netmgr/proto_man";
import Util from "../../../core/util/Util";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ShowPlayInfo extends cc.Component {

    @property(cc.Label)
    unick: cc.Label = null;//姓名

    private _pNode = null;

    private _itemNode: cc.Node = null; //加载成功

    private _to_seatid: number = -1;
    onLoad() {
        let pNode = this._pNode = this.node.getChildByName("bg").getChildByName("Layout");
        pNode.getChildByName("egg").on("click", this.onClick, this);
        pNode.getChildByName("hua").on("click", this.onClick, this);
        pNode.getChildByName("pijiu").on("click", this.onClick, this);
        pNode.getChildByName("zhadan").on("click", this.onClick, this);
        pNode.getChildByName("zui").on("click", this.onClick, this);


    }

    onDestroy(): void {
        this._pNode.getChildByName("egg").off("click", this.onClick, this);
        this._pNode.getChildByName("hua").off("click", this.onClick, this);
        this._pNode.getChildByName("pijiu").off("click", this.onClick, this);
        this._pNode.getChildByName("zhadan").off("click", this.onClick, this);
        this._pNode.getChildByName("zui").off("click", this.onClick, this);
    }

    onClick(event) {
        console.log(event.node.name);
        let propid = 0;
        switch (event.node.name) {
            case "egg":
                propid = 1;
                break;
            case "hua":
                propid = 2;
                break;
            case "pijiu":
                propid = 3;
                break;
            case "zhadan":
                propid = 5;
                break;
            case "zui":
                propid = 4;
                break;
        }
        console.log("道具id" + propid);
        console.log("用户的座位号" + this._to_seatid);
        let body = {
            0: propid,
            1: this._to_seatid,
        }
        let buf = proto_man.encode_cmd(ConstMgr.Stype.GameFiveChess, ConstMgr.Cmd.SEND_PROP, body);
        MsgSender.getIntance().sendMsg(buf);

        this.onExit();//退出
    }

    /**
     * 显示人物的姓名
     * @param str 
     */
    showUnick(str: string) {
        this.unick.string = str;
    }

    /**
     * 获得其他的用户id
     * @param to_seatid 
     */
    getOtherUid(to_seatid) {
        this._to_seatid = to_seatid;
    }

    /**
     * 是否显示礼物的相关操作
     * @param bool 
     */
    showProp(bool: boolean) {
        this._pNode.active = bool
    }

    onExit() {
        if (this.node.parent) {
            this.node.removeFromParent();
        }
    }
}
