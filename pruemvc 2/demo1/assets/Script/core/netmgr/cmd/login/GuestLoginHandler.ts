import Model from "../../../ components/Model";
import MsgSender from "../../MsgSender";
import proto_man from "../../proto_man";

export default class GuestLoginHandler {

    handle(oMsgBody: any) {
        console.log("游客登录收到服务器返回数据");
        if (oMsgBody == -1001) {
            console.log("用户被挤下来了");
        }
        else {
            //把基础的数据赋值
            Model.getIntance().setUserBase(oMsgBody);
            oMsgBody.now = Date.now();
            console.log("当前的时间戳" + oMsgBody.now);
            //记录当前的数据
            localStorage.setItem(oMsgBody.uid + "", JSON.stringify(oMsgBody));
            localStorage.setItem("uid", oMsgBody.uid);
            //发送消息获得游戏相关的信息
            let buf = proto_man.encode_cmd(3, 10, null);
            MsgSender.getIntance().sendMsg(buf);
            //结束发送消息
        }
    }
}
