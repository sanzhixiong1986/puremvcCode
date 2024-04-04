import PrefabXFactory from "../../../core/ components/PrefabXFactory";
import GuestPanel from "./guest.GuestPanel";
const PREFAB_NAME = "res/guestUp";
export default class GuestPanelDialogFactory {

    private constructor() { };

    /**
     * 创建弹窗
     * @param funCallback 回调函数 
     */
    static createAsync(funCallback: (oDialogNode: cc.Node) => void): void {
        PrefabXFactory.createAsync("Script/module/guestUp", PREFAB_NAME, GuestPanel, funCallback);
    }
}
