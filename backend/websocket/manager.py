from uuid import UUID

from fastapi import WebSocket


class ConnectionManager:
    """
    Tracks active WebSocket connections per user_id.
    A user can have multiple tabs/devices open, so we keep a list per user.
    """

    def __init__(self):
        self.active_connections: dict[UUID, list[WebSocket]] = {}

    async def connect(self, user_id: UUID, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.setdefault(user_id, []).append(websocket)

    def disconnect(self, user_id: UUID, websocket: WebSocket):
        connections = self.active_connections.get(user_id, [])
        if websocket in connections:
            connections.remove(websocket)
        if not connections and user_id in self.active_connections:
            del self.active_connections[user_id]

    async def send_to_user(self, user_id: UUID, message: dict):
        """Push an event to every open connection for this user (e.g. other tabs)."""
        dead_sockets = []
        for ws in self.active_connections.get(user_id, []):
            try:
                await ws.send_json(message)
            except Exception:
                dead_sockets.append(ws)

        # clean up any sockets that failed (closed without a clean disconnect)
        for ws in dead_sockets:
            self.disconnect(user_id, ws)


manager = ConnectionManager()
