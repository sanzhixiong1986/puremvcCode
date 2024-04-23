// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;
/**
 * 倒计时的驱动
 */
@ccclass
export default class ActionTime extends cc.Component {

    @property
    total_time: number = 10;//默认倒计时的时间

    //是否已经在跑的动作
    private is_running: boolean = false;
    //全局sp
    private sprite: cc.Sprite = null;
    //当前时间
    private now_time = 0;

    onLoad() {
        this.is_running = false;
        this.sprite = this.node.getComponent(cc.Sprite)
    }

    /**
     * 计时器开始
     * @param time 
     */
    startActionTime(time: number) {
        this.total_time = time;
        this.is_running = true;
        this.now_time = 0;
        this.node.active = true;
    }

    update(dt) {
        //判断有没有启动
        if (this.is_running === false) {
            return;
        }

        this.now_time += dt;
        let per = this.now_time / this.total_time;
        if (per > 1) {
            per = 1;
        }
        this.sprite.fillRange = per;
        //当前时间大于总时间就是超时,停止运行
        if (this.now_time >= this.total_time) {
            this.is_running = false;
            this.node.active = false;
        }
    }
}
