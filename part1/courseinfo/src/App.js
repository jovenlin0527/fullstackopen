const Header = (prop) => (
  <h1> {prop.course} </h1>
)

const Part = (prop) => (
  <p>
    {prop.name} {prop.exercise}
  </p>
)

const Content = (prop) => {
  const courses = prop.courses;
  return (
    <div>
      <Part name={courses[0].name} exercise={courses[0].exercises} />
      <Part name={courses[1].name} exercise={courses[1].exercises} />
      <Part name={courses[2].name} exercise={courses[2].exercises} />
    </div>
  );
}

const Total = (prop) => {
  const total = prop.courses.reduce((total, x) => total + x.exercises, 0);
  return (
      <p>Number of exercises {total}</p>
  )
}

const App = () => {
  const course = 'Half Stack application development'
  const part1 = 'Fundamentals of React'
  const exercises1 = 10
  const part2 = 'Using props to pass data'
  const exercises2 = 7
  const part3 = 'State of a component'
  const exercises3 = 14
  const courses = [
    {name: part1, exercises: exercises1},
    {name: part2, exercises: exercises2},
    {name: part3, exercises: exercises3}
  ];

  return (
    <div>
      <Header course={course} />
      <Content courses={courses} />
      <Total courses={courses} />
    </div>
  )
}

export default App
