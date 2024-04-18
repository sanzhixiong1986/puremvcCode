// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import GameSeat from "../../../core/ components/GameSeat";
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
}
