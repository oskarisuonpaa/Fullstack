import Part from "./Part";

const Content = (props) => {
  const { parts } = props;

  return (
    <>
      {parts.map((part) => (
        <Part key={part.id} part={part} />
      ))}
    </>
  );
};

export default Content;
