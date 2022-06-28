
const Header = ({course}) => (
  <h1> {course} </h1>
)

const Part = ({name, exercises}) => (
  <p>
    {name} {exercises}
  </p>
)

const Content = ({parts}) => {
  const content = parts.map(x => <Part key={x.id} name={x.name} exercises={x.exercises} />)
  return (
    <div>
      {content}
    </div>
  );
}

const Total = ({parts}) => {
  const total = parts.reduce((total, x) => total + x.exercises, 0);
  return (
      <p><b>total of {total} exercises</b></p>
  )
}

const Course = ({course}) => {
  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  );
}

export default Course;
