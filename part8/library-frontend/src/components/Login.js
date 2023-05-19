import { useMutation } from "@apollo/client";
import { useEffect, useState } from "react";
import { LOGIN } from "../queries";

const Login = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [login, result] = useMutation(LOGIN);

  useEffect(() => {
    if (result.data) {
      const token = result.data.login.value;
      props.setToken(token);
      localStorage.setItem("library-user-token", token);
    }
  }, [result.data]); // eslint-disable-line

  if (!props.show) {
    return null;
  }

  const submit = async (event) => {
    event.preventDefault();

    await login({ variables: { username, password } });

    setUsername("");
    setPassword("");
  };

  return (
    <form onSubmit={submit}>
      <div>
        username
        <input
          value={username}
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          value={password}
          type="password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  );
};

export default Login;
