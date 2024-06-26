#ifndef __MY_TIMER_LIST_H__
#define __MY_TIMER_LIST_H__

// on_timer是一个回掉函数,当timer触发的时候调用;
// udata: 是用户传的自定义的数据结构;
// on_timer执行的时候 udata,就是你这个udata;
// after_sec: 多少秒开始执行;
// repeat_count: 执行多少次, repeat_count == -1一直执行;
// 返回timer的句柄;
struct timer;
struct timer*
	schedule(void(*on_timer)(void* udata),
	void* udata,
	int after_msec,
	int repeat_count);


// 取消掉这个timer;
void
cancel_timer(struct timer* t);

struct timer*
	schedule_once(void(*on_timer)(void* udata),
	void* udata,
	int after_msec);
#endif