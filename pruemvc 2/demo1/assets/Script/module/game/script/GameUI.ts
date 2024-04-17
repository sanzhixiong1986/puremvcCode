import Model from "../../../core/ components/Model";
import EventManager from "../../../core/event/EventManager";
import ConstMgr from "../../../core/netmgr/ConstMgr";
import MsgSender from "../../../core/netmgr/MsgSender";
import proto_man from "../../../core/netmgr/proto_man";
import GameCtrl from "./GameCtrl";

export default class GameUI {

    private _exit: cc.Button; //推出按钮

    private _node: cc.Node = null;
    /**
     * 开始增加ui的位置
     */
    public addUI(root: GameCtrl) {
        this._node = root.node;
        this._exit = root.node.getChildByName("exit").getComponent(cc.Button);
    }

    /**
     * 添加事件
     */
    public addEvent() {
        this._exit.node.on("click", this.onClick, this);

        EventManager.getInstance().registerHandler("updateGamePlayInfoA", this);
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
    }

    /**
     * 更新用户数据
     */
    private updateGamePlayInfoA() {
        let lable = this._node.getChildByName("seatA").getChildByName("name").getComponent(cc.Label);
        lable.string = Model.getIntance().getUserBase().unick;
    }

    processEvent(event) {
        let msg_id: string = event.msg_id;
        console.log("收到消息" + msg_id);
        switch (msg_id) {
            case "updateGamePlayInfoA":
                this.updateGamePlayInfoA();
                break;
        }
    }
}
