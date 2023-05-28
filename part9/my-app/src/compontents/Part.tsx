interface CoursePartBase {
  name: string;
  exerciseCount: number;
}

interface CoursePartDescBase extends CoursePartBase {
  description: string;
}

interface CoursePartBasic extends CoursePartDescBase {
  kind: "basic";
}

interface CoursePartGroup extends CoursePartBase {
  groupProjectCount: number;
  kind: "group";
}

interface CoursePartBackground extends CoursePartDescBase {
  backgroundMaterial: string;
  kind: "background";
}

interface CoursePartSpecial extends CoursePartDescBase {
  requirements: string[];
  kind: "special";
}

type CoursePart =
  | CoursePartBasic
  | CoursePartGroup
  | CoursePartBackground
  | CoursePartSpecial;

const Part = ({ part }: { part: CoursePart }): JSX.Element => {
  switch (part.kind) {
    case "basic":
      return (
        <p>
          <strong>
            {part.name} {part.exerciseCount}
          </strong>
          <br />
          {part.description}
        </p>
      );
    case "group":
      return (
        <p>
          <strong>
            {part.name} {part.exerciseCount}
          </strong>
          <br />
          project exercises {part.groupProjectCount}
        </p>
      );
    case "background":
      return (
        <p>
          <strong>
            {part.name} {part.exerciseCount}
          </strong>
          <br />
          {part.description}
          <br />
          {part.backgroundMaterial}
        </p>
      );
    case "special":
      return (
        <p>
          <strong>
            {part.name} {part.exerciseCount}
          </strong>
          <br />
          {part.description}
          <br />
          required skills:{" "}
          {part.requirements.map((requirement) => requirement).join(", ")}
        </p>
      );
    default:
      return <></>;
  }
};

export default Part;
