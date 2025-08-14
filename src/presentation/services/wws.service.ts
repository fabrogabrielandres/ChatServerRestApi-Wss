import { Server } from "http";
import { WebSocket, WebSocketServer } from "ws";
import { User } from "../users/model";

interface Options {
  server: Server;
  path?: string; // ws
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

  private constructor(options: Options) {
    const { server } = options; /// ws://localhost:3000/ws

    this.wss = new WebSocketServer({ server });
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

      // Escuchar mensajes del cliente
      ws.on("message", (message) => {
        const JsonTosend = {
          msj: message.toString(),
          username: user.username,
        };

        const JsonToString = JSON.stringify(JsonTosend);

        console.log(`Message from ${JsonTosend.username}: ${JsonTosend.msj}`);

        // Reenviar el mensaje a TODOS los clientes conectados
        this.wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            // Usa WebSocket.OPEN
            client.send(JsonToString);
          }
        });
      });

      // Enviar mensaje de bienvenida
      // ws.send('wellcome to chat!');
    });
  }
}
