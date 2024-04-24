// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import SceneXLoader from "../../../core/ components/SceneXLoader";
import ConstMgr from "../../../core/netmgr/ConstMgr";
import MsgSender from "../../../core/netmgr/MsgSender";
import proto_man from "../../../core/netmgr/proto_man";

const { ccclass, property } = cc._decorator;

/**
 * home标签下的管理类
 */
@ccclass
export default class homeTab extends cc.Component {

    onLoad() {

    }

    onClickIdx(event, data) {
        SceneXLoader.startLoad(ConstMgr.moduleName + ConstMgr.gameScene, ConstMgr.gameScene);//进入游戏
        let idx = parseInt(data);
        ConstMgr.EnterRoomId = idx;
    }
}
