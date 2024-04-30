#include <stdio.h>
#include <string.h>
#include <stdlib.h>

#include "uv.h"
#include "../3rd/http_parser/http_parser.h"

/*
url ע�����ģ��
*/

typedef void(*web_get_handle)(uv_stream_t* stream, char* url);
typedef void(*web_post_handle)(uv_stream_t* stream, char* url, char* body);

struct url_node {
	char* url; // url��ַ
	web_get_handle get; // url��ַ��Ӧ�Ĵ�����;
	web_post_handle post; // url��ַ��Ӧ��post����
};

static struct url_node*
alloc_url_node(char* url, web_get_handle get, web_post_handle post) {
	struct url_node* node = malloc(sizeof(struct url_node));
	memset(node, 0, sizeof(struct url_node));
	node->url = strdup(url);

	node->get = get;
	node->post = post;

	return node;
}

static struct url_node* url_node[1024];
static int url_count = 0;

static void
register_web_handle(char* url, web_get_handle get, web_post_handle post) {
	url_node[url_count] = alloc_url_node(url, get, post);
	url_count++;
}

static struct url_node*
get_url_node(char* url, int len) {
	for (int i = 0; i < url_count; i++) {
		if (strncmp(url, url_node[i]->url, len) == 0) {
			return url_node[i];
		}
	}
	return NULL;
}


/*
{
[100] = "Continue",
[101] = "Switching Protocols",
[200] = "OK",
[201] = "Created",
[202] = "Accepted",
[203] = "Non-Authoritative Information",
[204] = "No Content",
[205] = "Reset Content",
[206] = "Partial Content",
[300] = "Multiple Choices",
[301] = "Moved Permanently",
[302] = "Found",
[303] = "See Other",
[304] = "Not Modified",
[305] = "Use Proxy",
[307] = "Temporary Redirect",
[400] = "Bad Request",
[401] = "Unauthorized",
[402] = "Payment Required",
[403] = "Forbidden",
[404] = "Not Found",
[405] = "Method Not Allowed",
[406] = "Not Acceptable",
[407] = "Proxy Authentication Required",
[408] = "Request Time-out",
[409] = "Conflict",
[410] = "Gone",
[411] = "Length Required",
[412] = "Precondition Failed",
[413] = "Request Entity Too Large",
[414] = "Request-URI Too Large",
[415] = "Unsupported Media Type",
[416] = "Requested range not satisfiable",
[417] = "Expectation Failed",
[500] = "Internal Server Error",
[501] = "Not Implemented",
[502] = "Bad Gateway",
[503] = "Service Unavailable",
[504] = "Gateway Time-out",
[505] = "HTTP Version not supported",
}
*/

/*
uv_handle_s ���ݽṹ:
UV_HANDLE_FIELDS

uv_stream_t  ���ݽṹ;
UV_HANDLE_FIELDS
UV_STREAM_FIELDS

uv_tcp_t ���ݽṹ;
UV_HANDLE_FIELDS
UV_STREAM_FIELDS
UV_TCP_PRIVATE_FIELDS

uv_tcp_t is uv_stream_t is uv_handle_t;
*/

static uv_loop_t* loop = NULL;
static uv_tcp_t l_server; // �������;

// �����ǵ�event loop�쳵��handle�������ݿ��Զ���ʱ��,
// �ͻ�����������, �����������event loop׼���ö������ݵ��ڴ�;
// event loop֪���ж�������,suggested_size,
// handle: ������ʱ���handle;
// suggested_size: �������Ƿ�������ڴ��������������;
// uv_buf_t: ����׼���õ��ڴ棬ͨ��uv_buf_t,����even loop;
static void
uv_alloc_buf(uv_handle_t* handle,
size_t suggested_size,
uv_buf_t* buf) {

	if (handle->data != NULL) {
		free(handle->data);
		handle->data = NULL;
	}

	buf->base = malloc(suggested_size + 1);
	buf->len = suggested_size;
	handle->data = buf->base;
}

