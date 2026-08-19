import {
  WebSocketGateway, WebSocketServer, SubscribeMessage,
  MessageBody, ConnectedSocket, OnGatewayConnection,
  OnGatewayDisconnect, OnGatewayInit,
} from '@nestjs/websockets';
import { WsException } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ChatService } from './chat.service';

@WebSocketGateway({ cors: { origin: '*' }, namespace: '/chat' })
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  private userSockets = new Map<string, string>();

  constructor(private chat: ChatService, private jwt: JwtService) {}

  afterInit(server: Server) {
    server.use((socket: Socket, next: (err?: Error) => void) => {
      try {
        const token = socket.handshake.auth?.token as string;
        if (!token) return next(new Error('Unauthorized'));
        const payload = this.jwt.verify(token);
        socket.data.userId = payload.sub;
        next();
      } catch {
        next(new Error('Unauthorized'));
      }
    });
  }

  handleConnection(socket: Socket) {
    const userId = socket.data.userId as string | undefined;
    if (!userId) {
      socket.disconnect(true);
      return;
    }
    this.userSockets.set(userId, socket.id);
  }

  handleDisconnect(socket: Socket) {
    if (socket.data.userId) this.userSockets.delete(socket.data.userId);
  }

  private requireUser(socket: Socket): string {
    const userId = socket.data.userId as string | undefined;
    if (!userId) throw new WsException('Unauthorized');
    return userId;
  }

  @SubscribeMessage('join_conversation')
  async joinConversation(
    @MessageBody() data: { conversationId: string },
    @ConnectedSocket() socket: Socket,
  ) {
    const userId = this.requireUser(socket);
    socket.join(data.conversationId);
    await this.chat.markRead(data.conversationId, userId);
    return { joined: data.conversationId };
  }

  @SubscribeMessage('send_message')
  async sendMessage(
    @MessageBody() data: { conversationId: string; content: string },
    @ConnectedSocket() socket: Socket,
  ) {
    const userId = this.requireUser(socket);
    const msg = await this.chat.saveMessage(
      data.conversationId, userId, data.content,
    );
    this.server.to(data.conversationId).emit('new_message', msg);
    return msg;
  }

  @SubscribeMessage('typing')
  handleTyping(
    @MessageBody() data: { conversationId: string },
    @ConnectedSocket() socket: Socket,
  ) {
    const userId = this.requireUser(socket);
    socket.to(data.conversationId).emit('user_typing', { userId });
  }

  @SubscribeMessage('stop_typing')
  handleStopTyping(
    @MessageBody() data: { conversationId: string },
    @ConnectedSocket() socket: Socket,
  ) {
    const userId = this.requireUser(socket);
    socket.to(data.conversationId).emit('user_stop_typing', { userId });
  }

  emitMatchNotification(userId: string, match: unknown) {
    const socketId = this.userSockets.get(userId);
    if (socketId) this.server.to(socketId).emit('match_notification', match);
  }
}
