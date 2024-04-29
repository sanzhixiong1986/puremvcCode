import Async from "./Async";
const RES_0 = "res";
export default class SceneXLoader {
    /**
     * 私有化类默认构造器
     */
    private constructor() {
    }

    /**
     * 开始加载场景 
     * @param strBundleName Bundle 名称
     * @param strSceneName 场景名称
     */
    static startLoad(strBundleName: string, strSceneName: string): void {
        if (null == strBundleName ||
            null == strSceneName) {
            return;
        }
        // Bundle
        let oLoadedBundle: cc.AssetManager.Bundle = null;
        Async.serial(
            // step000:
            // 事先加载 Bundle
            (funYesContinue) => {
                //strVybdkeBane是对于土办法的资源包的名字
                cc.assetManager.loadBundle(strBundleName, (oError: Error, oBundle: cc.AssetManager.Bundle) => {
                    if (null != oError) {
                        cc.log(oError);
                        return;
                    }

                    oLoadedBundle = oBundle;
                    funYesContinue();
                });
            },

            // step010:
            // 预加载零级资源目录
            (funYesContinue) => {
                if (null == oLoadedBundle) {
                    cc.error("oLoadedBundle is null");
                    return;
                }
                oLoadedBundle.preloadDir(
                    RES_0,

                    // onProgress
                    (nCompletedCount, nTotalCount/*, oItem*/) => {
                        cc.find("Canvas/loading").getComponent("Loading").showLoading();
                        cc.find("Canvas/loading").getComponent("Loading").showLoadingPer(nCompletedCount / nTotalCount)
                        console.log("nCompletedCount / nTotalCount=" + nCompletedCount / nTotalCount);
                    },

                    // onComplete
                    (oError: Error/*, oItemArray: Array<cc.AssetManager.RequestItem>*/) => {
                        if (null != oError) {
                            cc.error(oError);
                            return;
                        }

                        // 预加载完成之后, 再单独加载一次!
                        oLoadedBundle.loadDir("res", (oError: Error) => {
                            if (null != oError) {
                                cc.error(oError);
                                return;
                            }

                            funYesContinue();
                        });
                    }
                );
            },

            // step020:
            // 预加载场景
            () => {
                oLoadedBundle.preloadScene(strSceneName, (oError: Error) => {
                    if (null != oError) {
                        cc.error(oError);
                        return;
                    }

                    oLoadedBundle.loadScene(strSceneName, (oError: Error) => {
                        if (null != oError) {
                            cc.error(oError);
                            return;
                        }
                        cc.find("Canvas/loading").getComponent("Loading").clean();
                        cc.director.loadScene(strSceneName);
                    });
                });
            },
        );
    }
}