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

    /**
     * 随机产生个人
     * @param len 
     * @returns 
     */
    public static random_int_str(len: number) {
        var $chars = '0123456789';
        var maxPos = $chars.length;
        var str = '';
        for (var i = 0; i < len; i++) {
            str += $chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return str;
    }

    public static random_int(begin: number, end: number) {
        var num = begin + Math.random() * (end - begin + 1);
        num = Math.floor(num);
        if (num > end) {
            num = end;
        }
        return num;
    }
}
