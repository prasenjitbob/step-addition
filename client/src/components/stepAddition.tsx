"use client";
import { ChangeEvent, FormEvent, useState } from "react";
import axios from "axios";
import { apiBaseURL } from "@/constants/axios";

interface Step {
  carryString: string;
  sumString: string;
}

interface StepAdditionResponse {
  [step: string]: Step;
}

export default function StepAddition() {
  const [num1, setNum1] = useState("");
  const [num2, setNum2] = useState("");
  const [steps, setSteps] = useState("");
  const [savedToDb, setSavedToDb] = useState(false);

  const handleGenerateSteps = async (e: FormEvent) => {
    e.preventDefault();
    setSavedToDb(false);
    try {
      const response = await axios.post<StepAdditionResponse>(
        `${apiBaseURL}/api/steps`,
        {
          num1: parseInt(num1),
          num2: parseInt(num2),
        }
      );
      setSteps(JSON.stringify(response.data, null, 5));
    } catch (error) {
      console.error(error);
    }
  };

  const saveResultsToDB = async () => {
    try {
      await axios.post(`${apiBaseURL}/api/saveToDb`, {
        num1: parseInt(num1),
        num2: parseInt(num2),
        steps: JSON.parse(steps),
      });
      setNum2("");
      setNum1("");
      setSteps("");
      setSavedToDb(true);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <h1 className="header">Step Addition</h1>
      <div className="main_container">
        <form onSubmit={handleGenerateSteps}>
          <label>
            <p>First Number:</p>
            <input
              type="number"
              value={num1}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setNum1(e.target.value)
              }
            />
          </label>
          <label>
            <p>Second Number:</p>

            <input
              type="number"
              value={num2}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setNum2(e.target.value)
              }
            />
          </label>
          <button
            disabled={!num1 || !num2}
            style={{ cursor: num1 && num2 ? "pointer" : "" }}
            type="submit"
          >
            Generate Steps
          </button>
        </form>
        {savedToDb ? <h4 className="saved_to_db">Saved to DB!</h4> : null}
        {steps ? (
          <>
            <div className="steps_container">
              <pre className="steps">{steps}</pre>
            </div>
            <div className="save_btn_container">
              <button className="save_btn" onClick={saveResultsToDB}>
                Save results to DB
              </button>
            </div>
          </>
        ) : null}
      </div>
    </>
  );
}
