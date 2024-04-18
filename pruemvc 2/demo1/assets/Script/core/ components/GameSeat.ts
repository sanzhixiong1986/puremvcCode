// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html
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

    private play_info: any = null;//用户信息

    onLoad() {
        this.timebar.node.active = false;//开始是不显示
        this.node.active = false;
    }

    /**
     * 如果坐下来的时候
     * @param player_info 更新用户信息 
     */
    on_sitdown(player_info) {
        this.node.active = true;
        this.play_info = player_info;
        this.unick.string = player_info.unick;
    }

    /**
     * 站起来
     */
    on_standup() {
        this.timebar.node.active = false;
        this.node.active = false;
        this.play_info = null;//清空数据
    }

    /**
     * 获得我的位置
     */
    get_sv_seatid() {
        return this.play_info.sv_seatid;
    }

    getPlayInfo() {
        return this.play_info;
    }
}
