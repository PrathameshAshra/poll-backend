const { createClient } = require("@supabase/supabase-js");
import express, { Express, NextFunction, Request, Response } from "express";

function getToken(req: Request) {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    return req.headers.authorization.split(" ")[1];
  }
  return null;
}

export const supabase_middleware = async (req: Request, res: Response) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY,
    {}
  );
  const JWT = getToken(req);

  switch (JWT) {
    case null:
      res.status(401).json({ error: "no JWT parsed" });
      break;
    default:
      const { user, error } = await supabase.auth.api.getUser(JWT);

      if (error) {
        res.status(401).json(error);
      } else {
        await supabase.auth.setAuth(JWT);
        return { user, supabase };
      }
      break;
  }
};

module.exports = supabase_middleware;
