import { Server } from "http";
import { WebSocket, WebSocketServer } from "ws";
import { User } from "../users/model";

interface Options {
  server: Server;
  path?: string; // ws
}

interface Room {
  name: string;
  clients: Set<WebSocket>;
}

export const users: User[] = [
  {
    username: "alice",
    token: "alice-token",
    password: "123456",
  },
  {
    username: "bob",
    token: "bob-token",
    password: "123456",
  },
  {
    username: "charlie",
    token: "charlie-token",
    password: "123456",
  },
];

export const authenticateWS = (ws: WebSocket, tokenUser: string) => {
  const user = users.find((u) => u.token === tokenUser);
  if (!user) {
    ws.close(1008, "Unauthorized");
    return null;
  }
  return user;
};

export class WssService {
  private static _instance: WssService;
  private wss: WebSocketServer;
  private rooms: Map<string, Room>; // Mapa de salas
  private commonRoom = "general"; // Nombre de la sala común

  private constructor(options: Options) {
    const { server } = options;
    this.wss = new WebSocketServer({ server });
    this.rooms = new Map();
    // Crear sala común por defecto
    this.rooms.set(this.commonRoom, {
      name: this.commonRoom,
      clients: new Set(),
    });
    this.start();
  }

  static get instance(): WssService {
    if (!WssService._instance) {
      throw "WssService is not initialized";
    }

    return WssService._instance;
  }

  static initWss(options: Options) {
    WssService._instance = new WssService(options);
  }

  public start() {
    this.wss.on("connection", (ws, req) => {
      console.log("new client connected");
      const tokenUser = new URL(
        req.url || "",
        `ws://${req.headers.host}`
      ).searchParams.get("tokenUser");

      if (!tokenUser) {
        ws.close(1008, "Token required");
        return;
      }

      const user = authenticateWS(ws, tokenUser);
      if (!user) return;

      // Añadir cliente a la sala común por defecto
      this.addClientToRoom(ws, this.commonRoom);

      ws.on("message", (message) => {
        try {
          const data = JSON.parse(message.toString());

          // Manejar creación de sala
          if (data.type === "create_room" && data.roomName) {
            this.createRoom(data.roomName, ws);
            return;
          }

          // Manejar mensajes normales
          const JsonTosend = {
            msj: data.message || message.toString(),
            username: user.username,
            room: data.room || this.commonRoom,
          };

          this.broadcastToRoom(JsonTosend.room, JSON.stringify(JsonTosend));
        } catch (error) {
          console.error("Error processing message:", error);
        }
      });

      ws.on("close", () => {
        // Limpiar al desconectarse
        this.removeClientFromAllRooms(ws);
      });
    });
  }
  private addClientToRoom(ws: WebSocket, roomName: string) {
    if (!this.rooms.has(roomName)) {
      this.rooms.set(roomName, {
        name: roomName,
        clients: new Set(),
      });
    }
    this.rooms.get(roomName)?.clients.add(ws);
  }

  private removeClientFromRoom(ws: WebSocket, roomName: string) {
    this.rooms.get(roomName)?.clients.delete(ws);
  }

  private removeClientFromAllRooms(ws: WebSocket) {
    this.rooms.forEach((room) => room.clients.delete(ws));
  }

  private createRoom(roomName: string, ws: WebSocket) {
    if (!this.rooms.has(roomName)) {
      this.rooms.set(roomName, {
        name: roomName,
        clients: new Set(),
      });
      ws.send(
        JSON.stringify({
          type: "room_created",
          room: roomName,
        })
      );
    } else {
      ws.send(
        JSON.stringify({
          type: "error",
          message: "Room already exists",
        })
      );
    }
  }

  private broadcastToRoom(roomName: string, message: string) {
    const room = this.rooms.get(roomName);
    if (room) {
      room.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      });
    }
  }
}
