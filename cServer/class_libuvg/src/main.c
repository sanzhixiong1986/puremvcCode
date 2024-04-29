#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include "uv.h"

#pragma comment(lib,"Name.lib")

static uv_loop_t* loop = NULL;//����
static uv_tcp_t l_server;

//�������
static void 
uv_connection(uv_stream_t* server, int status){
	printf("new client comming\n");
	//����ͻ���

}

int main(int argc, char** argv) {
	int ret;
	loop = uv_default_loop();
	//����tcp
	uv_tcp_init(loop, &l_server);
	//�������ĵ�ַ
	struct sockaddr_in addr;
	uv_ip4_addr("0.0.0.0", 6080, &addr);
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

