import patientData from "../../data/patients";

import { NewPatient, NonSensitivePatient, Patient } from "../types";

import { v1 as uuid } from "uuid";

const patients: Patient[] = patientData;

const getNonsensitiveEntries = (): NonSensitivePatient[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));
};

const addPatient = (patient: NewPatient): Patient => {
  const id = uuid();
  const newPatient = {
    id,
    ...patient,
  };

  patients.push(newPatient);
  return newPatient;
};

export default { getNonsensitiveEntries, addPatient };
