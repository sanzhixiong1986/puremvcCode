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

    /**
     * 随机一个整数
     * @param begin 
     * @param end 
     * @returns 
     */
    public static random_int(begin, end) {
        var num = begin + Math.random() * (end - begin + 1);
        num = Math.floor(num);
        if (num > end) {
            num = end;
        }
        return num;
    }


    public static random_string(len) {
        var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';

        var maxPos = $chars.length;
        var str = '';
        for (var i = 0; i < len; i++) {
            str += $chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return str;
    }

    public static BundleLoad(strBundleName: string, strPrefabPath: string, funCallback: (oNewDialog: cc.Node) => void) {
        let oThatBundle = cc.assetManager.getBundle(strBundleName);
        // 确保回调函数不为空
        const funCbFinally = funCallback || function () {
        };
        cc.assetManager.loadBundle(strBundleName, (oError: Error, oLoadedBundle: cc.AssetManager.Bundle) => {
            if (null != oError) {
                cc.error(oError);
                return;
            }

            if (null == oLoadedBundle) {
                cc.error(`Bundle is null, bundleName = ${strBundleName}`);
                funCbFinally(null);
                return;
            }

            oThatBundle = oLoadedBundle;
            //获取缓存预制体
            let oCachedPrefab = oThatBundle.get(strPrefabPath, cc.Prefab) as cc.Prefab;
            if (null != oCachedPrefab) {
                // 创建新节点
                let oNewNode = cc.instantiate(oCachedPrefab);
                funCbFinally(oNewNode);
                return;
            }

            oThatBundle.load(strPrefabPath, cc.Prefab, (oError: Error, oLoadedPrefab: cc.Prefab) => {
                if (null != oError) {
                    cc.log(oError);
                    funCbFinally(null);
                    return;
                }

                if (null == oLoadedPrefab) {
                    cc.log(`加载预制体为空, prefabPath = ${strPrefabPath}`);
                    funCbFinally(null);
                    return;
                }

                // 创建新节点
                let oNewNode = cc.instantiate(oLoadedPrefab);

                if (null == oNewNode) {
                    cc.error(`创建新节点失败, prefabPath = ${strPrefabPath}`);
                    funCbFinally(null);
                    return;
                }

                funCbFinally(oNewNode);
            });
        });
    }
}