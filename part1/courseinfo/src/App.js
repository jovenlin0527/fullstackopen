const Header = ({course}) => (
  <h1> {course} </h1>
)

const Part = ({name, exercises}) => (
  <p>
    {name} {exercises}
  </p>
)

const Content = ({parts}) => {
  const courses = parts;
  return (
    <div>
      <Part name={courses[0].name} exercises={courses[0].exercises} />
      <Part name={courses[1].name} exercises={courses[1].exercises} />
      <Part name={courses[2].name} exercises={courses[2].exercises} />
    </div>
  );
}

const Total = ({parts}) => {
  const total = parts.reduce((total, x) => total + x.exercises, 0);
  return (
      <p>Number of exercises {total}</p>
  )
}

const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
      name: 'Using props to pass data',
      exercises : 7
      },
      {
      name: 'State of a component',
      exercises : 14
      }
    ]
  };

  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  )
}

export default App
