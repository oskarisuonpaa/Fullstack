import express from "express";
import patientService from "../services/patientService";
import { toNewEntry, toNewPatient } from "../utils";

const router = express.Router();

router.get("/", (_request, response) => {
  response.send(patientService.getNonsensitiveEntries());
});

router.post("/", (request, response) => {
  try {
    const newPatient = toNewPatient(request.body);
    const addedPatient = patientService.addPatient(newPatient);
    response.json(addedPatient);
  } catch (error: unknown) {
    let errorMessage = "Something went wrong.";
    if (error instanceof Error) {
      errorMessage += " Error: " + error.message;
    }
    response.status(400).send(errorMessage);
  }
});

router.get("/:id", (request, response) => {
  const id = request.params.id;
  const patient = patientService.getEntry(id);
  if (!patient) {
    response.status(400).send("Something went wrong. Error: patient not found");
  } else {
    response.json(patient);
  }
});

router.post("/:id/entries", (request, response) => {
  try {
    const id = request.params.id;
    const newEntry = toNewEntry(request.body);
    const addedEntry = patientService.addEntry(id, newEntry);
    response.json(addedEntry);
  } catch (error: unknown) {
    let errorMessage = "Something went wrong.";
    if (error instanceof Error) {
      errorMessage += " Error: " + error.message;
    }
    response.status(400).send(errorMessage);
  }
});

export default router;
