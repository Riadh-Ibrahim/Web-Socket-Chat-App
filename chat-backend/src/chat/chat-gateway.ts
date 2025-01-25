import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Socket, Server } from 'socket.io'

@WebSocketGateway(3002, {cors: {origin: '*'}})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect{
    @WebSocketServer() server: Server 

    handleConnection(client: Socket) {
        client.broadcast.emit('user-joined', {
            message: `User joined the chat: ${client.id}`,
        });
    }

    handleDisconnect(client: Socket) {
        this.server.emit('user-left', {
            message: `User left the chat: ${client.id}`,
        });
    }

    @SubscribeMessage('newMessage')
    handleNewMessage(@MessageBody() message: any){    
        this.server.emit('message', message)
    }
    
}
