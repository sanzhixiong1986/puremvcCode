// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import MsgSender from "../../../core/netmgr/MsgSender";
import proto_man from "../../../core/netmgr/proto_man";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LoginBonues extends cc.Component {
    @property([cc.Label])
    chip_label: cc.Label[] = [];

    @property([cc.Node])
    zw_icon: cc.Node[] = [];

    private bonues_id = 0;
    private bonuse_info = [];
    onLoad() {
        //做一个假的数据
        this.bonuse_info = ["100", "200", "300", "400", "500"];
        for (let i = 0; i < this.chip_label.length; i++) {
            this.chip_label[i].string = this.bonuse_info[i];
            this.chip_label[i].node.color = cc.color(0, 0, 0, 255);
            this.zw_icon[i].active = false;
        }

        this.node.active = true;
    }

    /**
     * 显示这个面板
     * @param id 
     * @param bonuse 
     * @param days 
     */
    show_login_bonuses(id, bonuse, days) {
        this.node.active = true;
        this.bonues_id = id; //领取告诉服务器是那个需要领取
        let i;

        if (days > this.bonuse_info.length) {
            days = this.bonuse_info.length;//不能越界
        }

        //显示已经领取的部分
        for (let i = 0; i < days; i++) {
            this.chip_label[i].node.color = new cc.Color(255, 0, 0, 255);//全部变为红色
            this.zw_icon[i].active = false;
        }

        for (; i < this.bonuse_info.length; i++) {
            this.chip_label[i].node.color = new cc.Color(0, 0, 0, 255);
            this.zw_icon[i].active = false;
        }

        this.zw_icon[days - 1].active = true;

    }

    onExit() {
        if (this.node.parent) {
            this.node.removeFromParent();
        }
    }

    onSend() {
        let buf = proto_man.encode_cmd(2, 11, this.bonues_id);
        MsgSender.getIntance().sendMsg(buf);
        this.onExit();
    }
}
