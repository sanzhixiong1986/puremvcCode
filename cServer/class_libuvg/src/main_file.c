#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <fcntl.h>

#include "uv.h"

/*
uv_fs_open:
loop: �¼�ѭ��,
uv_fs_t req�������;
path: �ļ�·��
flags: ��־0
mode: �ɶ�����д... O_RDONLY O_RDWR...
*/
static uv_loop_t* event_loop = NULL;
static uv_fs_t req;
static uv_fs_t w_req;
static uv_file fs_handle;
static char mem_buffer[1024];
/*
uv_file
�ļ��������: ���ļ��Ժ���ļ�handle
uv_fs_t
result,ÿ������Ľ���������ֵ������;
���ļ�: result���ش��ļ��������uv_file;
���ļ�: result���������ݳ���;
д�ļ�: resultΪд������ݳ���;
*/

/*
�ͷŵ��������req��ռ����Դ
uv_req_cleanup(req);

*/

/*
stdin: ��ע�������ļ�, scanf, cin>>
stdout: ��׼������ļ� printf;
fprintf(stdout, "xxxxxxx");

ÿ�����������е�ʱ��:
stdin�ļ������stdout����ļ����ʼ���Ǵ򿪵�;
stdin:��׼�������ļ�,
stdout: ��׼�����;
*/

static void
after_read(uv_fs_t* req) {
	printf("read %d byte\n", req->result);
	mem_buffer[req->result] = 0; // �ַ�����β;
	printf("%s\n", mem_buffer);

	uv_fs_req_cleanup(req);

	uv_fs_close(event_loop, req, fs_handle, NULL);
	uv_fs_req_cleanup(req);
}

static void
on_open_fs_cb(uv_fs_t* req) {
	// ���ļ�
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

	// step1:���ļ�:
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

