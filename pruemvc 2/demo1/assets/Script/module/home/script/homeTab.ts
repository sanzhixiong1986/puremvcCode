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
        event.stopPropagation();//防止冒泡影响下拉
        let idx = parseInt(data);
        if (idx > 0) {
            
            let buf = proto_man.encode_cmd(4, 14, idx);
            MsgSender.getIntance().sendMsg(buf);
        }
    }
}
