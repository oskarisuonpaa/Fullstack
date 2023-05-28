import { SyntheticEvent, useState } from "react";
import { DiaryFormValues } from "../types";

interface Props {
  onSubmit: (values: DiaryFormValues) => void;
}

const AddDiaryForm = ({ onSubmit }: Props) => {
  const [date, setDate] = useState<string>("");
  const [visibility, setVisibility] = useState<string>("");
  const [weather, setWeather] = useState<string>("");
  const [comment, setComment] = useState<string>("");

  const submit = (event: SyntheticEvent) => {
    event.preventDefault();
    onSubmit({
      date,
      visibility,
      weather,
      comment,
    });
  };

  return (
    <form onSubmit={submit}>
      <div>
        date
        <input
          type="date"
          value={date}
          onChange={({ target }) => setDate(target.value)}
        />
      </div>
      <div>
        visibility great
        <input
          type="radio"
          name="visibility"
          onChange={() => setVisibility("great")}
        />
        good
        <input
          type="radio"
          name="visibility"
          onChange={() => setVisibility("good")}
        />
        ok
        <input
          type="radio"
          name="visibility"
          onChange={() => setVisibility("ok")}
        />
        poor
        <input
          type="radio"
          name="visibility"
          onChange={() => setVisibility("poor")}
        />
      </div>
      <div>
        weather sunny
        <input
          type="radio"
          name="weather"
          onChange={() => setWeather("sunny")}
        />
        rainy
        <input
          type="radio"
          name="weather"
          onChange={() => setWeather("rainy")}
        />
        cloudy
        <input
          type="radio"
          name="weather"
          onChange={() => setWeather("cloudy")}
        />
        stormy
        <input
          type="radio"
          name="weather"
          onChange={() => setWeather("stormy")}
        />
        windy
        <input
          type="radio"
          name="weather"
          onChange={() => setWeather("windy")}
        />
      </div>
      <div>
        comment
        <input
          value={comment}
          onChange={({ target }) => setComment(target.value)}
        />
      </div>
      <button type="submit">add</button>
    </form>
  );
};

export default AddDiaryForm;
