import patientData from "../../data/patients";

import {
  Entry,
  NewEntry,
  NewPatient,
  NonSensitivePatient,
  Patient,
} from "../types";

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

const getEntry = (id: string): Patient | undefined => {
  return patients.find((patient) => patient.id === id);
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

const addEntry = (patientId: string, entry: NewEntry): Entry => {
  const id = uuid();
  const newEntry = {
    id,
    ...entry,
  };
  const patient = patients.find((patient) => patient.id === patientId);
  patient?.entries?.push(newEntry);
  return newEntry;
};

export default { getNonsensitiveEntries, addPatient, getEntry, addEntry };
