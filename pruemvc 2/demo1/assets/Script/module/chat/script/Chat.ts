// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import ChatUI from "./ChatUI";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Chat extends cc.Component {

    private UI: ChatUI = null;

    onLoad() {
        this.UI = new ChatUI();
        this.UI.addUI(this.node);
        this.UI.addEvent();
    }

    onDestroy(): void {
        this.UI.removeEvent();
    }
}
