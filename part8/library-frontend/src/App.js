import { useApolloClient, useQuery, useSubscription } from "@apollo/client";
import { useEffect, useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import Login from "./components/Login";
import NewBook from "./components/NewBook";
import Recommendations from "./components/Recommendations";
import { ALL_BOOKS, BOOK_ADDED } from "./queries";

export const updateCache = (cache, query, addedBook) => {
  const uniqByName = (a) => {
    let seen = new Set();
    return a.filter((item) => {
      let k = item.title;
      return seen.has(k) ? false : seen.add(k);
    });
  };
  cache.updateQuery(query, ({ allBooks }) => {
    return {
      allBooks: uniqByName(allBooks.concat(addedBook)),
    };
  });
};

const App = () => {
  const result = useQuery(ALL_BOOKS);
  const [page, setPage] = useState("authors");
  const [token, setToken] = useState(null);
  const client = useApolloClient();

  useEffect(() => {
    const token = localStorage.getItem("library-user-token");
    if (token) {
      setToken(token);
    }
  }, []);

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      const addedBook = data.data.bookAdded;
      window.alert(`${addedBook.title} added`);
      updateCache(client.cache, { query: ALL_BOOKS }, addedBook);
    },
  });

  if (token && page === "login") {
    setPage("authors");
  }

  const logout = () => {
    setPage("authors");
    setToken(null);
    localStorage.clear();
    client.resetStore();
  };

  if (result.loading) {
    return <div>loading...</div>;
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        {token && <button onClick={() => setPage("add")}>add book</button>}
        {token && (
          <button onClick={() => setPage("recommend")}>recommend</button>
        )}
        {token && <button onClick={logout}>logout</button>}
        {!token && <button onClick={() => setPage("login")}>login</button>}
      </div>

      <Authors show={page === "authors"} token={token} />
      <Books show={page === "books"} books={result.data.allBooks} />
      <NewBook show={page === "add"} />
      <Recommendations show={page === "recommend"} />
      <Login show={page === "login"} setToken={setToken} />
    </div>
  );
};

export default App;
