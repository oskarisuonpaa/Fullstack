import personsService from "../services/persons";

const Persons = ({ persons, setPersons, filter, setNotification }) => {
  const handleDelete = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      personsService
        .remove(id)
        .then((response) => {
          setPersons(
            persons.filter((person) => {
              return person.id !== id;
            })
          );
        })
        .catch((error) => {
          setNotification({
            type: "error",
            message: `Information of ${name} has already been removed from server`,
          });
          setTimeout(() => {
            setNotification({ type: null, message: null });
          }, 5000);
        });
    }
  };

  const personsToShow = filter
    ? persons.filter((person) =>
        person.name.toLowerCase().includes(filter.toLowerCase())
      )
    : persons;

  const personsList = personsToShow.map((person) => (
    <p key={person.id}>
      {person.name} {person.number}{" "}
      <button onClick={() => handleDelete(person.id, person.name)}>
        {" "}
        delete
      </button>
    </p>
  ));

  return <>{personsList}</>;
};

export default Persons;
