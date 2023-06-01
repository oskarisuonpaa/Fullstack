import { Work } from "@mui/icons-material";
import { Diagnosis, OccupationalHealthcareEntry } from "../../types";

interface Props {
  entry: OccupationalHealthcareEntry;
  diagnoses: Diagnosis[];
}

const OccupationalHealthcare = ({ entry, diagnoses }: Props) => {
  const style = {
    borderStyle: "solid",
    borderRadius: "5px",
    padding: "10px",
    marginBottom: "10px",
  };

  return (
    <div style={style}>
      <p>
        {entry.date} <Work /> <b>{entry.employerName}</b>
        <br />
        <i>{entry.description}</i>
      </p>
      {entry.diagnosisCodes && (
        <ul>
          {entry.diagnosisCodes.map((dianosisCode: string) => {
            const diagnosis = diagnoses.find(
              (diagnosis) => diagnosis.code === dianosisCode
            );
            return (
              <li key={dianosisCode}>
                {dianosisCode} {diagnosis?.name}
              </li>
            );
          })}
        </ul>
      )}
      <p>diagnose by {entry.specialist}</p>
    </div>
  );
};

export default OccupationalHealthcare;
