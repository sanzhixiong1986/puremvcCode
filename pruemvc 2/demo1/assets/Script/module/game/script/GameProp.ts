// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import prop_skin from "./prop_skin";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameProp extends cc.Component {

    @property([prop_skin])
    skin_set: prop_skin[] = [];

    @property(cc.Node)


    private _frame_anim = null;
    private _anim_sprite = null;
    onLoad() {

    }

    /**
     * 播放动画
     * @param form      来自谁 
     * @param to_dst    去想谁
     * @param propid    礼物的id
     */
    play_prop_anim(form, to_dst, propid) {

        this._frame_anim = this.node.getChildByName("anim").getComponent("FrameAnim");
        this._anim_sprite = this.node.getChildByName("anim").getComponent(cc.Sprite);

        if (propid <= 0 || propid > 5) {
            return;
        }

        for (let i = 0; i < this.skin_set.length; i++) {
            this.skin_set[i].node.active = false;
        }
        this.skin_set[propid - 1].node.active = true;
        this._anim_sprite.spriteFrame = this.skin_set[propid - 1].icon;

        this.node.setPosition(cc.v2(0, 0));
        var m = cc.moveTo(0.5, cc.v2(0, 400)).easing(cc.easeCubicActionOut());

        // let func = cc.callFunc(function () {
        //     this._frame_anim.sprite_frames = this.skin_set[propid - 1].anim;
        //     this._frame_anim.play_once(function () {
        //         this.node.removeFromParent();
        //     }.bind(this));
        // }.bind(this));

        // let seq = cc.sequence([m, func]);
        // this.node.runAction(seq);

        let func = () => {
            this._frame_anim.sprite_frames = this.skin_set[propid - 1].anim;  // 确保属性名称正确
            this._frame_anim.play_once(() => {
                this.node.removeFromParent();
            });
        };

        cc.tween(this.node)
            .then(m)  // 假设 m 是一个 cc.Tween 实例
            .call(func)  // 在动作完成后调用 func 函数
            .start();  // 开始执行 Tween

    }

    // update (dt) {}
}
