const Total = (props) => {
  const { parts } = props;
  const total = parts.map((part) => part.exercises).reduce((a, b) => a + b, 0);

  return <p>total of exercises {total}</p>;
};

export default Total;
