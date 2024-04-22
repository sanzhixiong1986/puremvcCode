// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import State from "../../module/game/script/State";

/**
 * 用户的显示相关
 */
const { ccclass, property } = cc._decorator;

@ccclass
export default class GameSeat extends cc.Component {

    @property(cc.Label)
    unick: cc.Label = null;//用户的姓名

    @property(cc.Sprite)
    timebar: cc.Sprite = null; //时间的显示

    @property(cc.Node)
    ready_icon: cc.Node = null;

    private play_info: any = null;//用户信息

    onLoad() {
        this.timebar.node.active = false;//开始是不显示
        //是不显示
        this.ready_icon.active = false; //初始化的时候显示
        this.node.active = false;
    }

    /**
     * 如果坐下来的时候
     * @param player_info 更新用户信息 
     */
    on_sitdown(player_info) {
        this.node.active = true;
        this.ready_icon.active = false;
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
}
