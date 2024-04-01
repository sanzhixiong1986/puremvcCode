import EventManager from "../../../core/event/EventManager";
import MsgSender from "../../../core/netmgr/MsgSender";
import proto_man from "../../../core/netmgr/proto_man";
import Util from "../../../core/util/Util";
import Chat from "./Chat";

export default class ChatUI {

    private sendButton: cc.Button = null;
    private msgButton: cc.Button = null;

    private random_name: string = "";
    private random_sex: number = 0;

    private input: cc.EditBox = null;
    private scroll_content: cc.ScrollView = null;
    private chat: Chat = null;
    private exitBtn: cc.Button = null;

    addUI(self: Chat) {
        this.chat = self;
        this.random_name = "游客" + Util.random_int_str(4);
        this.random_sex = Util.random_int(1, 2);

        this.sendButton = self.node.getChildByName("send").getComponent(cc.Button);
        this.msgButton = self.node.getChildByName("msg").getComponent(cc.Button);
        this.input = self.node.getChildByName("input").getComponent(cc.EditBox);
        this.scroll_content = self.node.getChildByName("ScrollView").getComponent(cc.ScrollView);
        this.exitBtn = self.node.getChildByName("exit").getComponent(cc.Button);

        this.sendButton.node.on("click", this.onClick, this);
        this.msgButton.node.on("click", this.onSendMsg, this);
        this.exitBtn.node.on("click", this.onClickExit, this);
    }

    /**
     * 发送消息
     */
    private onSendMsg(): void {
        let buf = proto_man.encode_cmd(1, 5, { msg: this.input.string });
        MsgSender.getIntance().sendMsg(buf);
        this.input.string = "";
    }

    private onClickExit(): void {
        let buf = proto_man.encode_cmd(1, 2, null);
        MsgSender.getIntance().sendMsg(buf);
    }

    /**
     * tips的
     * @param str 
     */
    private show_tip_msg(str: string): void {
        this.showTalk(this.chat.desic_prefab, "desic", "", str);
    }

    /**
     * 显示我自己的操作
     * @param uname 
     * @param msg 
     */
    private show_self_talk(uname: string, msg: string): void {
        this.showTalk(this.chat.selftalk_prefab, "uname", "msg", uname, msg);
    }

    /**
     * 显示其他的人
     * @param uname 
     * @param msg 
     */
    private show_other_talk(uname: string, msg: string): void {
        this.showTalk(this.chat.othertalk_prefab, "uname", "msg", uname, msg);
    }

    /**
     * 集合函数
     * @param node 
     * @param LabelName 
     * @param msg 
     */
    private showTalk(node: cc.Prefab, LabelName: string, LabelMsg?: string, uname?: string, msg?: string) {
        let nodes = cc.instantiate(node);
        let label = nodes.getChildByName(LabelName).getComponent(cc.Label);
        label.string = uname;
        if (LabelMsg != "") {
            label = nodes.getChildByName(LabelMsg).getComponent(cc.Label);
            label.string = msg;
        }
        this.scroll_content.content.addChild(nodes);
        this.scroll_content.content.height += nodes.height;
        this.scroll_content.scrollToBottom(0.1);
    }

    //添加监听的事件
    addEvent() {
        EventManager.getInstance().registerHandler("test", this);
        EventManager.getInstance().registerHandler("UserArrive", this);
        EventManager.getInstance().registerHandler("UserEixt", this);
        EventManager.getInstance().registerHandler("otherExit", this);
        EventManager.getInstance().registerHandler("SendMsg", this);
        EventManager.getInstance().registerHandler("UserMsg", this);
    }

    //删除对应的事件
    removeEvent() {
        EventManager.getInstance().removeHandler("test", this);
        EventManager.getInstance().removeHandler("UserArrive", this);
        EventManager.getInstance().removeHandler("UserEixt", this);
        EventManager.getInstance().removeHandler("otherExit", this);
        EventManager.getInstance().removeHandler("SendMsg", this);
        EventManager.getInstance().removeHandler("UserMsg", this);
    }


    private onClick(): void {
        console.log("发送数据到服务器端");
        let buf = proto_man.encode_cmd(1, 1, { uname: this.random_name, usex: this.random_sex });
        MsgSender.getIntance().sendMsg(buf);
    }

    processEvent(event) {
        let msg_id: string = event.msg_id;
        console.log("收到消息" + msg_id);
        switch (msg_id) {
            case "test":
                console.log("收到服务器信息" + event.data);
                if (event.data == 1) {
                    this.show_tip_msg("你已经成功进入聊天室");
                }
                break;
            case "UserArrive"://获得用户的提示
                this.show_tip_msg(event.data.uname + "进入聊天室");
                break;
            case "UserEixt"://离开
                if (event.data == 1) {
                    this.show_tip_msg("你已经离开聊天室");
                }
                break;
            case "otherExit"://操作
                this.show_tip_msg(event.data.uname + "离开聊天室");
                break;
            case "SendMsg"://发送消息
                if (event.data[0] == 1) {
                    this.show_self_talk(event.data[1], event.data[3].msg)
                }
                break;
            case "UserMsg":
                this.show_other_talk(event.data[0], event.data[2].msg);
                break;
        }
    }
}
