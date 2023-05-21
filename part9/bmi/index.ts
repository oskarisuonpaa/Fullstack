import express from "express";
import { calculateBmi } from "./bmiCalculator";
import { calculateExercises } from "./exerciseCalculator";
const app = express();

app.use(express.json());

app.get("/hello", (_request, response) => {
  response.send("Hello Full Stack!");
});

app.get("/bmi", (request, response) => {
  if (
    !request.query.height ||
    !request.query.weight ||
    isNaN(Number(request.query.height)) ||
    isNaN(Number(request.query.weight))
  ) {
    return response.status(400).json({ error: "malformatted parameters" });
  }

  const height = Number(request.query.height);
  const weight = Number(request.query.weight);

  const result: string = calculateBmi(height, weight);

  return response.send(result);
});

app.post("/exercises", (request, response) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { daily_exercises, target } = request.body;

  if (!daily_exercises || !target) {
    return response.status(400).json({ error: "parameters missing" });
  }

  if (isNaN(Number(target))) {
    return response.status(400).json({ error: "malformatted parameters" });
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  for (let index = 0; index < daily_exercises.length; index++) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (isNaN(Number(daily_exercises[index]))) {
      return response.status(400).json({ error: "malformatted parameters" });
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const result = calculateExercises(daily_exercises, target);

  return response.send(result);
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
