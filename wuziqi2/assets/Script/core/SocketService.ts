import { io, Socket } from 'socket.io-client';
export default class SocketService {
    private socket: Socket = null;

    connoect(url: string): void {
        this.socket = io(url);
        this.socket.on('connect', () => {
            console.log('Connected to the socket server');
            this.sendMessage("hellworld");
        });

        this.socket.on('welcome', (data: any) => {
            console.log('Received welcome message:', data);
        });

        this.socket.on('disconnect', () => {
            console.log('Disconnected from the socket server');
        });
    }

    // 发送消息
    public sendMessage(msg: any): void {
        this.socket.emit('message', msg);
    }

    // 断开连接
    public disconnect(): void {
        if (this.socket) {
            this.socket.disconnect();
        }
    }
}
