import { useEffect, useState } from "react";
import weatherService from "../services/weather";

const Country = ({ country }) => {
  const [weather, setWeather] = useState(null);

  const languages = Object.values(country.languages).map((language) => (
    <li key={language}>{language}</li>
  ));

  const latlon = country.capitalInfo.latlng;

  useEffect(() => {
    weatherService
      .getWeather(latlon[0], latlon[1])
      .then((data) => setWeather(data));
  });

  if (!weather) {
  } else {
    return (
      <>
        <h1>{country.name.common}</h1>
        <p>capital {country.capital}</p>
        <p>area {country.area}</p>
        <h2>languages:</h2>
        <ul>{languages}</ul>
        <img
          src={country.flags.png}
          alt={`The flag of ${country.name.common}`}
        />
        <h2>Weather in {country.capital}</h2>
        <p>temperature {weather.main.temp} Celcius</p>
        <img
          src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
          alt="Weather icon"
        />
        <p>wind {weather.wind.speed} m/s</p>
      </>
    );
  }
};

export default Country;
