#include <stdio.h>
#include <string.h>
#include <stdlib.h>


#include "../3rd/http_parser/http_parser.h"
#include "../3rd/crypto/sha1.h"
#include "../3rd/crypto/base64_encoder.h"

#include "uv.h"

struct ws_context {
	int is_shake_hand; // 是否已经握手
	char* data; // 读取数据的buf
};




static uv_loop_t* loop = NULL;
static uv_tcp_t l_server; // 监听句柄;

static void
uv_alloc_buf(uv_handle_t* handle,
size_t suggested_size,
uv_buf_t* buf) {

	struct ws_context* wc = handle->data;

	if (wc->data != NULL) {
		free(wc->data);
		wc->data = NULL;
	}

	buf->base = malloc(suggested_size + 1);
	buf->len = suggested_size;
	wc->data = buf->base;
}

static void
on_close(uv_handle_t* handle) {
	printf("close client\n");
	if (handle->data) {
		struct ws_context* wc = handle->data;
		free(wc->data);
		wc->data = NULL;
		free(wc);
		handle->data = NULL;
	}

	free(handle);
}

static void
on_shutdown(uv_shutdown_t* req, int status) {
	uv_close((uv_handle_t*)req->handle, on_close);
	free(req);
}

static void
after_write(uv_write_t* req, int status) {
	if (status == 0) {
		printf("write success\n");
	}
	uv_buf_t* w_buf = req->data;
	if (w_buf) {
		free(w_buf->base);
		free(w_buf);
	}

	free(req);
}

static void
send_data(uv_stream_t* stream, unsigned char* send_data, int send_len) {
	uv_write_t* w_req = malloc(sizeof(uv_write_t));
	uv_buf_t* w_buf = malloc(sizeof(uv_buf_t));

	unsigned char* send_buf = malloc(send_len);
	memcpy(send_buf, send_data, send_len);

	w_buf->base = send_buf;
	w_buf->len = send_len;
	w_req->data = w_buf;
	uv_write(w_req, stream, w_buf, 1, after_write);
}

static char filed_sec_key[512];
static char value_sec_key[512];
static int is_sec_key = 0;
static int has_sec_key = 0;

static int
on_ws_header_field(http_parser* p, const char *at, size_t length) {
	if (strncmp(at, "Sec-WebSocket-Key", length) == 0) {
		is_sec_key = 1;
	}
	else {
		is_sec_key = 0;
	}
	return 0;
}

static int
on_ws_header_value(http_parser* p, const char *at, size_t length) {
	if (!is_sec_key) {
		return 0;
	}

	strncpy(value_sec_key, at, length);
	value_sec_key[length] = 0;
	has_sec_key = 1;

	return 0;
}

// 
static char* wb_migic = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";
// base64(sha1(key + wb_migic))
static char *wb_accept = "HTTP/1.1 101 Switching Protocols\r\n"
"Upgrade:websocket\r\n"
"Connection: Upgrade\r\n"
"Sec-WebSocket-Accept: %s\r\n"
"WebSocket-Protocol:chat\r\n\r\n";


static void
ws_connect_shake_hand(uv_stream_t* stream, unsigned char* data, int data_len) {
	http_parser_settings settings;
	http_parser_settings_init(&settings);

	settings.on_header_field = on_ws_header_field;
	settings.on_header_value = on_ws_header_value;

	http_parser p;
	http_parser_init(&p, HTTP_REQUEST);
	is_sec_key = 0;
	has_sec_key = 0;
	http_parser_execute(&p, &settings, data, data_len);

	if (has_sec_key) { // 解析到了websocket里面的Sec-WebSocket-Key
		printf("Sec-WebSocket-Key: %s\n", value_sec_key);
		// key + migic
		static char key_migic[512];
		static char sha1_key_migic[SHA1_DIGEST_SIZE];
		static char send_client[512];

		int sha1_size;

		sprintf(key_migic, "%s%s", value_sec_key, wb_migic);
		crypt_sha1((unsigned char*)key_migic, strlen(key_migic), (unsigned char*)&sha1_key_migic, &sha1_size);
		int base64_len;
		char* base_buf = base64_encode(sha1_key_migic, sha1_size, &base64_len);
		sprintf(send_client, wb_accept, base_buf);
		base64_encode_free(base_buf);

		send_data(stream, (unsigned char*)send_client, strlen(send_client));
	}
}

