import GameCtrl from "./GameCtrl";

export default class GameUI {

    private _exit: cc.Button; //推出按钮
    /**
     * 开始增加ui的位置
     */
    public addUI(root: GameCtrl) {
        this._exit = root.node.getChildByName("exit").getComponent(cc.Button);
    }

    /**
     * 添加事件
     */
    public addEvent() {
        this._exit.node.on("click", this.onClick, this);
    }

    private onClick(): void {
        console.log("点击了退出按钮");
        cc.director.loadScene("home");
    }

    /**
     * 删除事件
     */
    public remoevEvent() {
    
    }
}
