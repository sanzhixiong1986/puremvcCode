import DataMediator from "../DataMediator";


//ui
let text: cc.Label = null;
let btn: cc.Button = null;
//end
let selfs: DataMediator = null;
/**
 * UI对象的数据
 * @param self 
 * @param root 
 */
export function regUiEvent(self: DataMediator, root: cc.Node) {
    selfs = self;
    text = root.getChildByName("lable").getComponent(cc.Label);
    btn = root.getChildByName("addNum").getComponent(cc.Button);
    btn.node.on('click', clickCallBack, this);
}

//事件
function clickCallBack() {
    //发送事件
    selfs.sendNotification("Reg_StartDataCommand");
}

//更新的方法
export function updateUI(num: number) {
    text.string = num + "";
}

