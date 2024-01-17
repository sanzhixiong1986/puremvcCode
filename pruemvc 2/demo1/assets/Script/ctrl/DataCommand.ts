import DataProxy from "../model/DataProxy";

//控制
export default class DataCommand extends puremvc.SimpleCommand{
    public execute(notification:puremvc.INotification){
        //对数据进行操作
        let dataPro = puremvc.Facade.getInstance("gameRoot").retrieveProxy(DataProxy.NAME) as DataProxy;
        dataPro.addLevel(10)
    }
}