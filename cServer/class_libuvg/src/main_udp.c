#include <stdio.h>
#include <string.h>
#include <stdlib.h>

#include "uv.h"

static uv_loop_t* event_loop = NULL;
static uv_udp_t server; // UDP的句柄;

static void
uv_alloc_buf(uv_handle_t* handle,
size_t suggested_size,
uv_buf_t* buf) {
	if (handle->data != NULL) {
		free(handle->data);
		handle->data = NULL;
	}

	handle->data = malloc(suggested_size + 1); // +1测试的时候，我要收字符串，所以呢要加上1来访结尾符号;
	buf->base = handle->data;
	buf->len = suggested_size;
}

static void
on_uv_udp_send_end(uv_udp_send_t* req, int status) {
	if (status == 0) {
		printf("send sucess\n");
	}
	free(req);
}

static void
after_uv_udp_recv(uv_udp_t* handle,
ssize_t nread,
const uv_buf_t* buf,
const struct sockaddr* addr, // 发过来数据包的IP地址 + 端口;
unsigned flags) {
	char ip_addr[128];
	uv_ip4_name((struct sockaddr_in*)addr, ip_addr, 128);
	int port = ntohs(((struct sockaddr_in*)addr)->sin_port);
	printf("ip: %s:%d nread = %d\n", ip_addr, port, nread);

	char* str_buf = handle->data;
	str_buf[nread] = 0;
	printf("recv %s\n", str_buf);

	uv_buf_t w_buf;
	w_buf = uv_buf_init("PING", 4);
	// 写数据;
	uv_udp_send_t* req = malloc(sizeof(uv_udp_send_t));
	uv_udp_send(req, handle, &w_buf, 1, addr, on_uv_udp_send_end);
	// end 
}

int main_udp(int argc, char** argv) {
	event_loop = uv_default_loop();
	memset(&server, 0, sizeof(uv_udp_t));

	uv_udp_init(event_loop, &server);
	// bind端口;
	struct sockaddr_in addr;
	uv_ip4_addr("0.0.0.0", 6080, &addr);
	uv_udp_bind(&server, (const struct sockaddr*)&addr, 0);
	// end 

	// 告诉事件循环,你要他管理recv事件;
	uv_udp_recv_start(&server, uv_alloc_buf, after_uv_udp_recv);

	uv_run(event_loop, UV_RUN_DEFAULT);
	system("pause");
	return 0;
}