#include <stdio.h>
#include <string.h>
#include <stdlib.h>

#include <WinSock2.h>
#pragma comment(lib, "ws2_32.lib")

#pragma warning(disable:4996)

int main(int argc, char** argv) {
	WSADATA ws;
	WSAStartup(MAKEWORD(2, 2), &ws);

	SOCKET client = socket(AF_INET, SOCK_DGRAM, 0);
	// ����bindҲ���Բ���,�����Ҫ������ȷ�������Բ�bind;
	// end 
	SOCKADDR_IN addr;
	addr.sin_family = AF_INET;
	addr.sin_port = htons(6080);
	addr.sin_addr.S_un.S_addr = inet_addr("127.0.0.1");
	int len = sizeof(SOCKADDR_IN);

	int send_len = sendto(client, "Hello", 5, 0, (const SOCKADDR*)&addr, len);
	printf("send_len = %d\n", send_len);


	char buf[128];
	SOCKADDR_IN sender_addr; // �յ�˭�������ݰ��ĵ�ַ;
	int recv_len = recvfrom(client, buf, 128, 0, &sender_addr, &len);
	if (recv_len > 0) {
		buf[recv_len] = 0; // ���Ͻ�β����;
		printf("%s\n", buf);
	}


	WSACleanup();
	system("pause");
	return 0;
}