static void
ws_send_data(uv_stream_t* stream, unsigned char* data, int len) {
	int head_size = 2;
	if (len > 125 && len < 65536) { // 两个字节[0, 65535]
		head_size += 2;
	}
	else if (len >= 65536) { // 不做处理
		head_size += 8;
	}

	unsigned char* data_buf = malloc(head_size + len);
	data_buf[0] = 0x81;
	if (len <= 125) {
		data_buf[1] = len;
	}
	else if (len > 125 && len < 65536) {
		data_buf[1] = 126;
		data_buf[2] = (len & 0x0000ff00) >> 8;
		data_buf[3] = (len & 0x000000ff);
	}
	else { // 127不写了

		return;
	}

	memcpy(data_buf + head_size, data, len);

	send_data(stream, data_buf, head_size + len);
	free(data_buf);
}

// 收到的是一个数据包;
static void
ws_on_recv_data(uv_stream_t* stream,
unsigned char* data, unsigned int len) {
	if (data[0] != 0x81 && data[0] != 0x82) {
		return;
	}

	unsigned int data_len = data[1] & 0x0000007f;
	int head_size = 2;
	if (data_len == 126) { // 后面两个字节表示的是数据长度;data[2], data[3]
		data_len = data[3] | (data[2] << 8);
		head_size += 2;
	}
	else if (data_len == 127) { // 后面8个字节表示数据长度; 2, 3, 4, 5 | 6, 7, 8, 9
		unsigned int low = data[5] | (data[4] << 8) | (data[3] << 16) | (data[2] << 24);
		unsigned int hight = data[9] | (data[8] << 8) | (data[7] << 16) | (data[6] << 24);

		data_len = low;
		head_size += 8;
	}

	unsigned char* mask = data + head_size;
	unsigned char* body = data + head_size + 4;

	for (unsigned int i = 0; i < data_len; i++) { // 遍历后面所有的数据;
		body[i] = body[i] ^ mask[i % 4];
	}

	// test
	static char test_buf[4096];
	memcpy(test_buf, body, data_len);
	test_buf[data_len] = 0;
	printf("%s\n", test_buf);

	// 发送协议
	ws_send_data(stream, "Hello", strlen("Hello"));
	// end 

}

static void after_read(uv_stream_t* stream,
	ssize_t nread,
	const uv_buf_t* buf) {
	// 连接断开了;
	if (nread < 0) {
		uv_shutdown_t* reg = malloc(sizeof(uv_shutdown_t));
		memset(reg, 0, sizeof(uv_shutdown_t));
		uv_shutdown(reg, stream, on_shutdown);
		return;
	}
	// end
	printf("start websocket!!!\n");
	struct ws_context* wc = stream->data;

	// 如果没有握手，就进入websocket握手协议
	if (wc->is_shake_hand == 0) {
		ws_connect_shake_hand(stream, buf->base, buf->len);
		wc->is_shake_hand = 1;
		return;
	}
	// end 

	// 如果客户端主动关闭;0x88, 状态码
	if ((unsigned char)(buf->base[0]) == 0x88) { // 关闭
		printf("ws closing!!!!");
		return;
	}
	// end 

	// ws正常的数据, 暂时不处理粘包这些问题;
	// 假设我们一次性都可以收完websocket发过来的数据包;
	ws_on_recv_data(stream, buf->base, nread);
	// end 

}

static void
uv_connection(uv_stream_t* server, int status) {
	printf("new client comming\n");

	uv_tcp_t* client = malloc(sizeof(uv_tcp_t));
	memset(client, 0, sizeof(uv_tcp_t));
	uv_tcp_init(loop, client);
	uv_accept(server, (uv_stream_t*)client);

	struct ws_context* wc = malloc(sizeof(struct ws_context));
	memset(wc, 0, sizeof(struct ws_context));
	client->data = wc;

	uv_read_start((uv_stream_t*)client, uv_alloc_buf, after_read);
}

int main(int argc, char** argv) {
	int ret;
	loop = uv_default_loop();

	uv_tcp_init(loop, &l_server);

	struct sockaddr_in addr;
	uv_ip4_addr("0.0.0.0", 8001, &addr); // ip地址, 端口
	ret = uv_tcp_bind(&l_server, (const struct sockaddr*) &addr, 0);
	if (ret != 0) {
		goto failed;
	}

	uv_listen((uv_stream_t*)&l_server, SOMAXCONN, uv_connection);

	uv_run(loop, UV_RUN_DEFAULT);

failed:
	printf("end\n");
	system("pause");
	return 0;
}