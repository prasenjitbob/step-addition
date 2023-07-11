import { Request, Response } from "express";
import dotenv from "dotenv";
import pgPromise from "pg-promise";
import generateStepsFromNumbers from "./../utils/generateSteps"
import { Steps } from "../types";

dotenv.config();

const pgp = pgPromise();

const db = pgp(process.env.PG_DB_URL!); // Update with your PostgreSQL database details

export const generateSteps = (req: Request, res: Response) => {
  const { num1, num2 } = req.body;
  const regex = /^\d+$/;

  if (!regex.test(num1) || !regex.test(num2)) {
    return res
      .status(400)
      .json({ error: "Invalid numbers. Only positive integers are allowed." });
  }

  const steps = generateStepsFromNumbers(num1, num2);
  res.json(steps);
};

export const saveToDb = async (req: Request, res: Response) => {
  const { num1, num2, steps } = req.body;
  try {
    const stepData = Object.values(steps).map((step: any) => [
      step.carryString,
      step.sumString,
    ]);

    await db.none(
      `INSERT INTO step_results (num1, num2, steps) VALUES ($1, $2, $3::jsonb)`,
      [num1, num2, JSON.stringify(stepData)]
    );
    res.json({ message: "Successfully saved to DB" });
  } catch (error) {
    console.error("Error saving steps to the database:", error);
    res.sendStatus(500);
  }
};

export const getResults = async (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query;
  
    try {
      const offset = (Number(page) - 1) * Number(limit);
  
      const results = await db.any(
        "SELECT num1, num2, steps FROM step_results ORDER BY created_at DESC OFFSET $1 LIMIT $2",
        [offset, limit]
      );
  
      const totalResults = await db.one("SELECT COUNT(*) FROM step_results");
      const totalPages = Math.ceil(totalResults.count / +limit);
  
      const formattedResults = results.map((result) => {
        const formattedSteps = result.steps.reduce((acc: Steps, step: any[], index: number) => {
          const stepKey = `step${index + 1}`;
          acc[stepKey] = {
            carryString: step[0],
            sumString: step[1],
          };
          return acc;
        }, {});
  
        return {
          num1: result.num1,
          num2: result.num2,
          steps: formattedSteps,
        };
      });
  
      res.json({ results: formattedResults, totalPages });
    } catch (error) {
      console.error("Error retrieving results from the database:", error);
      res.sendStatus(500);
    }
  }
