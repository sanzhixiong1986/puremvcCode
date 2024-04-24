// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import ConstMgr from "../../../core/netmgr/ConstMgr";
import MsgSender from "../../../core/netmgr/MsgSender";
import proto_man from "../../../core/netmgr/proto_man";

/**
 * 棋盘的操作
 */
const { ccclass, property } = cc._decorator;

@ccclass
export default class ChessDesk extends cc.Component {

    //棋子对象
    @property([cc.Prefab])
    chess_prefab: cc.Prefab[] = [];

    private your_turn: boolean = false;

    onLoad() {
        this.your_turn = false;
        //点击事件
        this.node.on(cc.Node.EventType.TOUCH_START, function (e) {
            if (!this.your_turn) {
                return;
            }

            let w_pos = e.getLocation();
            let pos = this.node.convertToNodeSpaceAR(w_pos);
            pos.x += 41 * 7;
            pos.y += 41 * 7;

            let block_x = Math.floor((pos.x + 41 * 0.5) / 41);
            let block_y = Math.floor((pos.y + 41 * 0.5) / 41);
            //判断是否出界
            if (block_x < 0 || block_x > 14 || block_y < 0 || block_y > 14) {
                return;
            }

            let body = {
                0: block_x,
                1: block_y,
            }
            //发送给服务
            let buf = proto_man.encode_cmd(ConstMgr.Stype.GameFiveChess, ConstMgr.Cmd.PUT_CHESS, body);
            MsgSender.getIntance().sendMsg(buf);

        }.bind(this), this);
    }

    set_your_turn(your_turn) {
        this.your_turn = your_turn;
    }

    //显示棋子
    put_chess_at(chess_type, block_x, block_y) {
        let chess = cc.instantiate(this.chess_prefab[chess_type - 1]);
        this.node.addChild(chess);

        let xpos = block_x * 41 - 41 * 7;
        let ypos = block_y * 41 - 41 * 7;
        chess.setPosition(cc.v2(xpos, ypos));
    }
}
