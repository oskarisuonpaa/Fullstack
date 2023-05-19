import { useQuery } from "@apollo/client";
import { ALL_BOOKS, FAVORITE_GENRE } from "../queries";

const Recommendations = (props) => {
  const { data: { me: { favoriteGenre } = {} } = {} } =
    useQuery(FAVORITE_GENRE);
  const variables = { genre: favoriteGenre };
  const skip = favoriteGenre === undefined;
  const result = useQuery(ALL_BOOKS, { variables, skip });

  if (!props.show) {
    return null;
  } else if (result.loading) {
    return <div>loading...</div>;
  }

  const books = result.data.allBooks;

  return (
    <div>
      <h2>recommendations</h2>
      <p>
        books in your favorite genre <strong>{favoriteGenre}</strong>
      </p>
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
    </div>
  );
};

export default Recommendations;
