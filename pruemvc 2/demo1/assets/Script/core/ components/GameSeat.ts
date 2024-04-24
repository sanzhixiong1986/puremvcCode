// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import State from "../../module/game/script/State";
import ActionTime from "./ActionTime";

/**
 * 用户的显示相关
 */
const { ccclass, property } = cc._decorator;

@ccclass
export default class GameSeat extends cc.Component {

    @property(cc.Label)
    unick: cc.Label = null;//用户的姓名

    @property(ActionTime)
    timebar: ActionTime = null; //时间的显示

    @property(cc.Node)
    ready_icon: cc.Node = null;

    @property(cc.Node)
    black: cc.Node = null; //黑子

    @property(cc.Node)
    wirte: cc.Node = null; //白子

    private play_info: any = null;//用户信息

    private _state = null; //当前人物的状态

    private _black_seat = null;
    private _action_time = null;
    onLoad() {
        this.timebar.node.active = false;//开始是不显示
        //是不显示
        this.ready_icon.active = false; //初始化的时候显示
        this.node.active = false;
        //黑白子开始不显示
        this.wirte.active = false;
        this.black.active = false;
        //end
        this._state = State.State.InView;//当前是观望状态
    }

    /**
     * 如果坐下来的时候
     * @param player_info 更新用户信息 
     */
    on_sitdown(player_info) {
        //黑白子不显示
        this.wirte.active = false;
        this.black.active = false;
        //end
        this.node.active = true;
        this.ready_icon.active = false;
        this._state = State.State.InView;
        this.play_info = player_info;
        this.unick.string = player_info.unick;
        if (player_info.state == State.State.Ready) {
            this.ready_icon.active = true;
        }
    }

    /**
     * 站起来
     */
    on_standup() {
        this._state = State.State.InView;//变成观望

        this.timebar.node.active = false;
        this.ready_icon.active = false;
        this.node.active = false;
        this.play_info = null;//清空数据
    }

    /**
     * 获得我的位置
     */
    get_sv_seatid() {
        return this.play_info.sv_seatid;
    }

    on_do_ready() {
        this.ready_icon.active = true;
    }

    getPlayInfo() {
        return this.play_info;
    }

    //游戏开始
    onGameStart(round_data: any) {
        this._black_seat = round_data[2];//是黑色棋子
        this._action_time = round_data[0];//时间操作
        this.ready_icon.active = false;
        this.timebar.node.active = false;
        this._state = State.State.Playing;//进入游戏状态了
        //如果黑子是别人
        if (this._black_seat === this.play_info.sv_seatid) {
            this.black.active = true;
            this.wirte.active = false;
        } else {
            this.black.active = false;
            this.wirte.active = true;
        }
    }

    //让时间走起来
    turn_to_player(actionTime: number) {
        this.timebar.node.active = true;
        this.timebar.startActionTime(actionTime);//启动
    }

    //隐藏进度条
    hide_timebar() {
        this.timebar.node.active = false;
    }
}
