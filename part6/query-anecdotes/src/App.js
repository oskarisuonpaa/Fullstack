import AnecdoteForm from "./components/AnecdoteForm";
import Notification from "./components/Notification";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { getAnecdotes, updateAnecdote } from "./requests";
import { useContext } from "react";
import NotificationContext from "./NotificationContext";

const App = () => {
  const [notification, dispatch] = useContext(NotificationContext);
  const queryClient = useQueryClient();

  const updateAnecdoteMutation = useMutation(updateAnecdote, {
    onSuccess: (anecdote) => {
      queryClient.invalidateQueries("anecdotes");
      dispatch({
        type: "SET",
        message: `anecdote '${anecdote.content}' voted`,
      });
      setTimeout(() => {
        dispatch({
          type: "CLEAR",
        });
      }, 5000);
    },
  });

  const handleVote = (anecdote) => {
    updateAnecdoteMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 });
  };

  const result = useQuery("anecdotes", getAnecdotes, { retry: 1 });

  if (result.isLoading) {
    return <div>loading data...</div>;
  } else if (result.isError) {
    return <div>anecdote service not available due to problems in server</div>;
  }

  const anecdotes = result.data;

  return (
    <NotificationContext.Provider value={[notification, dispatch]}>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm />

      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </NotificationContext.Provider>
  );
};

export default App;
