// routes/pollQuestions.ts
import express, { Request, Response } from "express";
import connectionPool, { generateUUID, getPollByUserQuery } from "../utils/db";
import connection from "../utils/db";

const router = express.Router();

// ... Other imports and utilities

// CRUD Endpoints for PollQuestions

// Create a new poll question
router.post("/", async (req: Request, res: Response) => {
  const { caption, optionList, userId } = req.body;
  const tempValidTo = "2030-12-12 00:00:00";
  if (!caption || !optionList) {
    res.status(400).send({ message: "Invalid body" });
    return;
  }
  const id = generateUUID();

  const insertPollQuestionQuery =
    "INSERT INTO PollQuestions (ID, caption, validTill, userId) VALUES (?, ?, ?, ?)";

  const insertPollOptionQuery =
    "INSERT INTO PollOptions (ID, pollID, optionText) VALUES (?, ?, ?)";

  try {
    // Insert into PollQuestions
    connection.query(insertPollQuestionQuery, [
      id,
      caption,
      tempValidTo,
      userId,
    ]);

    // Insert into PollOptions
    for (const optionText of optionList) {
      const optionId = generateUUID();
      connection.query(insertPollOptionQuery, [optionId, id, optionText.name]);
    }

    res.status(200).send({ message: "Poll created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

// Get all poll questions
router.get("/", async (req: Request, res: Response) => {
  console.log(req.body, "Baba");

  connection.query(
    `SELECT PollQuestions.*, PollOptions.*
    FROM PollQuestions
    RIGHT JOIN PollOptions ON PollQuestions.ID = PollOptions.pollID`,
    (error, response, fields) => {
      try {
        if (error) {
          throw new Error("Unable to query PollQuestions");
        }

        res.status(200).send(response);
      } catch (err) {
        res.status(500).send(err);
      }
    }
  );
});

// Get a specific poll question by ID
router.get("/user/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  const query = getPollByUserQuery(id);
  connection.query(query, [id], (error, response, fields) => {
    try {
      if (error) {
        throw new Error("Unable to query PollQuestions");
      }
      const data = response.map((i: any) => {
        return {
          id: i.id,
          caption: i.caption,
          options: JSON.parse(i.options),
        };
      });
      res.status(200).send(data);
    } catch (err) {
      res.status(500).send(err);
    }
  });
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
