// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

/**
 * rank的info操作
 */
@ccclass
export default class rankItem extends cc.Component {

    @property(cc.Label)
    rank: cc.Label = null;

    @property(cc.Label)
    nickName: cc.Label = null;

    @property(cc.Label)
    money: cc.Label = null;

    onLoad() {

    }

    updateInfo(data) {
        this.rank.string = data.urank;
        this.nickName.string = data.unickName;
        this.money.string = data.umoney;
    }
}
