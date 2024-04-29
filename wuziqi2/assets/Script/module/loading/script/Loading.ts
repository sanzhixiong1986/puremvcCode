// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class Loading extends cc.Component {

    @property(cc.Sprite)
    sp: cc.Sprite

    private _isRun: boolean = false;
    start() {
        this._isRun = false;
    }

    /**
     * 显示事件
     */
    showLoading() {
        this.node.active = true;
    }

    showLoadingPer(cur) {
        this.sp.fillRange = cur;
    }

    clean() {
        this.node.active = false;
        this.sp.fillRange = 0;
    }
}
