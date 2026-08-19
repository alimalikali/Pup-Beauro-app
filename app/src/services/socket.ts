import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.EXPO_PUBLIC_SOCKET_URL || 'http://localhost:5000';

let socket: Socket | null = null;

export function connectSocket(token: string) {
  if (socket?.connected) return socket;

  socket = io(`${SOCKET_URL}/chat`, {
    auth: { token },
    transports: ['websocket'],
    reconnectionAttempts: 5,
  });

  socket.on('connect', () => console.log('[socket] connected'));
  socket.on('disconnect', () => console.log('[socket] disconnected'));

  return socket;
}

export function disconnectSocket() {
  socket?.disconnect();
  socket = null;
}

export function getSocket() {
  return socket;
}

export function joinConversation(conversationId: string) {
  socket?.emit('join_conversation', { conversationId });
}

export function sendSocketMessage(conversationId: string, content: string) {
  return new Promise((resolve) => {
    socket?.emit('send_message', { conversationId, content }, resolve);
  });
}

export function emitTyping(conversationId: string) {
  socket?.emit('typing', { conversationId });
}

export function emitStopTyping(conversationId: string) {
  socket?.emit('stop_typing', { conversationId });
}
