import { Favorite, MedicalServices } from "@mui/icons-material";
import { Diagnosis, HealthCheckEntry } from "../../types";

interface Props {
  entry: HealthCheckEntry;
  diagnoses: Diagnosis[];
}

const HealthCheck = ({ entry, diagnoses }: Props) => {
  const style = {
    borderStyle: "solid",
    borderRadius: "5px",
    padding: "10px",
    marginBottom: "10px",
  };

  const HealthRating = () => {
    switch (entry.healthCheckRating) {
      case 0:
        return <Favorite style={{ color: "green" }} />;
      case 1:
        return <Favorite style={{ color: "yellow" }} />;
      case 2:
        return <Favorite style={{ color: "orange" }} />;
      case 3:
        return <Favorite style={{ color: "red" }} />;
      default:
        return <></>;
    }
  };

  return (
    <div style={style}>
      <p>
        {entry.date} <MedicalServices />
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
      <HealthRating />
      <p>diagnose by {entry.specialist}</p>
    </div>
  );
};

export default HealthCheck;
