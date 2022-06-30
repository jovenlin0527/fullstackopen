import axios from 'axios';

const baseUrl = 'http://localhost:3001/persons';

const getPersons = () => axios.get(baseUrl).then(response => response.data);

const addPerson = (newPerson) => {
  return axios.post(baseUrl, newPerson)
    .then(response => response.data);
}

const deletePersonById = (id) => axios.delete(`${baseUrl}/${id}`);

const updatePersonById = (id, newPerson) =>
  axios.put(`${baseUrl}/${id}`, newPerson)
    .then(response => response.data);



export default {getPersons, addPerson, deletePersonById, updatePersonById}
