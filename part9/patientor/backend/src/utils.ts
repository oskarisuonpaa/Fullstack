import {
  Gender,
  NewEntry,
  NewPatient,
  HealthCheckRating,
  Diagnose,
} from "./types";

const isString = (text: unknown): text is string => {
  return typeof text === "string" || text instanceof String;
};

const isNumber = (value: unknown): value is number => {
  return typeof value === "number" || value instanceof Number;
};

const isGender = (param: string): param is Gender => {
  return Object.values(Gender)
    .map((value) => value.toString())
    .includes(param);
};

const parseGender = (gender: unknown): Gender => {
  if (!isString(gender) || !isGender(gender)) {
    throw new Error("Incorrect or missing gender");
  }

  return gender;
};

const parseName = (name: unknown): string => {
  if (!isString(name)) {
    throw new Error("Incorrect or missing name");
  }

  return name;
};

const parseDateOfBirth = (dateOfBirth: unknown): string => {
  if (!isString(dateOfBirth)) {
    throw new Error("Incorrect or missing date of birth");
  }

  return dateOfBirth;
};

const parseSSN = (ssn: unknown): string => {
  if (!isString(ssn)) {
    throw new Error("Incorrect or missing ssn");
  }

  return ssn;
};

const parseOccupation = (occupation: unknown): string => {
  if (!isString(occupation)) {
    throw new Error("Incorrect or missing occupation");
  }

  return occupation;
};

const parseDescription = (description: unknown): string => {
  if (!isString(description)) {
    throw new Error("Incorrect or missing description");
  }
  return description;
};

const parseDate = (date: unknown): string => {
  if (!isString(date)) {
    throw new Error("Incorrect or missing date");
  }
  return date;
};

const parseSpecialist = (specialist: unknown): string => {
  if (!isString(specialist)) {
    throw new Error("Incorrect or missing specialist");
  }
  return specialist;
};

const parseEmployerName = (employerName: unknown): string => {
  if (!isString(employerName)) {
    throw new Error("Incorrect or missing employer name");
  }
  return employerName;
};

const isHealthCheckRating = (param: number): param is HealthCheckRating => {
  return Object.values(HealthCheckRating)
    .map((value) => value)
    .includes(param);
};

const parseHealthCheckRating = (
  healthCheckRating: unknown
): HealthCheckRating => {
  if (!isNumber(healthCheckRating) || !isHealthCheckRating(healthCheckRating)) {
    throw new Error("Incorrect or missing health check rating");
  }

  return healthCheckRating;
};

const parseDiagnosisCodes = (object: unknown): Array<Diagnose["code"]> => {
  if (!object || typeof object !== "object" || !("diagnosisCodes" in object)) {
    // we will just trust the data to be in correct form
    return [] as Array<Diagnose["code"]>;
  }

  return object.diagnosisCodes as Array<Diagnose["code"]>;
};

const parseDischarge = (
  object: unknown
): { date: string; criteria: string } => {
  if (!object || typeof object !== "object" || !("discharge" in object)) {
    return { date: "", criteria: "" };
  }

  return object.discharge as { date: string; criteria: string };
};

const parseSickLeave = (
  object: unknown
): { startDate: string; endDate: string } => {
  if (!object || typeof object !== "object" || !("sickleave" in object)) {
    return { startDate: "", endDate: "" };
  }

  return object.sickleave as { startDate: string; endDate: string };
};

export const toNewPatient = (object: unknown): NewPatient => {
  if (!object || typeof object !== "object") {
    throw new Error("Incorrect or missing data");
  }

  if (
    "name" in object &&
    "dateOfBirth" in object &&
    "ssn" in object &&
    "gender" in object &&
    "occupation" in object
  ) {
    const newEntry: NewPatient = {
      name: parseName(object.name),
      dateOfBirth: parseDateOfBirth(object.dateOfBirth),
      ssn: parseSSN(object.ssn),
      gender: parseGender(object.gender),
      occupation: parseOccupation(object.occupation),
      entries: [],
    };

    return newEntry;
  }

  throw new Error("Incorrect data: some fields are missing");
};

export const toNewEntry = (object: unknown): NewEntry => {
  if (!object || typeof object !== "object" || !("type" in object)) {
    throw new Error("Incorrect or missing data");
  }

  if (
    object.type === "HealthCheck" &&
    "description" in object &&
    "date" in object &&
    "specialist" in object &&
    "healthCheckRating" in object
  ) {
    const newEntry: NewEntry = {
      description: parseDescription(object.description),
      date: parseDate(object.date),
      specialist: parseSpecialist(object.specialist),
      healthCheckRating: parseHealthCheckRating(object.healthCheckRating),
      type: "HealthCheck",
      diagnosisCodes: parseDiagnosisCodes(object),
    };
    return newEntry;
  } else if (
    object.type === "Hospital" &&
    "description" in object &&
    "date" in object &&
    "specialist" in object
  ) {
    const newEntry: NewEntry = {
      description: parseDescription(object.description),
      date: parseDate(object.date),
      specialist: parseSpecialist(object.specialist),
      discharge: parseDischarge(object),
      type: "Hospital",
      diagnosisCodes: parseDiagnosisCodes(object),
    };
    return newEntry;
  } else if (
    object.type === "OccupationalHealthcare" &&
    "description" in object &&
    "date" in object &&
    "specialist" in object &&
    "employerName" in object
  ) {
    const newEntry: NewEntry = {
      description: parseDescription(object.description),
      date: parseDate(object.date),
      specialist: parseSpecialist(object.specialist),
      type: "OccupationalHealthcare",
      diagnosisCodes: parseDiagnosisCodes(object),
      employerName: parseEmployerName(object.employerName),
      sickLeave: parseSickLeave(object),
    };
    return newEntry;
  }

  throw new Error("Incorrect data: some fields are missing");
};
