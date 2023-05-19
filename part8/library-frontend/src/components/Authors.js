import { useMutation, useQuery } from "@apollo/client";
import { useState } from "react";
import { ALL_AUTHORS, EDIT_AUTHOR } from "../queries";
import Select from "react-select";

const Authors = (props) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [born, setBorn] = useState("");

  const result = useQuery(ALL_AUTHORS);
  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  });

  if (!props.show) {
    return null;
  } else if (result.loading) {
    return <div>loading...</div>;
  }

  const authors = result.data.allAuthors;

  const options = authors.map((author) => ({
    value: author.name,
    label: author.name,
  }));

  const submit = (event) => {
    event.preventDefault();

    editAuthor({
      variables: { name: selectedOption.value, setBornTo: Number(born) },
    });

    setSelectedOption(null);
    setBorn("");
  };

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {props.token && (
        <>
          <h3>Set birthyear</h3>
          <form onSubmit={submit}>
            <div>
              <Select
                defaultValue={selectedOption}
                onChange={setSelectedOption}
                options={options}
              />
            </div>
            <div>
              born
              <input
                value={born}
                onChange={({ target }) => setBorn(target.value)}
              />
            </div>
            <button type="submit">update author</button>
          </form>
        </>
      )}
    </div>
  );
};

export default Authors;
