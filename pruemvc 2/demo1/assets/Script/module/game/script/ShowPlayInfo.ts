// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class ShowPlayInfo extends cc.Component {

    @property(cc.Label)
    unick: cc.Label = null;//姓名

    private _pNode = null;
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
        switch (event.node.name) {
            case "egg":
                break;
            case "hua":
                break;
            case "pijiu":
                break;
            case "zhadan":
                break;
            case "zui":
                break;
        }

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
