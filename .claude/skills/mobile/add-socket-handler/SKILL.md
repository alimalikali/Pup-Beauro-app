---
name: add-socket-handler
description: Wire a new Socket.io event in app/src/services/socket.ts and a corresponding useEffect listener in a screen. Use when the user asks to "add socket handler", "wire realtime event", "listen for ws event".
argument-hint: [event-name]
allowed-tools: Read, Edit
paths: app/**
---

# Add socket handler: $ARGUMENTS

## 1. Helper in `app/src/services/socket.ts`

For an **outbound** event, add a helper alongside `sendSocketMessage`, `emitTyping`, etc.:
```ts
export const emit$ARGUMENTS = (payload: { /* ... */ }) => {
  const s = getSocket();
  if (!s) return;
  s.emit('$ARGUMENTS', payload);
};
```

For an **inbound** event, the screen attaches its own `on` handler (don't centralize listeners — each consuming screen owns its lifecycle).

## 2. Listener in the consuming screen

```tsx
useEffect(() => {
  const s = getSocket();
  if (!s) return;

  const handler = (data: ShapeFromBackend) => {
    dispatch(addMessage(data)); // or whatever Redux action
  };

  s.on('$ARGUMENTS', handler);
  return () => { s.off('$ARGUMENTS', handler); }; // cleanup is mandatory
}, [dispatch]);
```

## 3. Rules

- **Always cleanup** the listener in the `useEffect` return — leaked listeners stack up across screen re-mounts
- **Dispatch into Redux** for chat-like data; don't keep socket payloads in component state (`chatSlice.addMessage` is the canonical store)
- **Don't call `connectSocket` per screen** — it's called once at app start (or post-login). Screens only attach/detach handlers.
- **Typing-style events**: debounce 800ms after last keystroke before emitting `stop_typing` (existing pattern in ChatScreen)

## 4. Match the backend event name exactly

Event names are case-sensitive strings. The backend lives at `api/src/chat/chat.gateway.ts`. If you rename, do both sides in the same PR or dispatch `contract-sync-agent`.

## Verify

- Connect from the device, perform the action that should fire the event
- Add a temporary `console.log` in the handler to confirm it fires (remove before commit)
- Force-disconnect the socket and reconnect — confirm the listener re-attaches cleanly (no duplicate dispatches)
- Navigate away and back — confirm no leaked listeners (handler fires once per event, not N times)
