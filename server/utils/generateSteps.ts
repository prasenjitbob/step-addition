import { Steps } from "../types";

export default function generateStepsFromNumbers(num1: number, num2: number): Steps {
  const steps: Steps = {};

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
