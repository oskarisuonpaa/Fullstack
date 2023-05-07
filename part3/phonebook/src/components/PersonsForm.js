import { useState } from "react";
import personsService from "../services/persons";

const PersonsForm = ({ persons, setPersons, setNotification }) => {
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");

  const addPerson = (event) => {
    event.preventDefault();

    let nameTaken = false;

    for (let i = 0; i < persons.length; i++) {
      if (persons[i].name === newName) {
        nameTaken = true;
        break;
      }
    }

    if (nameTaken) {
      if (
        window.confirm(
          `${newName} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        let id = persons.find((person) => person.name === newName).id;

        personsService
          .update(id, { name: newName, number: newNumber })
          .then((returnedPerson) => {
            setPersons(
              persons.map((person) =>
                person.id !== id ? person : returnedPerson
              )
            );
            setNewName("");
            setNewNumber("");
            setNotification({ type: "success", message: "Number updated" });
            setTimeout(() => {
              setNotification({ type: null, message: null });
            }, 5000);
          });
      }
    } else {
      const personObject = { name: newName, number: newNumber };
      personsService.create(personObject).then((returnedPerson) => {
        setPersons(persons.concat(returnedPerson));
        setNewName("");
        setNewNumber("");
        setNotification({ type: "success", message: `Added ${newName}` });
        setTimeout(() => {
          setNotification({ type: null, message: null });
        }, 5000);
      });
    }
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  return (
    <form onSubmit={addPerson}>
      <div>
        name: <input value={newName} onChange={handleNameChange} />
      </div>
      <div>
        number: <input value={newNumber} onChange={handleNumberChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

export default PersonsForm;
