interface Result {
  periodLenght: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

export const calculateExercises = (
  dailyExerciseHours: number[],
  target: number
) => {
  const periodLenght: number = dailyExerciseHours.length;
  let trainingDays = 0;
  let totalHours = 0;

  dailyExerciseHours.forEach((hours) => {
    if (hours != 0) {
      trainingDays++;
      totalHours += hours;
    }
  });

  const average: number = totalHours / periodLenght;

  let success = false;
  let rating = 0;
  let ratingDescription = "";

  if (average >= target) {
    rating = 3;
    ratingDescription = "Nicely done, good job!";
    success = true;
  } else if (average < target && average >= target * 0.75) {
    rating = 2;
    ratingDescription = "Not too bad but could be better!";
  } else {
    rating = 1;
    ratingDescription = "Are you even trying?";
  }

  const result: Result = {
    periodLenght,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average,
  };

  return result;
};
/*
const checkArguments = (args: string[]) => {
  if (args.length < 4) {
    throw new Error("Not enough arguments");
  }

  for (let index = 2; index < args.length; index++) {
    if (isNaN(Number(args[index]))) {
      throw new Error("Provided values have to be numbers");
    }
  }
};

try {
  checkArguments(process.argv);

  const dailyExerciseHours: number[] = [];
  for (let index = 3; index < process.argv.length; index++) {
    dailyExerciseHours.push(Number(process.argv[index]));
  }
  const target = Number(process.argv[2]);

  console.log(calculateExercises(dailyExerciseHours, target));
} catch (error: unknown) {
  let errorMessage = "Something bad happened.";
  if (error instanceof Error) {
    errorMessage += " Error: " + error.message;
  }
  console.log(errorMessage);
}
*/
