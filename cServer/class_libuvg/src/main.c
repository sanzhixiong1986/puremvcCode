#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include <WinSock2.h>

#pragma comment(lib, "ws2_32.lib")
int main(int argc, char** argv) {
	//wsa
	WSADATA ws;
	WSAStartup(MAKEWORD(2, 2), &ws);
	//end

	//1.申请一个socket
	SOCKET svr = socket(AF_INET, SOCK_DGRAM, 0);
	//udp,ip.端口，bind
	SOCKADDR_IN addr;
	addr.sin_family = AF_INET;
	addr.sin_port = htons(6080);
	addr.sin_addr.S_un.S_addr = inet_addr("127.0.0.1");
	int len = sizeof(addr);
	bind(svr, (SOCKADDR*)&addr, len);
	//end

	//收数据
	char buf[128];//给内存
	SOCKADDR_IN client;
	int recv_len = recvfrom(svr, buf, 128, 0, (SOCKADDR*)&client, &len);
	printf("recv_len = %d\n", recv_len);
	buf[recv_len] = 0;
	printf("recv: %s\n", buf);
	//end

	//发送数据
	int sended = sendto(svr, buf, recv_len, 0, (const SOCKADDR*)&client, len);
	printf("send data %d\n", sended);

	closesocket(svr);
	WSACleanup();
	system("pause");
	return 0;
}