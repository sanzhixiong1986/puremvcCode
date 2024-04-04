import PrefabXFactory from "../../../core/ components/PrefabXFactory";
import editNode from "./edit.editNode";

const PREFAB_NAME = "res/prefab/playEdit";

export default class EditPlayDialogFactory {



    private constructor() { };

    /**
     * 创建弹窗
     * @param funCallback 回调函数 
     */
    static createAsync(funCallback: (oDialogNode: cc.Node) => void): void {
        PrefabXFactory.createAsync("Script/module/playEdit", PREFAB_NAME, editNode, funCallback);
    }
}
