#include <stdio.h>
#include <string.h>
#include <stdlib.h>

#include "./../3rd/http_parser/http_parser.h"

/*
GET /favicon.ico HTTP/1.1
Host: 0.0.0.0=5000
User-Agent: Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.9) Gecko/2008061015 Firefox/3.0
Accept-Language: en-us,en;q=0.5
Connection: keep-alive

// Ω· ¯
*/
static char* http_get_req = "GET /favicon.ico HTTP/1.1\r\n"
"Host: 0.0.0.0=5000\r\n"
"User-Agent: Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.9) Gecko/2008061015 Firefox/3.0\r\n"
"Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8\r\n"
"Accept-Language: en-us,en;q=0.5\r\n"
"Accept-Encoding: gzip,deflate\r\n"
"Accept-Charset: ISO-8859-1,utf-8;q=0.7,*;q=0.7\r\n"
"Keep-Alive: 300\r\n"
"Connection: keep-alive\r\n"
"\r\n";

static char * http_post_req = "POST /post_identity_body_world?q=search#hey HTTP/1.1\r\n"
"Accept: */*\r\n"
"Transfer-Encoding: identity\r\n"
"Content-Length: 14\r\n"
"\r\n"
"HelloWorld!!!!";

static char* http_get_respones = "HTTP/1.1 200 OK\r\n"
"Date: Sat, 31 Dec 2005 23:59:59 GMT\r\n"
"Content-Type: text/html;charset=ISO-8859-1\r\n"
"Content-Length: 122\r\n"
"\r\n"
"<html>\r\n"
"<head>\r\n"
"<title>Wrox Homepage</title>\r\n"
"</head>\r\n"
"<body>\r\n"
"<!--body goes here -->\r\n"
"</body>\r\n"
"</html>\r\n";

static int
on_message_begin(http_parser* p) {
	printf("on_message_begin\n");
	return 0;
}

static int
on_message_complete(http_parser* p) {
	printf("on_message_complete\n");
	return 0;
}

static int
on_headers_complete(http_parser* p) {
	printf("on_headers_complete\n");
	return 0;
}

static int
on_url(http_parser*p, const char *at, size_t length) {
	static char url_buf[1024];
	strncpy(url_buf, at, length);
	url_buf[length] = 0;
	printf("%s\n", url_buf);

	return 0;
}

static int
on_header_filed(http_parser*p, const char *at, size_t length) {
	static char filed[1024];
	strncpy(filed, at, length);
	filed[length] = 0;
	printf("%s\n", filed);

	return 0;
}

static int
on_header_value(http_parser*p, const char *at, size_t length) {
	static char value[1024];
	strncpy(value, at, length);
	value[length] = 0;
	printf("%s\n", value);

	return 0;
}

static int
on_body(http_parser*p, const char *at, size_t length) {
	static char body[4096];
	strncpy(body, at, length);
	body[length] = 0;
	printf("body: %s\n", body);

	return 0;
}

static int
on_status(http_parser*p, const char *at, size_t length) {
	static char status[1024];
	strncpy(status, at, length);
	status[length] = 0;
	printf("status: %s\n", status);

	return 0;
}

// ≈‰÷√ªÿµÙ∫Ø ˝;
static http_parser_settings settings = {
	.on_message_begin = on_message_begin,
	.on_message_complete = on_message_complete,

	.on_url = on_url,

	.on_header_field = on_header_filed,
	.on_header_value = on_header_value,
	.on_headers_complete = on_headers_complete,

	.on_body = on_body,
	.on_status = on_status,
};

static http_parser parser;
// end 
int main_http(int argc, char** argv) {
	http_parser_init(&parser, HTTP_REQUEST);

	http_parser_execute(&parser, &settings, http_get_req, strlen(http_get_req));

	http_parser_execute(&parser, &settings, http_post_req, strlen(http_post_req));

	http_parser_init(&parser, HTTP_RESPONSE);
	http_parser_execute(&parser, &settings, http_get_respones, strlen(http_get_respones));

	system("pause");
	return 0;
}