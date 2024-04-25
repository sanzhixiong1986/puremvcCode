// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

interface dataVo {
    win: string,
    money: number,
}

@ccclass
export default class CheckOut extends cc.Component {

    @property(cc.Label)
    win: cc.Label = null;

    @property(cc.Label)
    money: cc.Label = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {

    }

    onShow(vo: dataVo) {
        this.setNodeShow(true);
        this.setWin(vo.win);
        this.setMoney(vo.money);
    }

    onClose() {
        this.setNodeShow(false);
        this.setWin("");
        this.setMoney(0);
    }

    private setNodeShow(bool: boolean) {
        this.node.active = bool;
    }

    private setWin(str: string) {
        this.win.string = str;
    }

    private setMoney(num: number) {
        this.money.string = num.toFixed(2);
    }
}
