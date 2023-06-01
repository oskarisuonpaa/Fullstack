import { LocalHospital } from "@mui/icons-material";
import { Diagnosis, HospitalEntry } from "../../types";

interface Props {
  entry: HospitalEntry;
  diagnoses: Diagnosis[];
}

const Hospital = ({ entry, diagnoses }: Props) => {
  const style = {
    borderStyle: "solid",
    borderRadius: "5px",
    padding: "10px",
    marginBottom: "10px",
  };

  return (
    <div style={style}>
      <p>
        {entry.date} <LocalHospital />
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
      {entry.discharge && (
        <p>
          discharged: {entry.discharge.date} {entry.discharge.criteria}
        </p>
      )}
    </div>
  );
};

export default Hospital;
