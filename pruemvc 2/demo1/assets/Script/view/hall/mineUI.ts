import PrefabXFactory from "../../core/ components/PrefabXFactory";
import mine from "./mine";

/**
 * mine用户ui操作
 */
export default class mineUI {
    private UI: mine = null;
    public addUI(_mine: mine) {
        this.UI = _mine;
    }

    public addEvent() {

    }

    public removeEvent() {

    }

    onClick(data: string) {
        switch (parseInt(data)) {
            case 0:
                console.log("点击了对应的事件" + data);
                {
                    PrefabXFactory.useSpecifyFactoryCreate("Script/module/playEdit", "edit.EditPlayDialogFactory", (oDialogNode) => {
                        if (null == oDialogNode) {
                            return;
                        }

                        this.UI.node.parent.parent.addChild(oDialogNode);
                    })
                }
                break;
        }
    }
}
