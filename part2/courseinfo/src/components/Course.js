import Header from "./Header";
import Content from "./Content";
import Total from "./Total";

const Course = (props) => {
  const course = props.course;
  const parts = course.parts;

  return (
    <>
      <Header course={course} />
      <Content parts={parts} />
      <Total parts={parts} />
    </>
  );
};

export default Course;
