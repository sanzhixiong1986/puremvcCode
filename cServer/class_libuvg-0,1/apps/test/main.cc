#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <iostream>
#include <string>
using namespace std;

#include "../netbus/netbus.h";

int main(int argc, char** argv) {
	//����tcp�Ĳ���
	netbus::instance()->init();
	netbus::instance()->start_tcp_server(6080);
	netbus::instance()->start_ws_server(8001);

	netbus::instance()->run();
	
	system("pause");
	return 0;
}