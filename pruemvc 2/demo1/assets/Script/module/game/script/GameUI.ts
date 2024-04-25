import Model from "../../../core/ components/Model";
import EventManager from "../../../core/event/EventManager";
import ConstMgr from "../../../core/netmgr/ConstMgr";
import MsgSender from "../../../core/netmgr/MsgSender";
import proto_man from "../../../core/netmgr/proto_man";
import Util from "../../../core/util/Util";
import CheckOut from "./CheckOut";
import GameCtrl from "./GameCtrl";
import State from "./State";

//可以对象写成子类进行操作
interface HandlerMethods {
    [methodName: string]: (data: any) => void;
}

type EventHandler = (data: any) => void;

export default class GameUI {

    private _exit: cc.Button; //推出按钮

    private _node: cc.Node = null; //父对象的

    private gameCtrl = null; //UI的父对象

    private _itemNode: cc.Node = null; //加载成功

    private _clazz = null; //弹窗的对象类

    private disk = null; //用户的桌子对象

    private handlers: HandlerMethods;//容器对象

    private _checkOutClazz: CheckOut;
    /**
     * 开始增加ui的位置
     */
    public addUI(root: GameCtrl) {

        //发送对应的消息
        if (ConstMgr.EnterRoomId > 0) {
            let buf = proto_man.encode_cmd(ConstMgr.Stype.GameFiveChess, ConstMgr.Cmd.ENTER_ZONE, ConstMgr.EnterRoomId);
            MsgSender.getIntance().sendMsg(buf);
        }

        this.handlers = {
            "updateGamePlayInfoA": this.updateGamePlayInfoA.bind(this),
            "updateSeatPlayInfo": this.updateGamePlayInfoB.bind(this),
            "PlayStandUp": this.PlayStandUpFun.bind(this),
            "sendProp": this.getProp.bind(this),
            "updateStateReady": this.onPlayDoReady.bind(this),
            "updateGameStart": this.onGameStart.bind(this),
            "updatePlayTurnTo": this.updatePlayTurnTo.bind(this),
            "updatePlayPutChess": this.updatePlayPutChess.bind(this),
            "gameEndOpenation": this.gameEndOpenation.bind(this),
            "CheckGameOver": this.CheckGameOver.bind(this),
        }

        this.gameCtrl = root;
        root.statrBtn.active = true;
        this._node = root.node;
        this.disk = this.gameCtrl.node.getChildByName("chessbox").getComponent("ChessDesk");
        this._exit = root.node.getChildByName("exit").getComponent(cc.Button);
        this._checkOutClazz = this.gameCtrl.checkOut.getComponent("CheckOut");
        this._checkOutClazz.onClose();
    }

