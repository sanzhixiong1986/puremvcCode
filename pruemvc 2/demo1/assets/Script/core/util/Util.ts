/**
 * 相关的操作
 */
export default class Util {

    /**
     * 获得IFacade
     * @param name 
     */
    public static getPureFacade(name: string): puremvc.IFacade {
        return puremvc.Facade.getInstance(name);
    }

    /**
     * 新增加的操作
     * @param url 
     * @param type 
     * @param callbacks 
     */
    public static loadAsset(url: string, type: any, callbacks) {
        cc.resources.load(url, type, (error, asset) => {
            if (error) {
                console.log(error);
                return;
            }
            callbacks(error, asset);
        })
    }

    /**
     * 清空数据
     * @param url 
     * @param type 
     */
    public static removeAsset(url: string, type: any) {
        cc.resources.release(url, type);
    }
}
