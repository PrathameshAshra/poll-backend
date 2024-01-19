import express, { Request, Response } from "express";
import connectionPool, { generateUUID, insertReactionQuery } from "../utils/db";
import connection from "../utils/db";
import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { socketInitializer } from "./../../index";

const router = express.Router();

// ... Other imports and utilities

// CRUD Endpoints for Reactions

// Create a new reaction
router.post("/", async (req: Request, res: Response) => {
  const { optionId, userId, pollId } = req.body;
  if (!optionId) {
    res.status(400).send({ message: "Invalid body" });
    return;
  }

  const id = generateUUID();
  console.log(pollId);
  try {
    // Insert into PollQuestions
    connection.query(insertReactionQuery, [id, "Like", optionId, userId]);
    socketInitializer.io.emit("reaction", {
      optionId: optionId,
      userId: userId,
      reaction: "like",
      pollId: pollId,
    });
    res.status(200).send({ message: "Reaction created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

// Get all reactions for a specific poll option
router.get("/:pollOptionID", async (req: Request, res: Response) => {
  // Implementation...
});

// Get a specific reaction by ID
router.get("/:id", async (req: Request, res: Response) => {
  // Implementation...
});

// Update a specific reaction by ID
router.put("/:id", async (req: Request, res: Response) => {
  // Implementation...
});

// Delete a specific reaction by ID
router.delete("/:id", async (req: Request, res: Response) => {
  // Implementation...
});

export default router;
