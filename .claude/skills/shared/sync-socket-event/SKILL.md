---
name: sync-socket-event
description: After a Socket.io event in api/src/chat/chat.gateway.ts changes (renamed, payload changed, added, removed), mirror the event in app/src/services/socket.ts and the consuming screen listeners. Use when a backend gateway change just landed.
argument-hint: [event-name]
allowed-tools: Read, Edit, Grep, Glob
---

# Sync socket event: $ARGUMENTS

Event names are case-sensitive strings. Both sides must match exactly or the event silently doesn't fire.

## 1. Confirm the backend change

Read `api/src/chat/chat.gateway.ts` (or the new gateway). For each changed event, note:
- Event name (e.g., `new_message`, `user_typing`)
- Payload shape (request body)
- Response/broadcast event name + payload (if the handler emits something downstream)
- Whether direction is C→S (`@SubscribeMessage`) or S→C (`this.server.to(...).emit(...)`)

## 2. Mobile mirror

Edit `app/src/services/socket.ts`:
- **Outbound** (C→S): add/rename/update the emit helper (e.g., `sendSocketMessage`, `emitTyping`). Helper signature must match new payload.
- **Inbound** (S→C): no helper change needed — screens attach `on` listeners directly.

## 3. Screen listeners

Find consumers:
```
grep -rn "socket\.on\|getSocket()" app/src/screens
```

For each consuming screen (typically `ChatScreen`):
- Update the `on('event', handler)` event name string
- Update the handler's destructured payload to match the new shape
- Update the `off` in the `useEffect` return to match the new name

## Rules

- **String match exactly** — event names are not types; a typo silently breaks the wire
- **Cleanup must mirror registration** — every `s.on('foo', h)` needs `s.off('foo', h)` in the cleanup with the same string
- **Payload sync** — if the backend now emits an extra field, the handler can ignore it (forward compatible). If a field was removed, find every reference in the screen before saying done.
- **Don't change screen logic** beyond the listener wiring — that's `mobile-agent`'s scope

## Output format

```
## Backend event change
- <event_name>: <what changed>

## Mobile mirror
- app/src/services/socket.ts:L — updated <helper>
- app/src/screens/<Screen>.tsx:L — updated listener wiring

## Stale references
- <file:line where old payload field is still destructured>
```
