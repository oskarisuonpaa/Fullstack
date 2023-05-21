import { useQuery } from "@apollo/client";
import { useState } from "react";
import { ALL_BOOKS } from "../queries";

const FilterButtons = ({ books, setFilter }) => {
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

const Books = ({ books, show }) => {
  const [filter, setFilter] = useState(null);
  const result = useQuery(ALL_BOOKS, {
    variables: { genre: filter },
    skip: !filter,
  });

  if (!show) {
    return null;
  } else if (result.loading) {
    return <div>loading...</div>;
  }

  const booksToShow = filter ? result.data.allBooks : books;

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
          {booksToShow.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <FilterButtons books={books} setFilter={setFilter} />
    </div>
  );
};

export default Books;
