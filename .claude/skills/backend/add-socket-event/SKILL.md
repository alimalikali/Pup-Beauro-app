---
name: add-socket-event
description: Add a Socket.io event handler to ChatGateway (or a new gateway) in api/. Always JWT-checks, mutates via service, broadcasts to room. Use when the user asks to "add socket event", "new realtime event", "wire chat event".
argument-hint: [event-name]
allowed-tools: Read, Write, Edit, Bash(ls *), Bash(grep *)
paths: api/**
---

# Add Socket.io event: $ARGUMENTS

Add to `api/src/chat/chat.gateway.ts` (or a new gateway in the relevant feature folder if `$ARGUMENTS` isn't chat-related).

## Handler template

```typescript
@SubscribeMessage('$ARGUMENTS')
async handle$ARGUMENTS(
  @MessageBody() data: { /* shape */ },
  @ConnectedSocket() client: Socket,
) {
  const userId = client.data.userId;
  if (!userId) throw new WsException('Unauthorized');

  // Mutate via injected service, NOT the repository directly
  const result = await this.someService.doSomething(userId, data);

  // Broadcast to room (or direct emit)
  this.server.to(roomId).emit('$ARGUMENTS_downstream', result);
}
```

## Rules

- **Auth check**: ALWAYS read `client.data.userId` set in `handleConnection`. Throw `WsException('Unauthorized')` if absent — never silently allow.
- **Errors**: `WsException` only (HTTP exceptions are wrong layer at the WS boundary).
- **Mutations**: go through services, never `this.repo.save(...)` directly in the gateway.
- **Broadcast scope**: use `this.server.to(roomId).emit(...)` — never `client.broadcast.to(...)` for chat-style events because it excludes the sender (use server-side broadcast so the sender sees the canonical message ordering).
- **Event naming**: lowercase snake_case (`new_message`, `user_typing`) to match existing convention.

## Mirror on the mobile side

In the same PR (or by dispatching `contract-sync-agent`), update:
- `app/src/services/socket.ts` — add an emit helper if outbound, add an `on` listener helper if inbound
- The screen that consumes the event (typically `ChatScreen`) — `useEffect` registration + cleanup

## Verify

- Restart backend; tail logs while triggering the event from the mobile client or `wscat`
- Confirm the event reaches the gateway with `client.data.userId` populated (log it once during development)
- Confirm the broadcast reaches the right room — no leakage to other conversations
