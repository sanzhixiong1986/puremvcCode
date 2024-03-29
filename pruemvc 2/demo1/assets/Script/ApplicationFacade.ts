import DataCommand from "./ctrl/DataCommand";
import DataMediator from './view/DataMediator';
import DataProxy from "./model/DataProxy";
import MsgSender from "./core/netmgr/MsgSender";
import AllHandlerz from "./core/netmgr/AllHandlerz";
import proto_man from "./core/netmgr/proto_man";
/**
 * 全局控制类
 */
export default class ApplicationFacade extends puremvc.Facade {
    public constructor(gameRoot: cc.Node) {
        super("gameRoot");
        //进行注册
        this.registerCommand("Reg_StartDataCommand", DataCommand);
        this.registerMediator(new DataMediator(gameRoot)); //显示类
        this.registerProxy(DataProxy.getInstance());
        console.log("注册消息");


        window.setTimeout(() => {
            let buf = proto_man.encode_cmd(1, 1, { uname: "back", upwd: "123456" });
            MsgSender.getIntance().sendMsg(buf);
        }, 2000);
    }
}