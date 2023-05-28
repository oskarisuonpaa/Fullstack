import { Diary } from "../types";

interface Props {
  diaries: Diary[];
}

const DiariesList = ({ diaries }: Props) => {
  return (
    <>
      {Object.values(diaries).map((diary: Diary) => (
        <p key={diary.id}>
          <strong>{diary.date}</strong>
          <br />
          <br />
          visibility: {diary.visibility}
          <br />
          weather: {diary.weather}
        </p>
      ))}
    </>
  );
};

export default DiariesList;
