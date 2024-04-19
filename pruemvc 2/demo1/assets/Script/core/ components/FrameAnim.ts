// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;
/**
 * 序列帧动画
 */
@ccclass
export default class FrameAnim extends cc.Component {

    @property([cc.SpriteFrame])
    sprite_frames: cc.SpriteFrame[] = [];//序列帧图片

    private duration: number = 0.1;  //间隔时间
    private loop: boolean = false;   //是否循环
    private play_onload: boolean = false;//是否在嘴贱加载的时候播放
    private sprite: cc.Sprite = null;
    private is_playing: boolean = false; //是否播放
    private play_time: number = 0;
    private is_loop: boolean = false;
    private end_func = null;
    onLoad() {
        let s_con = this.node.getComponent(cc.Sprite);
        if (!s_con) {
            s_con = this.node.addComponent(cc.Sprite);
        }
        this.sprite = s_con;

        this.is_playing = false;
        this.play_time = 0;
        this.is_loop = false;
        this.end_func = null;

        if (this.sprite_frames.length > 0) {
            this.sprite.spriteFrame = this.sprite_frames[0];
        }

        if (this.play_onload) {
            if (!this.loop) {
                this.play_once(null);
            } else {
                this.play_loop();
            }
        }
    }

    /**
     * 播放一次
     * @param end_func 
     */
    play_once(end_func) {
        this.play_time = 0;
        this.is_playing = true;
        this.is_loop = false;
        this.end_func = end_func;
    }

    /**
     * 循环播放
     */
    play_loop() {
        this.play_time = 0;
        this.is_playing = true;
        this.is_loop = false;
    }

    /**
     * 更新时间播放操作
     * @param dt 
     * @returns 
     */
    update(dt: number): void {
        if (this.is_playing === false) { // 没有启动播放，不做处理
            return;
        }

        this.play_time += dt; // 累积我们播放的时间;

        // 计算时间，应当播放第几帧，而不是随便的下一帧，
        // 否则的话，同样的动画1, 60帧，你在30FPS的机器上你会播放2秒，
        // 你在60FPS的机器上你会播放1秒，动画就不同步;

        var index = Math.floor(this.play_time / this.duration); // 向下取整数
        // index
        if (this.is_loop === false) { // 播放一次
            if (index >= this.sprite_frames.length) { // 非循环播放结束
                // 精灵显示的是最后一帧;
                this.sprite.spriteFrame = this.sprite_frames[this.sprite_frames.length - 1];
                // end 
                this.is_playing = false;
                this.play_time = 0;
                if (this.end_func) { // 调用回掉函数
                    this.end_func();
                }
                return;
            }
            else {
                this.sprite.spriteFrame = this.sprite_frames[index];
            }
        }
        else { // 循环播放;

            while (index >= this.sprite_frames.length) {
                index -= this.sprite_frames.length;
                this.play_time -= (this.duration * this.sprite_frames.length);
            }

            //  在合法的范围之内
            this.sprite.spriteFrame = this.sprite_frames[index];
            // end 
        }
    }
}