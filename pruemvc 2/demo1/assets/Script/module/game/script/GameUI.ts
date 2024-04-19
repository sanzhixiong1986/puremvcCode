import Model from "../../../core/ components/Model";
import EventManager from "../../../core/event/EventManager";
import ConstMgr from "../../../core/netmgr/ConstMgr";
import MsgSender from "../../../core/netmgr/MsgSender";
import proto_man from "../../../core/netmgr/proto_man";
import Util from "../../../core/util/Util";
import GameCtrl from "./GameCtrl";

export default class GameUI {

    private _exit: cc.Button; //推出按钮

    private _node: cc.Node = null;

    private gameCtrl = null;

    private _itemNode: cc.Node = null; //加载成功

    private _clazz = null;
    /**
     * 开始增加ui的位置
     */
    public addUI(root: GameCtrl) {
        this.gameCtrl = root;
        this._node = root.node;
        this._exit = root.node.getChildByName("exit").getComponent(cc.Button);
        this._node.getChildByName("ui").removeAllChildren();
        Util.BundleLoad("Script/module/game", "res/showPlayInfo", (oDialogNode: cc.Node) => {
            if (oDialogNode) {
                this._itemNode = oDialogNode;
                this._clazz = this._itemNode.getComponent("ShowPlayInfo");
            }
        });
    }

    /**
     * 添加事件
     */
    public addEvent() {
        this._exit.node.on("click", this.onClick, this);

        EventManager.getInstance().registerHandler("updateGamePlayInfoA", this);
        EventManager.getInstance().registerHandler("updateSeatPlayInfo", this);
        EventManager.getInstance().registerHandler("PlayStandUp", this);
    }

    private onClick(): void {
        //发送数据
        let buf = proto_man.encode_cmd(ConstMgr.Stype.GameFiveChess, ConstMgr.Cmd.USER_QUIT, null);
        MsgSender.getIntance().sendMsg(buf);
    }

    /**
     * 删除事件
     */
    public remoevEvent() {
        EventManager.getInstance().removeHandler("updateGamePlayInfoA", this);
        EventManager.getInstance().removeHandler("updateSeatPlayInfo", this);
        EventManager.getInstance().removeHandler("PlayStandUp", this);
    }

    /**
     * 更新用户数据
     */
    private updateGamePlayInfoA(play_info) {
        this.gameCtrl.seatA.on_sitdown(play_info);
    }

    //更新用户b数据
    private updateGamePlayInfoB(play_info) {
        this.gameCtrl.seatB.on_sitdown(play_info);
    }

    //用户站起来
    private PlayStandUpFun(seat) {
        if (seat == this.gameCtrl.seatA.get_sv_seatid()) {
            this.gameCtrl.seatA.on_standup();
        }

        if (seat == this.gameCtrl.seatB.get_sv_seatid()) {
            this.gameCtrl.seatB.on_standup();
        }
    }

    /**
     * 弹窗操作
     * @param data 
     */
    alertPlayInfo(data) {
        this._node.getChildByName("ui").removeAllChildren();
        this._node.getChildByName("ui").addChild(this._itemNode);
        let num = parseInt(data);
        let unick = "";
        if (num == 1) {
            unick = this.gameCtrl.seatA.getPlayInfo().unick;
        } else {
            unick = this.gameCtrl.seatB.getPlayInfo().unick;
        }
        this._clazz.showUnick(unick);
        this.getShowProp(num);
    }

    /**
     * 获得
     * @param data 
     */
    private getShowProp(data: number) {
        let bool: boolean = false;
        data == 1 ? bool = false : bool = true;
        this._clazz.showProp(bool)
    }

    processEvent(event) {

        let msg_id: string = event.msg_id;
        console.log("收到消息" + msg_id);
        switch (msg_id) {
            case "updateGamePlayInfoA":
                this.updateGamePlayInfoA(event.data);
                break;
            case "updateSeatPlayInfo":
                this.updateGamePlayInfoB(event.data);
                break;
            case "PlayStandUp"://更新用户站起来的信息
                this.PlayStandUpFun(event.data);
                break;
        }
    }
}
