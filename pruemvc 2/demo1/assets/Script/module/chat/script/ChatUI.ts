import EventManager from "../../../core/event/EventManager";
import MsgSender from "../../../core/netmgr/MsgSender";
import proto_man from "../../../core/netmgr/proto_man";

export default class ChatUI {

    private sendButton: cc.Button = null;
    private msgButton: cc.Button = null;

    addUI(root: cc.Node) {
        this.sendButton = root.getChildByName("send").getComponent(cc.Button);
        this.msgButton = root.getChildByName("msg").getComponent(cc.Button);

        this.sendButton.node.on("click", this.onClick, this);
        this.msgButton.node.on("click", this.onSendMsg, this);
    }

    private onSendMsg(): void {
        let buf = proto_man.encode_cmd(1, 5, { msg: "helloworld" });
        MsgSender.getIntance().sendMsg(buf);
    }

    //添加监听的事件
    addEvent() {
        EventManager.getInstance().registerHandler("test", this);
        EventManager.getInstance().registerHandler("UserArrive", this);
    }

    //删除对应的事件
    removeEvent() {
        EventManager.getInstance().removeHandler("test", this);
        EventManager.getInstance().removeHandler("UserArrive", this);
    }

    private onClick(): void {
        console.log("test");
        let buf = proto_man.encode_cmd(1, 1, { uname: "back", usex: 1 });
        MsgSender.getIntance().sendMsg(buf);
    }

    processEvent(event) {
        let msg_id: string = event.msg_id;
        console.log("收到消息" + msg_id);
        switch (msg_id) {
            case "test":
                console.log("收到服务器信息" + event.data);
                break;
            case "UserArrive"://获得用户的提示
                console.log("收到进入聊天室用户" + event.data.uname);
                break;
        }
    }
}
