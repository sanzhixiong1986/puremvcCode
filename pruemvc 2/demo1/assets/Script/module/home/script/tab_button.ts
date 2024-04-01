// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class tab_button extends cc.Component {

    @property(cc.SpriteFrame)
    icon_normal: cc.SpriteFrame;

    @property(cc.SpriteFrame)
    icon_seleced: cc.SpriteFrame;

    private icon: cc.Sprite = null;
    private label: cc.Label = null;

    private is_active: boolean = false;
    onLoad() {
        //本地的相关操作
        this.icon = this.node.getChildByName("icon").getComponent(cc.Sprite);
        this.label = this.node.getChildByName("name").getComponent(cc.Label);

        this.is_active = false;
    }

    set_actived(is_active: boolean) {
        this.is_active = is_active;
        if (this.is_active) {
            this.setShow(this.icon_seleced, new cc.Color(64, 155, 226, 255))
        } else {
            this.setShow(this.icon_normal, new cc.Color(118, 118, 118, 255))
        }
    }

    private setShow(sp: cc.SpriteFrame, color: cc.Color) {
        this.icon.spriteFrame = sp;
        this.label.node.color = color;
    }
}
