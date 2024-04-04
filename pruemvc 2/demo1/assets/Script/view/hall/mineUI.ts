import Model from "../../core/ components/Model";
import PrefabXFactory from "../../core/ components/PrefabXFactory";
import mine from "./mine";

/**
 * mine用户ui操作
 */
export default class mineUI {
    private UI: mine = null;
    public addUI(_mine: mine) {
        this.UI = _mine;

        let guest_up = _mine.node.getChildByName("guest").getComponent(cc.Button);
        let model = Model.getIntance().getUserBase();
        if (model && model.is_guest == 0 && model.uname == '\"\"') {
            guest_up.node.active = true;
        } else {
            guest_up.node.active = false;
        }

        guest_up.node.on("click", this.Alert, this);
    }

    private Alert(): void {
        PrefabXFactory.useSpecifyFactoryCreate("Script/module/guestUp", "guest.GuestPanelDialogFactory", (oDialogNode) => {
            if (null == oDialogNode) {
                return;
            }

            this.UI.node.parent.parent.addChild(oDialogNode);
        })
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
