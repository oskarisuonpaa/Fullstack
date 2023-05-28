import { useState, useEffect } from "react";
import axios from "axios";
import AddDiaryForm from "./components/AddDiaryForm";
import diaryService from "./services/diaries";
import { Diary, DiaryFormValues } from "./types";
import DiariesList from "./components/DiariesList";

const App = () => {
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [error, setError] = useState<string>();

  useEffect(() => {
    const fetchEntryList = async () => {
      const diaries = await diaryService.getAll();
      setDiaries(diaries);
    };

    void fetchEntryList();
  }, []);

  const submitNewDiary = async (values: DiaryFormValues) => {
    try {
      const diary = await diaryService.create(values);
      setDiaries(diaries?.concat(diary));
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        if (e?.response?.data && typeof e?.response?.data === "string") {
          const message = e.response.data.replace(
            "Something went wrong. Error: ",
            ""
          );
          console.error(message);
          setError(message);
        } else {
          setError("Unrecognized axios error");
        }
      } else {
        console.error("Unknown error", e);
        setError("Unknown error");
      }
    }
  };

  return (
    <div>
      <h2>Add new entry</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <AddDiaryForm onSubmit={submitNewDiary} />
      <h2>Diary entries</h2>
      <DiariesList diaries={diaries} />
    </div>
  );
};

export default App;
