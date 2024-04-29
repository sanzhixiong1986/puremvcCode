// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import AudioMajordomo from "../../../core/components/AudioMajordomo";
import Util from "../../../core/util/Util";

const { ccclass, property } = cc._decorator;

@ccclass
export default class hall extends cc.Component {

    private _itemNode: cc.Node = null;


    @property(cc.Sprite)
    images: cc.Sprite = null;

    onLoad(): void {
        //动态加载Prefab
        // Util.BundleLoad("Script/module/hall", "res/white", (oDialogNode: cc.Node) => {
        //     this._itemNode = oDialogNode;
        //     this.node.addChild(this._itemNode);
        // })

        // Util.BundleLoadImage("Script/module/hall", "res/white", (oDialogNode: cc.SpriteFrame) => {
        //     this.images.spriteFrame = oDialogNode;
        //     this.node.addChild(this._itemNode);
        // })

        AudioMajordomo.getInstance().playBGMusic("hall", "res/audio/BGMusic_Hall_", true);

        //测试特效的生意
        AudioMajordomo.getInstance().playSound(
            "hall", 
            `res/audio/ButtonClicked_0_`
        );
    }
}
