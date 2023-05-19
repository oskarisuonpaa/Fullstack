import { useQuery } from "@apollo/client";
import { useState } from "react";
import { ALL_BOOKS } from "../queries";

const Books = (props) => {
  const [filter, setFilter] = useState(null);
  const result = useQuery(ALL_BOOKS, { variables: { genre: filter } });

  if (!props.show) {
    return null;
  } else if (result.loading) {
    return <div>loading...</div>;
  }

  const books = result.data.allBooks;

  const filterButtons = () => {
    let genres = [];
    books.map((b) =>
      b.genres.forEach((genre) => {
        if (!genres.includes(genre)) {
          genres.push(genre);
        }
      })
    );

    return (
      <>
        {genres.map((genre) => (
          <button key={genre} onClick={() => setFilter(genre)}>
            {genre}
          </button>
        ))}
        <button onClick={() => setFilter(null)}>all genres</button>
      </>
    );
  };

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {filterButtons()}
    </div>
  );
};

export default Books;
