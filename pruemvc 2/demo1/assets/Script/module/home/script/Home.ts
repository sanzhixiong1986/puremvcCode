// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import HomeUi from "./HomeUi";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Home extends cc.Component {

    @property([cc.Button])
    tab_buttons: cc.Button[] = [];

    @property([cc.Node])
    tab_content: cc.Node[] = [];

    private _UI: HomeUi = null;

    onLoad() {
        this._UI = new HomeUi();
        this._UI.addUI(this);
        this._UI.addEvent();
    }

    protected onDestroy(): void {
        this._UI.removeEvent();
    }

    // update (dt) {}
}
