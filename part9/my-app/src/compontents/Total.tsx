interface CoursePartProps {
  name: string;
  exerciseCount: number;
}

const Total = ({
  courseParts,
}: {
  courseParts: CoursePartProps[];
}): JSX.Element => (
  <>
    <p>
      Number of exercises{" "}
      {courseParts.reduce((carry, part) => carry + part.exerciseCount, 0)}
    </p>
  </>
);

export default Total;
