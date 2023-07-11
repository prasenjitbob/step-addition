import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pgPromise from "pg-promise";

dotenv.config();

const pgp = pgPromise();

const db = pgp(process.env.PG_DB_URL); // Update with your PostgreSQL database details

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// API endpoint for generating steps
app.post("/api/steps", (req, res) => {
  const { num1, num2 } = req.body;
  const regex = /^\d+$/;

  if (!regex.test(num1) || !regex.test(num2)) {
    return res
      .status(400)
      .json({ error: "Invalid numbers. Only positive integers are allowed." });
  }

  const steps = generateSteps(num1, num2);
  res.json(steps);
});

// Generate the step-by-step addition process
function generateSteps(num1, num2) {
  const steps = {};

  let carry = 0;
  let step = 1;
  let prevCarryString = "_";
  let prevSumString = "";

  while (num1 > 0 || num2 > 0 || carry > 0) {
    const digit1 = num1 % 10;
    const digit2 = num2 % 10;

    const sum = digit1 + digit2 + carry;
    const sumDigit = sum % 10;

    carry = Math.floor(sum / 10);

    const carryString = carry > 0 ? carry.toString() : "0";
    prevCarryString = carryString.toString() + prevCarryString;
    const sumString = sumDigit.toString() || 0;
    prevSumString = sumString.toString() + prevSumString;

    steps[`step${step}`] = {
      carryString: prevCarryString,
      sumString: prevSumString,
    };

    step++;
    num1 = Math.floor(num1 / 10);
    num2 = Math.floor(num2 / 10);
    if (num1 === 0 && num2 === 0) {
      steps[`step${step - 1}`] = {
        carryString: steps[`step${step - 1}`].carryString.slice(1),
        sumString: prevSumString,
      };
    }
  }

  return steps;
}

// Save steps to the database
app.post("/api/saveToDb", async (req, res) => {
  const { num1, num2, steps } = req.body;
  try {
    const stepData = Object.values(steps).map((step) => [
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
});

app.get("/api/results", async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const offset = (page - 1) * limit;

    const results = await db.any(
      "SELECT num1, num2, steps FROM step_results ORDER BY created_at DESC OFFSET $1 LIMIT $2",
      [offset, limit]
    );

    const totalResults = await db.one("SELECT COUNT(*) FROM step_results");
    const totalPages = Math.ceil(totalResults.count / limit);

    const formattedResults = results.map((result) => {
      const formattedSteps = result.steps.reduce((acc, step, index) => {
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
});

app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});
