import Country from "./Country";

const Countries = ({ countries, filter, setFilter }) => {
  const countriesToShow = filter
    ? countries.filter((country) =>
        country.name.common.toLowerCase().includes(filter.toLowerCase())
      )
    : countries;

  const handleShow = (name) => {
    setFilter(name);
  };

  const countriesList = countriesToShow.map((country) => (
    <p key={country.name.common}>
      {country.name.common}{" "}
      <button onClick={() => handleShow(country.name.common)}>show</button>
    </p>
  ));

  if (countriesToShow.length > 10) {
    return <p>Too many matches, specify another filter</p>;
  } else if (countriesToShow.length > 1) {
    return <>{countriesList}</>;
  } else {
    return <Country country={countriesToShow[0]} />;
  }
};

export default Countries;
