import { MysqlError, createConnection } from "mysql";
import { Response } from "express";
import { v4 as uuidv4 } from "uuid";
const connection = createConnection({
  host: "database-1.ctkyw0mqcjjv.ap-south-1.rds.amazonaws.com",
  user: "admin",
  password: "password",
  database: "PollQuestions",
  port: 3306,
});

connection.connect(function (err) {
  if (err) {
    console.error("Database connection failed: " + err.stack);
    return;
  }

  console.log("Connected to database.");
});
export const handleDbError = (error: MysqlError, res: Response): void => {
  console.error("Database error:", error);
  res.status(500).json({ error: "Internal Server Error" });
};

// Function to generate UUID
export const generateUUID = (): string => uuidv4();
export default connection;

export const getPollByUserQuery = (userId: string) => {
  return `SELECT
  PollQuestions.id,
  PollQuestions.caption,
  JSON_ARRAYAGG(
      JSON_OBJECT(
          'name', PollOptions.optionText,
          'like', COALESCE(reactionCount, 0),
          'id', PollOptions.id,
          'createdAt', MAX_Reactions.createdAt,
          'userIds', UserIds.userIds
      )
  ) AS options
FROM
  PollQuestions
JOIN
  PollOptions ON PollQuestions.id = PollOptions.pollID
LEFT JOIN LATERAL (
  SELECT
      COUNT(*) AS reactionCount
  FROM
      Reactions
  WHERE
      Reactions.reactionType = 'Like'
      AND Reactions.PollOptionID = PollOptions.id
) AS ReactionCounts ON 1=1
LEFT JOIN LATERAL (
  SELECT
      MAX(createdAt) AS createdAt
  FROM
      Reactions
  WHERE
      reactionType = 'Like'
      AND Reactions.PollOptionID = PollOptions.id
) AS MAX_Reactions ON 1=1
LEFT JOIN LATERAL (
  SELECT
      JSON_ARRAYAGG(userId) AS userIds
  FROM
      Reactions
  WHERE
      reactionType = 'Like'
      AND Reactions.PollOptionID = PollOptions.id
) AS UserIds ON 1=1
WHERE
  PollQuestions.userID = "${userId}"
GROUP BY
  PollQuestions.id, PollQuestions.caption;
`;
};
export const insertReactionQuery =
  "INSERT INTO Reactions (ID, reactionType, pollOptionId, userId) VALUES (?, ?, ?, ?)";
