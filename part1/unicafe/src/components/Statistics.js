import StatisticLine from "./StatisticLine";

const Statistics = (props) => {
  if (props.good === 0 && props.neutral === 0 && props.bad === 0) {
    return (
      <>
        <p>No feedback given</p>
      </>
    );
  } else {
    return (
      <table>
        <tbody>
          <StatisticLine text="good" value={props.good} />
          <StatisticLine text="neutral" value={props.neutral} />
          <StatisticLine text="bad" value={props.bad} />
          <StatisticLine
            text="all"
            value={props.good + props.neutral + props.bad}
          />
          <StatisticLine
            text="average"
            value={(
              (props.good - props.bad) /
              (props.good + props.neutral + props.bad)
            ).toFixed(1)}
          />
          <StatisticLine
            text="positive"
            value={
              (
                (props.good / (props.good + props.neutral + props.bad)) *
                100
              ).toFixed(1) + " %"
            }
          />
        </tbody>
      </table>
    );
  }
};

export default Statistics;
