// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import GameSeat from "../../../core/ components/GameSeat";
import ConstMgr from "../../../core/netmgr/ConstMgr";
import MsgSender from "../../../core/netmgr/MsgSender";
import proto_man from "../../../core/netmgr/proto_man";
import GameUI from "./GameUI";

const { ccclass, property } = cc._decorator;

/**
 * 游戏场景的的类
 */
@ccclass
export default class GameCtrl extends cc.Component {


    @property(GameSeat)
    seatA: GameSeat = null;

    @property(GameSeat)
    seatB: GameSeat = null;

    @property(cc.Node)
    statrBtn: cc.Node = null;

    @property(cc.Node)
    startTime: cc.Node = null;
    private _ui: GameUI = null;
    onLoad() {
        this._ui = new GameUI();
        this._ui.addUI(this);
        this._ui.addEvent();
    }

    protected onDestroy(): void {
        this._ui.remoevEvent();
    }

    onClickA(event, data) {
        let num = parseInt(data);
        this._ui.alertPlayInfo(data);
    }

    onClickRead() {
        this.statrBtn.active = false;
        let buf = proto_man.encode_cmd(ConstMgr.Stype.GameFiveChess, ConstMgr.Cmd.SEND_DO_READY, null);
        MsgSender.getIntance().sendMsg(buf);
    }
}
