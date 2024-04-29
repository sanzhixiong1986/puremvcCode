#include <stdio.h>
#include <string.h>
#include <stdlib.h>

#include "../3rd/crypto/base64_encoder.h"
#include "../3rd/crypto/base64_decoder.h"
#include "../3rd/crypto/md5.h"
#include "../3rd/crypto/sha1.h"

int main_base64(int argc, char** argv) {
	int encode_len;
	char* base64_buf = NULL;

	base64_buf = base64_encode("Hello", 5, &encode_len);
	printf("%s\n", base64_buf);

	char* decode_buf = NULL;
	int decode_len;
	decode_buf = base64_decode(base64_buf, encode_len, &decode_len);
	printf("decode base64 %s\n", decode_buf);

	base64_decode_free(decode_buf);
	base64_encode_free(base64_buf);

	// md5,二进制数据--> 固定长度的二进制;
	unsigned char md5_buf[MD5_HASHSIZE];
	md5("user_password", strlen("user_password"), md5_buf);
	// 16个字节的二进制数据;32文本;66 32 8d 07 96 67 e8 24 86 e6 63 32 54 99 49 89
	// 大写,小写;
	for (int i = 0; i < MD5_HASHSIZE; i++) {
		printf("%x", md5_buf[i]);
	}
	printf("\n");
	// end

	// SHA1
	unsigned char sha1_buf[128];
	int e_sz;
	crypt_sha1("user_password", strlen("user_password"), sha1_buf, &e_sz);
	for (int i = 0; i < e_sz; i++) {
		printf("%x", sha1_buf[i]);
	}
	printf("\n");
	// end 

	system("pause");
	return 0;
}