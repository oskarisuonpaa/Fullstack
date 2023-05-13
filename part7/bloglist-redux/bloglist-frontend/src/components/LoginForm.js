const loginForm = ({
  username,
  password,
  handleUsernameChange,
  handlePasswordChange,
  handleSubmit,
}) => {
  return (
    <form className="loginForm" onSubmit={handleSubmit}>
      <div>
        username{" "}
        <input id="username" value={username} onChange={handleUsernameChange} />
      </div>
      <div>
        password{" "}
        <input
          id="password"
          type="password"
          value={password}
          onChange={handlePasswordChange}
        />
      </div>
      <button id="login-button" type="submit">
        login
      </button>
    </form>
  );
};

export default loginForm;
