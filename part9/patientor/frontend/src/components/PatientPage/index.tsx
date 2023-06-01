import { useState, useEffect } from "react";
import { Diagnosis, Entry, EntryFormValues, Patient } from "../../types";
import patientService from "../../services/patients";
import { useParams } from "react-router-dom";
import HospitalEntry from "./HospitalEntry";
import HealthCheck from "./HealthCheckEntry";
import OccupationalHealthcare from "./OccupationalHealthcareEntry";
import EntryForm from "./EntryForm";

interface Props {
  diagnoses: Diagnosis[];
}

const PatientPage = ({ diagnoses }: Props) => {
  const { id } = useParams();
  const [patient, setPatient] = useState<Patient>();

  useEffect(() => {
    const fetchPatient = async () => {
      if (id) {
        const patient = await patientService.getById(id);
        setPatient(patient);
      }
    };
    void fetchPatient();
  }, [id]);

  if (!patient) {
    return <></>;
  }

  const submitNewEntry = async (values: EntryFormValues) => {
    try {
      const entry = await patientService.addEntry(values, patient.id);
    } catch (error) {}
  };

  const EntryDetails: React.FC<{ entry: Entry }> = ({ entry }) => {
    switch (entry.type) {
      case "Hospital":
        return (
          <HospitalEntry key={entry.id} entry={entry} diagnoses={diagnoses} />
        );
      case "OccupationalHealthcare":
        return (
          <OccupationalHealthcare
            key={entry.id}
            entry={entry}
            diagnoses={diagnoses}
          />
        );

      case "HealthCheck":
        return (
          <HealthCheck key={entry.id} entry={entry} diagnoses={diagnoses} />
        );
      default:
        return assertNever(entry);
    }
  };

  return (
    <>
      <h2>
        {patient.name} {patient.gender}
      </h2>
      <p>
        ssh: {patient.ssn} <br /> occupation: {patient.occupation}
      </p>
      <EntryForm onSubmit={submitNewEntry} />
      <h3>entries</h3>
      {patient.entries &&
        patient.entries.map((entry: Entry) => EntryDetails({ entry }))}
    </>
  );
};

export default PatientPage;
function assertNever(
  entry: never
): import("react").ReactElement<any, any> | null {
  throw new Error("Function not implemented.");
}
