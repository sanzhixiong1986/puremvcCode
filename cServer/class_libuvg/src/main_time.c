#include <stdio.h>
#include <string.h>
#include <stdlib.h>


#include "uv.h"

// 获取当前系统从开机到现在运行了多少毫秒;
#ifdef WIN32
#include <windows.h>
static unsigned int
get_cur_ms() {
	return GetTickCount();
}
#else
#include <sys/time.h>  
#include <time.h> 
#include <limits.h>

static unsigned int
get_cur_ms() {
	struct timeval tv;
	// struct timezone tz;
	gettimeofday(&tv, NULL);

	return ((tv.tv_usec / 1000) + tv.tv_sec * 1000);
}
#endif 


static uv_loop_t* event_loop = NULL;
/*

static uv_timer_t timer;

static void
on_uv_timer(uv_timer_t* handle) {
printf("timer called\n");
uv_timer_stop(handle); // 停止这个timer
}

// timeout: 第一运行的时候是隔多少时间运行;
// repeat: 后面每隔多少时间(毫秒)调用一次;
int main(int argc, char** argv) {
event_loop = uv_default_loop();
uv_timer_init(event_loop, &timer);
uv_timer_start(&timer, on_uv_timer, 5000, 1000);


uv_run(event_loop, UV_RUN_DEFAULT);
system("pause");
return 0;
}

*/

#include "time_list.h"

struct timer* t = NULL;
static void
on_time_func(void* udata) {
	static int count = 0;
	char* str = (udata);
	printf("%s\n", str);

	count++;
	if (count == 10) {
		cancel_timer(t);
	}
}

static void
on_time_func2(void* udata) {
	char* str = (udata);
	printf("%s\n", str);
}

int main_time(int argc, char** argv) {
	event_loop = uv_default_loop();

	// 每隔5秒掉一次，掉4次;
	t = schedule(on_time_func, "HelloWorld!!!", 1000, -1);

	// 
	schedule_once(on_time_func2, "CallFunc!!!", 1000);

	uv_run(event_loop, UV_RUN_DEFAULT);
	system("pause");
	return 0;
}