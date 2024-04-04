// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import mineUI from "./mineUI";

const { ccclass, property } = cc._decorator;

@ccclass
export default class mine extends cc.Component {

    private minUI: mineUI = null;

    onLoad() {
        this.minUI = new mineUI();
        this.minUI.addUI(this);
    }


    onSelect(event, data) {
        this.minUI.onClick(data);
    }
}
