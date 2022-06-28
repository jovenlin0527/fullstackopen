import { useState } from 'react'
const Header = ({text}) => (<h1>{text}</h1>)

const Button = ({onClick, text}) => (
  <button onClick={onClick}>
    {text}
  </button>
)

const StatisticLine = ({text, value}) => (
  <tr>
    <td>{text}</td><td>{value}</td>
  </tr>
)

const Table = ({entries}) => {
  const rows = Array.from(entries).map(([k, v]) => (
    <StatisticLine id={k} text={k} value={v} />
  ));
  return (
    <table>
      <tbody>
        {rows}
      </tbody>
    </table>
  )

}

const Statistics = ({stats}) => {
  const {good, neutral, bad} = stats;
  let all = good + neutral + bad;
  if (all === 0) {
    return (
      <div>
        <Header text="Statistics" />
        <p> No feedback given </p>
      </div>
    )
  }
  let average = (good - bad) / 3;
  let positive = (good / all * 100).toString() + '%';
  let entries = new Map();
  entries.set("good", good);
  entries.set("neutral", neutral);
  entries.set("bad", bad);
  entries.set("all", all);
  entries.set("average", average);
  entries.set("positive", positive);
  return (
    <div>
      <Header text="Statistics" />
      <Table entries={entries} />
    </div>
  )

}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <div>
        <Header text="give feedback" />
        <div>
          <Button onClick={() => setGood(good + 1)} text="good" />
          <Button onClick={() => setNeutral(neutral + 1)} text="neutral" />
          <Button onClick={() => setBad(bad + 1)} text="bad" />
        </div>
      </div>
      <Statistics stats={{good: good, neutral: neutral, bad: bad}} />
    </div>
  )
}

export default App
