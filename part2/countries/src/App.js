import { useState, useEffect } from 'react'
import axios from 'axios'

const DisplayCountry = ({country}) => {
  const validCountry = country ?? false;
  if (!validCountry) {
    return <></>

  }
  const languages = Object.entries(country.languages).map(([k, s]) => <li key={k}> {s} </li>)
  return (
    <article>
      <h2> {country.name.common} </h2>
      <section>
        <p> <h3> capital: {country.capital} </h3> </p>
        <p> <h3> area: {country.area} </h3> </p>
        <div>
          <h3> languages: </h3>
          <ul>
            {languages}
          </ul>
        </div>
      </section>
      <img src={country.flags.svg} alt="flag" />
    </article>
  )
}


const DisplayCountries = ({countries, setDisplayed}) => {
  const rows = countries.map(c => <p key={c.name.common}> {c.name.common} <button onClick={() => setDisplayed(c)}> Show </button> </p>);
  return (
    <div>
      {rows}
    </div>
  );
}


const countryNameIncludes = (country, filter) => {
  return country.name.common.toLowerCase().includes(filter.toLowerCase());
}

const App = () => {
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFiltered] = useState([])
  const [displayed, setDisplayed] = useState(null);
  useEffect(() => {
    axios.get('https://restcountries.com/v3.1/all').then(response => {
      console.log("Countries: ", response.data);
      setCountries(response.data);
    })

  }, [])
  const [countryFilter, setCountryFilter] = useState('');
  const updateCountryFilter = (event) => {
    const newFilter = event.target.value;
    const filtered = countries.filter(c => countryNameIncludes(c, newFilter));
    setFiltered(filtered);
    setCountryFilter(newFilter);
    if (filtered.length == 1){
      setDisplayed(filtered[0])
    } else {
      setDisplayed(null);
    }
  }

  const countryList = (filteredCountries.length > 10) ? (<p> Too many matches, specify another filter </p>):
                      (filteredCountries.length > 1) ?  <DisplayCountries countries={filteredCountries} setDisplayed={setDisplayed} />:
                      null;


  return (
    <div>
      <input type="text" value={countryFilter} onChange={updateCountryFilter} />
      {countryList}
      <DisplayCountry country={displayed} />
    </div>
  )
}

export default App