static void
on_close(uv_handle_t* handle) {
	printf("close client\n");
	if (handle->data) {
		free(handle->data);
		handle->data = NULL;
	}
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

static char req_url[4096];
int on_url(http_parser* p, const char *at, size_t length) {
	strncpy(req_url, at, length);

	req_url[length] = 0;
	return 0;
}

static int
filter_url(char* url) {
	char* walk = url;
	int len = 0;
	while (*url != '?' && *url != '\0') {
		len++;
		url++;
	}

	return len;
}

static void
on_http_request(uv_stream_t* stream, char* req, int len) {
	http_parser_settings settings;
	http_parser_settings_init(&settings);
	settings.on_url = on_url;
	http_parser p;
	http_parser_init(&p, HTTP_REQUEST);
	http_parser_execute(&p, &settings, req, len);

	// http get�ǿ���Я��������:
	// http://www.baidu.com:6080/test?name=blake&age=34
	int url_len = filter_url(req_url);
	struct url_node* node = get_url_node(req_url, url_len);
	printf("%s\n", req_url);

	if (node == NULL) {
		return;
	}

	switch (p.method) { // ���󷽷�
	case HTTP_GET:
		if (node->get != NULL) {
			node->get(stream, req_url);
		}
		break;
	case HTTP_POST:
		if (node->post != NULL) {
		}
		break;
	}
}
// ����: 
// uv_stream_t* handle --> uv_tcp_t;
// nread: �����˶����ֽڵ�����;
// uv_buf_t: ���ǵ����ݶ����������ĸ�buf����, base;
static void after_read(uv_stream_t* stream,
	ssize_t nread,
	const uv_buf_t* buf) {
	// ���ӶϿ���;
	if (nread < 0) {
		uv_shutdown_t* reg = malloc(sizeof(uv_shutdown_t));
		memset(reg, 0, sizeof(uv_shutdown_t));
		uv_shutdown(reg, stream, on_shutdown);
		return;
	}
	// end

	buf->base[nread] = 0;
	printf("recv %d\n", nread);
	printf("%s\n", buf->base);

	// ����
	on_http_request(stream, buf->base, buf->len);
	// end
}

static void
uv_connection(uv_stream_t* server, int status) {
	printf("new client comming\n");
	// ����ͻ���;
	uv_tcp_t* client = malloc(sizeof(uv_tcp_t));
	memset(client, 0, sizeof(uv_tcp_t));
	uv_tcp_init(loop, client);
	uv_accept(server, (uv_stream_t*)client);
	// end

	// ����event loop,������������ĸ��¼�;
	uv_read_start((uv_stream_t*)client, uv_alloc_buf, after_read);
}

static void
test_get(uv_stream_t* stream, char* url) {
	printf("%s\n", url);
	char* body = "SUCCESS TEST1";

	static char respons_buf[4096];
	char* walk = respons_buf;
	sprintf(walk, "HTTP/1.1 %d %s\r\n", 200, "OK");
	walk += strlen(walk);
	sprintf(walk, "transfer-encoding:%s\r\n", "identity");
	walk += strlen(walk);
	sprintf(walk, "content-length: %d\r\n\r\n", strlen(body));
	walk += strlen(walk);

	sprintf(walk, "%s", body);

	send_data(stream, respons_buf, strlen(respons_buf));
}

static void
test2_get(uv_stream_t* stream, char* url) {
	printf("%s\n", url);
	char* body = "SUCCESS TEST2";

	static char respons_buf[4096];
	char* walk = respons_buf;
	sprintf(walk, "HTTP/1.1 %d %s\r\n", 200, "OK");
	walk += strlen(walk);
	sprintf(walk, "transfer-encoding:%s\r\n", "identity");
	walk += strlen(walk);
	sprintf(walk, "content-length: %d\r\n\r\n", strlen(body));
	walk += strlen(walk);

	sprintf(walk, "%s", body);

	send_data(stream, respons_buf, strlen(respons_buf));
}

int main(int argc, char** argv) {
	// ע��һ��web������
	register_web_handle("/test", test_get, NULL);
	register_web_handle("/test2", test2_get, NULL);
	// end 

	int ret;
	loop = uv_default_loop();
	// Tcp ��������;
	uv_tcp_init(loop, &l_server); // ��l_server����������뵽event loop����;
	// ����Ҫevent loop�����������ֹ����أ�������Ҫ�Ĺ�������;
	struct sockaddr_in addr;
	uv_ip4_addr("0.0.0.0", 6080, &addr); // ip��ַ, �˿�
	ret = uv_tcp_bind(&l_server, (const struct sockaddr*) &addr, 0);
	if (ret != 0) {
		goto failed;
	}
	// ��event loop�����������������ǵ�l_server������������ӵ�ʱ��;
	// event loop�ͻ�����û�ָ�������������uv_connection;
	uv_listen((uv_stream_t*)&l_server, SOMAXCONN, uv_connection);

	uv_run(loop, UV_RUN_DEFAULT);

failed:
	printf("end\n");
	system("pause");
	return 0;
}