    /**
     * 添加事件
     */
    public addEvent() {
        this._exit.node.on("click", this.onClick, this);

        EventManager.getInstance().registerHandler("updateGamePlayInfoA", this);
        EventManager.getInstance().registerHandler("updateSeatPlayInfo", this);
        EventManager.getInstance().registerHandler("PlayStandUp", this);
        EventManager.getInstance().registerHandler("sendProp", this);
        EventManager.getInstance().registerHandler("updateStateReady", this);
        EventManager.getInstance().registerHandler("updateGameStart", this);
        EventManager.getInstance().registerHandler("updatePlayTurnTo", this);
        EventManager.getInstance().registerHandler("updatePlayPutChess", this);
        EventManager.getInstance().registerHandler("gameEndOpenation", this);
        EventManager.getInstance().registerHandler("CheckGameOver", this);
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
        EventManager.getInstance().removeHandler("sendProp", this);
        EventManager.getInstance().removeHandler("updateStateReady", this);
        EventManager.getInstance().removeHandler("updateGameStart", this);
        EventManager.getInstance().removeHandler("updatePlayTurnTo", this);
        EventManager.getInstance().removeHandler("updatePlayPutChess", this);
        EventManager.getInstance().removeHandler("gameEndOpenation", this);
        EventManager.getInstance().removeHandler("CheckGameOver", this);
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
        } else {
            this.gameCtrl.seatB.on_standup();
        }
    }

    /**
     * 弹窗操作
     * @param data 
     */
    alertPlayInfo(data) {
        this._node.getChildByName("ui").removeAllChildren();
        Util.BundleLoad("Script/module/game", "res/showPlayInfo", (oDialogNode: cc.Node) => {
            if (oDialogNode) {
                this._itemNode = oDialogNode;
                this._node.addChild(oDialogNode);
                this._clazz = this._itemNode.getComponent("ShowPlayInfo");

                let num = parseInt(data);
                let unick = "";
                let to_seatid = 0;
                if (num == 1) {
                    unick = this.gameCtrl.seatA.getPlayInfo().unick;
                    to_seatid = this.gameCtrl.seatA.getPlayInfo().sv_seatid;
                } else {
                    unick = this.gameCtrl.seatB.getPlayInfo().unick;
                }

                this._clazz.showUnick(unick);
                this._clazz.getOtherUid(to_seatid)
                this.getShowProp(num);
            }
        });
    }

    /**
     * 返回发送物品的信号
     * @param data 
     */
    private getProp(data) {
        //1.创建对象
        Util.BundleLoad("Script/module/game", "res/prop", (oDialogNode: cc.Node) => {
            this._itemNode = oDialogNode;
            this._node.addChild(this._itemNode);
            //2.判断是否是自己发送给别人还是别人发送给自己
            let src_pos: cc.Vec2;
            let dst_pos: cc.Vec2;
            //3.自己发给别人
            if (data[1] == this.gameCtrl.seatA.get_sv_seatid()) {
                src_pos = this.gameCtrl.seatA.node.getPosition();
                dst_pos = this.gameCtrl.seatB.node.getPosition();
            } else {
                src_pos = this.gameCtrl.seatB.node.getPosition();
                dst_pos = this.gameCtrl.seatA.node.getPosition();
            }
            this._itemNode.getComponent("GameProp").play_prop_anim(src_pos, dst_pos, data[3]);
        })
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

    private onPlayDoReady(data) {
        if (data[0] != 1) {
            this.gameCtrl.statrBtn.active = true;
            return;
        }

        if (this.gameCtrl.seatA.get_sv_seatid() == data[1]) {
            this.gameCtrl.seatA.on_do_ready();
        } else {
            this.gameCtrl.seatB.on_do_ready();
        }
    }

    private daoTime = null;
    private onGameStart(data) {
        //清理工作
        this.gameCtrl.startTime.active = true;
        this.gameCtrl.startTime.getChildByName("t").getComponent(cc.Label).string = data[1];
        let dao = data[1];
        if (this.daoTime) {
            clearInterval(this.daoTime);
        }
        this.daoTime = setInterval(() => {
            if (dao > 0) {
                this.gameCtrl.startTime.getChildByName("t").getComponent(cc.Label).string = dao + "";
                --dao;
            } else {
                if (this.daoTime) {
                    clearInterval(this.daoTime);
                    this.daoTime = null;
                    this.gameCtrl.startTime.active = false;
                }
            }
        }, 1000);
        //end

        this.gameCtrl.seatA.onGameStart(data);
        this.gameCtrl.seatB.onGameStart(data);
    }

    /**
     * 初始化谁下棋
     * @param data 
     */
    private updatePlayTurnTo(data: any) {
        let actTime = data[0];
        let sv_seatid = data[1];
        //判断是否是自己
        if (sv_seatid == this.gameCtrl.seatA.get_sv_seatid()) {
            this.gameCtrl.seatA.turn_to_player(actTime);
            this.disk.set_your_turn(true);
        } else {
            this.gameCtrl.seatB.turn_to_player(actTime);
            this.disk.set_your_turn(false);
        }
    }

    //用户更新自己的下棋操作
    private updatePlayPutChess(data: any): void {
        if (data[0] != 1) {
            return;
        }

        let block_x = data[1];
        let block_y = data[2];
        let type = data[3];
        this.disk.put_chess_at(type, block_x, block_y);//显示棋子

        //进度条隐藏
        this.gameCtrl.seatA.hide_timebar();
        this.gameCtrl.seatB.hide_timebar();
    }

    /**
     * 游戏技术结算
     * @param data 
     */
    private gameEndOpenation(data: any): void {
        //数据为null
        if (!data) {
            return;
        }
        console.log("赢得位置" + data[0]);
        console.log("赢得钱是" + data[1]);
        //是我自己赢了
        if (data[0] === this.gameCtrl.seatA.get_sv_seatid()) {
            console.log("我自己赢了");
            this._checkOutClazz.onShow({ win: "赢", money: data[1] })
        } else {
            console.log("别人赢了");
            this._checkOutClazz.onShow({ win: "输", money: -data[1] });
        }

        if (data[0] === this.gameCtrl.seatB.get_sv_seatid()) {
            this._checkOutClazz.onShow({ win: "输", money: -data[1] });
        } else {
            this._checkOutClazz.onShow({ win: "赢", money: data[1] })
        }
    }

    /**
     * 游戏结束
     * @param data 
     */
    private CheckGameOver(data) {
        //关闭弹窗
        this._checkOutClazz.onClose();
        //桌子清空所有棋子对象
        this.disk.clean_table();
        //显示按钮
        this.gameCtrl.statrBtn.active = true;
        //清理头像
        this.gameCtrl.seatA.on_checkout_over();
        this.gameCtrl.seatB.on_checkout_over();
        //清理完毕
    }

    processEvent(event) {
        let msg_id: string = event.msg_id;
        console.log("收到消息" + msg_id);
        const methodName = msg_id;
        const handler = this.handlers[methodName as keyof HandlerMethods];
        if (handler) {
            handler(event.data);
        } else {
            console.log(`Method not found: ${methodName}`);
        }
    }
}
