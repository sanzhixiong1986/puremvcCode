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
}
