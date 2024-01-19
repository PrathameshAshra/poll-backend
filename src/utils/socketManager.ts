import { Server, Socket } from "socket.io";
import { createServer, Server as HttpServer } from "http";
import express, { Express } from "express";

export class SocketIOInitializer {
  public httpServer: HttpServer;
  public io: Server;

  constructor(private app: Express, private corsOrigin: string) {
    this.httpServer = createServer(app);
    this.io = new Server(this.httpServer, {
      cors: {
        origin: corsOrigin,
        methods: ["GET", "POST"],
      },
    });
  }

  public setupConnectionHandler() {
    this.io.on("connection", (socket: Socket) => {
      console.log("A user connected");

      socket.on("disconnect", () => {
        console.log("User disconnected");
      });
      socket.on("error", (error) => {
        console.error("Socket.IO error:", error);
      });

      // Additional event handlers or logic for Socket.IO connection
      socket.on("reaction", (data) => {
        console.log("Received reaction on server:", data);
      });

      // Add more event handlers as needed
    });
  }

  public initialize() {
    this.setupConnectionHandler();
    this.app.set("socketio", this.httpServer);

    return this.httpServer;
  }
}
