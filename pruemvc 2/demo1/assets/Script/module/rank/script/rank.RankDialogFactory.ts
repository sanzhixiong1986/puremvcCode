import PrefabXFactory from "../../../core/ components/PrefabXFactory";
import rankNode from "./rank.rankNode";

const PREFAB_NAME = "res/worldRank";

export default class RankDialogFactory {

    private constructor() { };

    /**
     * 创建弹窗
     * @param funCallback 回调函数 
     */
    static createAsync(funCallback: (oDialogNode: cc.Node) => void): void {
        PrefabXFactory.createAsync("Script/module/rank", PREFAB_NAME, rankNode, funCallback);
    }
}
