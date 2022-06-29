import { useState } from 'react'

const TextField = ({id, prompt, value, setValue}) => {
  const updateState = (event) => {
    setValue(event.target.value);
  }
  return (
    <div>
      <label htmlFor={id}>{prompt}</label>
      <input type="text" id={id} name={id} value={value} onChange={updateState} />
    </div>
  )
}

const Persons = ({persons}) => {
  const rows = persons.map(p => (
    <tr key={p.name}>
      <td> {p.name} </td>
      <td> {p.number} </td>
    </tr>
  ))
  return (
    <table>
      <tbody>
        {rows}
      </tbody>
    </table>
  )
}

const PersonForm = ({onSubmit}) => {
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const submitForm = (event) => {
    event.preventDefault();
    const newPerson = {
      name: newName,
      number: newNumber
    };
    setNewName('');
    setNewNumber('');
    onSubmit(newPerson);
  }
  return (
    <form onSubmit={submitForm}>
      <div>
        <TextField id="name" prompt="name:" value={newName} setValue={setNewName} />
        <TextField id="number" prompt="number:" value={newNumber} setValue={setNewNumber}/>
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )

}

const App = () => {
  const [persons, setPersons] = useState([
    {name: 'Arto Hellas', number: '040-123456', id: 1},
    {name: 'Ada Lovelace', number: '39-44-5323523', id: 2},
    {name: 'Dan Abramov', number: '12-43-234345', id: 3},
    {name: 'Mary Poppendieck', number: '39-23-6423122', id: 4}
  ]) ;
  const [nameFilter, setNameFilter] = useState('');

  const addPerson = (newPerson) => {
    const newName = newPerson.name;
    const alreadyExists = persons.some(x => x.name === newName);
    if (alreadyExists) {
      alert(`${newName} is already added to phonebook`)
    } else {
      setPersons(persons.concat(newPerson));
    }
  };

  const personsToShow = nameFilter ? persons.filter(x => x.name.toLowerCase().includes(nameFilter.toLowerCase())) : persons;

  return (
    <div>
      <h2>Phonebook</h2>
      <TextField id="filter" prompt="filter shown: " value={nameFilter} setValue={setNameFilter}/>
      <h3>Add phone number</h3>
      <PersonForm onSubmit={addPerson} />
      <h2>Numbers</h2>
      <Persons persons={personsToShow} />
    </div>
  )
}

export default App
