#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <fcntl.h>

#include "uv.h"

/*
uv_fs_open:
loop: 事件循环,
uv_fs_t req请求对象;
path: 文件路径
flags: 标志0
mode: 可读，可写... O_RDONLY O_RDWR...
*/
static uv_loop_t* event_loop = NULL;
static uv_fs_t req;
static uv_fs_t w_req;
static uv_file fs_handle;
static char mem_buffer[1024];
/*
uv_file
文件句柄对象: 打开文件以后的文件handle
uv_fs_t
result,每次请求的结果都是这个值来返回;
打开文件: result返回打开文件句柄对象uv_file;
读文件: result读到的数据长度;
写文件: result为写入的数据长度;
*/

/*
释放掉这个请求req所占的资源
uv_req_cleanup(req);

*/

/*
stdin: 标注的输入文件, scanf, cin>>
stdout: 标准的输出文件 printf;
fprintf(stdout, "xxxxxxx");

每个进程在运行的时候:
stdin文件句柄与stdout这个文件句柄始终是打开的;
stdin:标准的输入文件,
stdout: 标准的输出;
*/

static void
after_read(uv_fs_t* req) {
	printf("read %d byte\n", req->result);
	mem_buffer[req->result] = 0; // 字符串结尾;
	printf("%s\n", mem_buffer);

	uv_fs_req_cleanup(req);

	uv_fs_close(event_loop, req, fs_handle, NULL);
	uv_fs_req_cleanup(req);
}

static void
on_open_fs_cb(uv_fs_t* req) {
	// 打开文件
	fs_handle = req->result;
	uv_fs_req_cleanup(req);
	printf("open success end\n");



	uv_buf_t buf = uv_buf_init(mem_buffer, 1024);
	uv_fs_read(event_loop, req,
		fs_handle, &buf, 1, 0,
		after_read);
}

int main_file(int argc, char** argv) {
	event_loop = uv_default_loop();

	// step1:打开文件:
	uv_fs_open(event_loop, &req,
		"test.txt", 0,
		O_RDONLY, on_open_fs_cb);




	uv_buf_t w_buf = uv_buf_init("Good! BYCW!!!!", 12);
	uv_fs_write(event_loop, &w_req, (uv_file)1, &w_buf, 1, 0, NULL);
	uv_fs_req_cleanup(&w_req);

	uv_run(event_loop, UV_RUN_DEFAULT);
	system("pause");
	return 0;
}

