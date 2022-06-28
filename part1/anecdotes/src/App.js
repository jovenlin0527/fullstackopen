import { useState } from 'react'

const Button = ({onClick, text}) => (
  <button onClick={onClick}>
    {text}
  </button>
)

const Anecdote = ({title, text, vote}) => (
  <div>
    <h2>{title} </h2>
    <p>{text}</p>
    <p>has {vote} votes</p>
  </div>
)

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.'
  ]
   
  const randomId = () => Math.floor(Math.random() * anecdotes.length);
  const [selected, setSelected] = useState(randomId());
  const [statistics, setStatistics] = useState(anecdotes.map(() => 0));


  const voteSelected = () => {
    let copy = [...statistics];
    copy[selected] += 1;
    setStatistics(copy);
  }

  const mostVoted = statistics.reduce(([maxId, maxVote], vote, id) => {
    if (vote > maxVote) {
      return [id, vote];
    } else {
      return [maxId, maxVote]
    }
  }, [0, 0])[0];

  return (
    <div>
      <Anecdote title="Anecdote of the day" text={anecdotes[selected]} vote={statistics[selected]} />
      <Button onClick={voteSelected} text="vote" />
      <Button onClick={() => setSelected(randomId())} text="next anecdotes"/>
      <Anecdote title="Anecdote with most voteSelected" text={anecdotes[mostVoted]} vote={statistics[mostVoted]} />
    </div>
  )
}

export default App
