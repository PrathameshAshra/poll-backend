import express, { Request, Response } from "express";
import connectionPool, { generateUUID } from "../utils/db";
import connection from "../utils/db";

const router = express.Router();

// ... Other imports and utilities

// CRUD Endpoints for PollQuestions

// Create a new poll question
router.post("/", async (req: Request, res: Response) => {
  const { pollId, optionId, userId } = req.body;
  if (!pollId || !optionId) {
    res.status(400).send({ message: "Invalid body" });
    return;
  }

  const id = generateUUID();

  const insertReactionQuery =
    "INSERT INTO Reaction (ID, pollOptionId, reactionType, createdAt) VALUES (?, ?, ?, ?, ?)";

  try {
    // Insert into PollQuestions
    connection.query(insertReactionQuery, [id, "Like", optionId]);
    res.status(200).send({ message: "Reaction created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

// Get all poll questions
router.get("/", async (req: Request, res: Response) => {
  // Implementation...
});

// Get a specific poll question by ID
router.get("/:id", async (req: Request, res: Response) => {
  // Implementation...
});

// Update a specific poll question by ID
router.put("/:id", async (req: Request, res: Response) => {
  // Implementation...
});

// Delete a specific poll question by ID
router.delete("/:id", async (req: Request, res: Response) => {
  // Implementation...
});

export default router;
