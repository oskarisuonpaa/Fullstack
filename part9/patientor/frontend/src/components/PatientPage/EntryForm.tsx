import { Button, TextField } from "@mui/material";
import { SyntheticEvent, useState } from "react";
import { EntryFormValues } from "../../types";

interface Props {
  onSubmit: (values: EntryFormValues) => void;
}

const EntryForm = ({ onSubmit }: Props) => {
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [specialist, setSpecialist] = useState("");
  const [healthCheckRating, setHealthCheckRating] = useState("");
  const [diagnosisCodes, setDiagnosisCodes] = useState("");

  const style = {
    borderStyle: "dotted",
    padding: "10px",
    marginBottom: "10px",
  };

  const handleCancel = () => {
    setDescription("");
    setDate("");
    setSpecialist("");
    setHealthCheckRating("");
    setDiagnosisCodes("");
  };

  const addEntry = (event: SyntheticEvent) => {
    event.preventDefault();
    onsubmit();
  };
  return (
    <form style={style}>
      <TextField
        label="Description"
        fullWidth
        value={description}
        onChange={({ target }) => setDescription(target.value)}
      />
      <TextField
        label="Date"
        fullWidth
        value={date}
        onChange={({ target }) => setDate(target.value)}
      />
      <TextField
        label="Specialist"
        fullWidth
        value={specialist}
        onChange={({ target }) => setSpecialist(target.value)}
      />
      <TextField
        label="Health check rating"
        fullWidth
        value={healthCheckRating}
        onChange={({ target }) => setHealthCheckRating(target.value)}
      />
      <TextField
        label="Diagnosis codes"
        fullWidth
        value={diagnosisCodes}
        onChange={({ target }) => setDiagnosisCodes(target.value)}
      />
      <div>
        <Button variant="contained" color="error" onClick={handleCancel}>
          CANCEL
        </Button>
        <Button
          style={{
            float: "right",
            color: "white",
            backgroundColor: "gray",
          }}
          variant="contained"
          type="submit">
          ADD
        </Button>
      </div>
    </form>
  );
};

export default EntryForm;
