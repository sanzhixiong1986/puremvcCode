import DataCommand from "./DataCommand";
import DataMediator from './DataMediator';
import DataProxy from "./DataProxy";
/**
 * 全局控制类
 */
export default class ApplicationFacade extends puremvc.Facade{
    public constructor(gameRoot:cc.Node){
        super("gameRoot");
        //进行注册
        this.registerCommand("Reg_StartDataCommand",DataCommand);
        this.registerMediator(new DataMediator(gameRoot)); //显示类
        this.registerProxy(DataProxy.getInstance());
        console.log("注册消息");
    }
}