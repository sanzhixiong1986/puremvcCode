// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class GuestPanel extends cc.Component {

    private _exit: cc.Button = null;
    private _input1: cc.EditBox = null;//账号
    private _pwd1: cc.EditBox = null;
    private _pwd2: cc.EditBox = null;
    private _send: cc.Button = null;

    onLoad() {
        //ui的添加
        this._exit = this.node.getChildByName("exit").getComponent(cc.Button);
        this._input1 = this.node.getChildByName("input1").getComponent(cc.EditBox);
        this._pwd1 = this.node.getChildByName("input2").getComponent(cc.EditBox);
        this._pwd2 = this.node.getChildByName("input3").getComponent(cc.EditBox);
        this._send = this.node.getChildByName("send").getComponent(cc.Button);
        this._exit.node.on("click", this.onExit, this);
        this._send.node.on("click", this.sendMsg, this);
    }

    protected onDestroy(): void {
        //关闭需要清理的地方
        this.setPwd("");
        this.setPwdNew("");
        this.setUnameInput("");
    }

    private onExit(): void {
        if (this.node.parent) {
            this.node.removeFromParent();
        }
    }

    /**
     * 检查是否有空的输入
     * @returns 
     */
    private checkInput() {
        let str1 = this.getPwd();
        let str2 = this.getPwdNew();
        let str3 = this.getUnameInput();
        if (str1 != "" && str2 != "" && str3 != "") {
            return true
        }
        return false;
    }

    private checkPwd() {
        let pwd1 = this.getPwd();
        let pwd2 = this.getPwdNew();
        if (pwd1 === pwd2) {
            return true;
        }
        return false;
    }

    private sendMsg(): void {

        if (!this.checkInput()) {
            console.log("数据输入有问题");
            return;
        }

        if (!this.checkPwd()) {
            console.log("密码的相关操作有问题");
            return;
        }
        console.log("测试数据");
    }

    /**
     * 设置密码
     * @param str 
     */
    private setPwd(str: string): void {
        this._pwd1.string = str;
    }

    private getPwd() {
        return this._pwd1.string
    }

    /**
     * 设置新的密码
     * @param str 
     */
    private setPwdNew(str: string): void {
        this._pwd2.string = str;
    }

    private getPwdNew() {
        return this._pwd2.string
    }

    private setUnameInput(str: string): void {
        this._input1.string = str;
    }

    private getUnameInput() {
        return this._input1.string;
    }
}
