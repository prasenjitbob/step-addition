import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import stepsRoutes from "./routes/steps";

dotenv.config();

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

app.use("/api", stepsRoutes);

app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});
