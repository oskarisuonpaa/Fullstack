import { useEffect } from "react";
import weatherService from "../services/weather";

const Country = ({ country }) => {
  const languages = Object.values(country.languages).map((language) => (
    <li key={language}>{language}</li>
  ));

  const latlon = country.capitalInfo.latlng;

  useEffect(() => {
    weatherService
      .getWeather(latlon[0], latlon[1])
      .then((data) => console.log(data));
  });

  return (
    <>
      <h1>{country.name.common}</h1>
      <p>capital {country.capital}</p>
      <p>area {country.area}</p>
      <h2>languages:</h2>
      <ul>{languages}</ul>
      <img src={country.flags.png} alt={`The flag of ${country.name.common}`} />
    </>
  );
};

export default Country;
