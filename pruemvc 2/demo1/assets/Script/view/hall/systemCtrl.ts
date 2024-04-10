// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import PrefabXFactory from "../../core/ components/PrefabXFactory";

const { ccclass, property } = cc._decorator;

@ccclass
export default class systemCtrl extends cc.Component {

    onLoad() {

    }

    onClick(event, data) {
        switch (data) {
            case "rank":
                console.log("点击了排行榜");

                PrefabXFactory.useSpecifyFactoryCreate("Script/module/rank", "rank.RankDialogFactory", (oDialogNode) => {
                    if (null == oDialogNode) {
                        return;
                    }

                    this.node.parent.parent.addChild(oDialogNode);
                })

                break;
        }
    }
}
