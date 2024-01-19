import express, { Express, NextFunction, Request, Response } from "express";
import { createServer } from "http";
import cors from "cors";
import * as firebaseAdmin from "firebase-admin";
import * as dotenv from "dotenv";
import bodyParser from "body-parser";
import pollOptionsRouter from "./src/routes/pollOptions";
import pollQuestionsRouter from "./src/routes/pollQuestions";
import reactionsRouter from "./src/routes/reactions";
import { Server, Socket } from "socket.io";
import { SocketIOInitializer } from "./src/utils/socketManager";
import connection, { generateUUID, insertReactionQuery } from "./src/utils/db";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

dotenv.config();

const app: Express = express();
export const socketInitializer = new SocketIOInitializer(
  app,
  "http://localhost:5173"
);
const httpServer = socketInitializer.initialize();
// Use the cors middleware to handle CORS headers
app.use(cors());
app.use(bodyParser.json());

firebaseAdmin.initializeApp({
  projectId: "poll-app-e1f8f",
});
const verifyFirebaseToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const idToken = req.headers.authorization?.split("Bearer ")[1];

  if (!idToken) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  try {
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
    if (!decodedToken) {
      throw new Error("Unauthorized");
    }
    // Store the user ID in the request object
    req.body.userId = decodedToken.uid;

    return next();
  } catch (error) {
    console.error("Error verifying Firebase token:", error);
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};

app.use("/polls", verifyFirebaseToken);
app.use("/polls", pollQuestionsRouter);

app.use("/poll-options", pollOptionsRouter);

app.use("/reactions", verifyFirebaseToken);
app.use("/reactions", reactionsRouter);

app.get("/", (req: Request, res: Response) => {
  res.status(200).send("Hello Papaya");
});

httpServer.listen(3000);
