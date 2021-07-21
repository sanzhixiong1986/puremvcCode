import MyData from "./MyData";
//数据部分
export default class DataProxy extends puremvc.Proxy{
    public proxyName = "DataProxy";
    private MyData:MyData = new MyData();
    private static instance:DataProxy = null;

    constructor() {
        super();
        puremvc.Proxy.NAME = "DataProxy";
        this.MyData = new MyData();
    }

    public static getInstance():DataProxy{
        if(this.instance == null){
            this.instance = new DataProxy();
        }
        return this.instance;
    }

    public addLevel(addNumber:number){
        this.MyData.Level += addNumber;
        this.sendNotification("Msg_AddLevel",this.MyData);
    }
}