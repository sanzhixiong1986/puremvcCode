#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include "uv.h"

static uv_loop_t* loop = NULL;//对象
static uv_tcp_t l_server;

static void 
uv_alloc_buf(uv_handle_t* handle, size_t suggested_size, uv_buf_t* buf){
	//判断事件是否有数据
	if (handle->data != NULL){
		free(handle->data);
		handle->data = NULL;
	}
	//end

	buf->base = malloc(suggested_size + 1);
	buf->len = suggested_size;
	handle->data = buf->base;
}

//关闭服务器的相关操作
static void on_close(uv_handle_t* handle){
	printf("close client\n");//客户端关闭
	if (handle->data){
		free(handle->data);
		handle->data = NULL;
	}
}

//关闭
static void on_shutdown(uv_shutdown_t* req, int status){
	uv_close((uv_handle_t*)req->handle, on_close);//关闭回调的相关操作
	free(req);
}

//回写函数
static void after_write(uv_write_t* req, int statue){
	//判断发送的数据的状态
	if (statue == 0){
		printf("write success\n");
	}
	uv_buf_t* w_buf = req->data;//获得对应的数据
	if (w_buf){
		free(w_buf);
	}
	free(req);
}

//读取相关的数据
static void after_read(uv_stream_t* stream, ssize_t nread, const uv_buf_t* buf){
	//链接断开
	if (nread < 0){
		uv_shutdown_t* reg = malloc(sizeof(uv_shutdown_t));//创建shutdown的对象
		memset(reg, 0, sizeof(uv_shutdown_t));//给空间
		uv_shutdown(reg, stream, on_shutdown);//执行对应的方法
	}
	//end

	//读取数据
	buf->base[nread] = 0;
	printf("recv %d\n", nread);
	printf("%s\n", buf->base);

	//测试发送给客户端的操作
	uv_write_t* w_req = malloc(sizeof(uv_write_t));
	uv_buf_t* w_buf = malloc(sizeof(uv_buf_t));
	w_buf->base = buf->base;
	w_buf->len = nread;
	w_req->data = w_buf;
	uv_write(w_req, stream, w_buf, 1, after_write);
	//end
}

//链接相关
static void 
uv_connection(uv_stream_t* server, int status){
	printf("new client comming\n");
	//创建客户端的对象
	uv_tcp_t* client = malloc(sizeof(uv_tcp_t));
	memset(client, 0, sizeof(uv_tcp_t));
	//end
	//uv的tcp初始化
	uv_tcp_init(loop, client);
	uv_accept(server, (uv_stream_t*)client);//监听服务器
	//告诉loop让他帮你管理那个事件
	uv_read_start((uv_stream_t*)client, uv_alloc_buf, after_read);
}

int main(int argc, char** argv) {
	int ret;
	loop = uv_default_loop();
	//监听tcp
	uv_tcp_init(loop, &l_server);
	//服务器的地址
	struct sockaddr_in addr;
	uv_ip4_addr("0.0.0.0", 6080, &addr);
	//绑定对应的tcp端口
	ret = uv_tcp_bind(&l_server, (const struct sockaddr*) &addr, 0);
	if (ret != 0){
		goto failed;
	}

	uv_listen((uv_stream_t*)&l_server, SOMAXCONN, uv_connection);

	uv_run(loop, UV_RUN_DEFAULT);
failed:
	system("pause");
	return 0;
}

