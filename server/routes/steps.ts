import express from "express";
import { generateSteps, saveToDb, getResults } from "../controllers/steps";

const router = express.Router();

router.post("/steps", generateSteps);
router.post("/saveToDb", saveToDb);
router.get("/results", getResults);

export default router;
