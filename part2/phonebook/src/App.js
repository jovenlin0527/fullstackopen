import { useState, useEffect } from 'react'
import axios from 'axios'

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
  const [persons, setPersons] = useState([]);
  useEffect(() => {
    axios.get("http://localhost:3001/persons")
      .then(response => {
        setPersons(response.data);
      })
  }, [])

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
