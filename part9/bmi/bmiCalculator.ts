export const calculateBmi = (height: number, weight: number) => {
  const bmi: number = weight / (height / 100) ** 2;

  if (bmi >= 40.0) {
    return "Obese (Class III)";
  } else if (35.0 < bmi && bmi < 39.9) {
    return "Obese (Class II)";
  } else if (30.0 < bmi && bmi < 34.9) {
    return "Obese (Class I)";
  } else if (25.0 < bmi && bmi < 29.9) {
    return "Overweight (Pre-obese)";
  } else if (18.5 < bmi && bmi < 24.9) {
    return "Normal range";
  } else if (17.0 < bmi && bmi < 18.4) {
    return "Underweight (Mild thinness)";
  } else if (16.0 < bmi && bmi < 16.9) {
    return "Underweight (Moderate thinness)";
  } else {
    return "Underweight (Severe thinness)";
  }
};
/*
const checkArguments = (args: string[]) => {
  if (args.length < 4) {
    throw new Error("Not enough arguments");
  }
  if (args.length > 4) {
    throw new Error("Too many arguments");
  }

  if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
    return {
      value1: Number(args[2]),
      value2: Number(args[3]),
    };
  } else {
    throw new Error("Provided values were not numbers!");
  }
};

try {
  checkArguments(process.argv);
  const height = Number(process.argv[2]);
  const weight = Number(process.argv[3]);

  console.log(calculateBmi(height, weight));
} catch (error: unknown) {
  let errorMessage = "Something bad happened.";
  if (error instanceof Error) {
    errorMessage += " Error: " + error.message;
  }
  console.log(errorMessage);
}
*/
