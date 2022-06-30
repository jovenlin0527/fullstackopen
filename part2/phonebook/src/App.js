import { useState, useEffect } from 'react'
import phonebook from './services/phonebook'
import {useNotification, NotificationCenter} from './components/Notification'

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

const Persons = ({persons, deleteId: deletePerson}) => {
  const rows = persons.map(p => (
    <tr key={p.id}>
      <td> {p.name} </td>
      <td> {p.number} </td>
      <td> <button onClick={() => deletePerson(p)}>delete</button></td>
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
  const [notifications, pushNotfication] = useNotification();

  useEffect(() => {
    phonebook.getPersons().then(data => setPersons(data));
  }, [])

  const [nameFilter, setNameFilter] = useState('');

  const pushNotice = (msg) => pushNotfication({msg, isError: false});
  const pushError = (msg) => pushNotfication({msg, isError: true});

  const addPerson = (newPerson) => {
    const newName = newPerson.name;
    const oldPerson = persons.find(x => x.name === newName);
    if (oldPerson) {
      if (window.confirm(`${newName} already exists in the phonebook. Replace the old number with the new number?`)) {
        phonebook.updatePersonById(oldPerson.id, newPerson)
          .then((newPerson) => {
            const newPersons = persons.map(p => p.name === newName ? newPerson : p);
            setPersons(newPersons);
          })
      }
    } else {
      phonebook.addPerson(newPerson)
        .then(person => {
          setPersons(persons.concat(person))
        })
    }
  };

  const deletePerson = (p) => {
    if (window.confirm(`delete ${p.name} ?`)) {
      phonebook.deletePersonById(p.id)
        .then(() => {
          const newPersons = persons.filter(x => x.id !== p.id );
          setPersons(newPersons);
        });
    }
  }

  const personsToShow = nameFilter ? persons.filter(x => x.name.toLowerCase().includes(nameFilter.toLowerCase())) : persons;

  return (
    <div>
      <h2>Phonebook</h2>
      <NotificationCenter notifications={notifications}/>
      <TextField id="filter" prompt="filter shown: " value={nameFilter} setValue={setNameFilter}/>
      <h3>Add phone number</h3>
      <PersonForm onSubmit={addPerson} />
      <h2>Numbers</h2>
      <Persons persons={personsToShow} deleteId={deletePerson}/>
    </div>
  )
}

export default App
