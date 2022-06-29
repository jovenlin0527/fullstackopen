import { useState, useEffect } from 'react'
import axios from 'axios'

const openWeatherApiKey = process.env.REACT_APP_OPEN_WEATHER_API_KEY

const getWeather = (location) => axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${openWeatherApiKey}`).then(s => s.data)

const DisplayWeather = ({weather}) => {
  const main = weather.weather[0].main;
  const description = weather.weather[0].description;
  const icon = weather.weather[0].icon;
  const iconurl = `http://openweathermap.org/img/wn/${icon}@2x.png`;
  const temperature = weather.main.temp;

  return (
    <div>
      <h3> Weather in {weather.name} </h3>
      <img src={iconurl} />
      <p> {main}: {description} </p>
      <p> temprature: {temperature} Celcius </p>
      <p> wind speed: {weather.wind.speed} m/s </p>
    </div>
  )

}

const DisplayCountry = ({country}) => {
  const [weather, setWeather] = useState(null);
  useEffect(() => {
    if(country != null){
      console.log('fired: ', country.name.common);
      getWeather(`${country.capital}`)
        .then(data => {
          console.log(`weather get: ${country.name.common}`)
          console.log(data);
          setWeather(data);
        });
    }
  }, [country && country.name.common])
  const validCountry = country ?? false;
  if (!validCountry) {
    return <></>
  }
  const languages = Object.entries(country.languages).map(([k, s]) => <li key={k}> {s} </li>)
  const weatherInfo = (weather ?? weather.name == country.capital) ? <DisplayWeather weather={weather} />: null;
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
      {weatherInfo}
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
