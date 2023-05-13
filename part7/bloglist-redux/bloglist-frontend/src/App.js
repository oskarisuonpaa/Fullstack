import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import LoginForm from "./components/LoginForm";
import BlogForm from "./components/BlogForm";
import Togglable from "./components/Togglable";
import loginService from "./services/login";
import Notification from "./components/Notification";
import { useDispatch, useSelector } from "react-redux";
import { setNotification } from "./reducers/notificationReducer";
import {
  createBlog,
  initializeBlogs,
  likeBlog,
  removeBlog,
} from "./reducers/blogReducer";
import { setUser } from "./reducers/userReducer";

const App = () => {
  const dispatch = useDispatch();
  const blogs = useSelector((state) => state.blogs);
  const user = useSelector((state) => state.user);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    dispatch(initializeBlogs());
  }, [dispatch]);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      dispatch(setUser(user));
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username,
        password,
      });
      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
      dispatch(setUser(user));
      setUsername("");
      setPassword("");
      dispatch(setNotification("success", `logged in as ${user.username}`, 5));
    } catch (exception) {
      dispatch(setNotification("error", "wrong username or password", 5));
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem("loggedBlogappUser");
    dispatch(setUser(null));
    dispatch(setNotification("success", "logged out successfully", 5));
  };

  const addBlog = async (newBlog) => {
    try {
      await dispatch(createBlog(newBlog));
      dispatch(
        setNotification(
          "success",
          `a new blog ${newBlog.title} by ${newBlog.author} added`,
          5
        )
      );
    } catch (error) {
      dispatch(setNotification("error", error.response.data.error, 5));
    }
  };

  const handleBlogLike = async (blog) => {
    try {
      dispatch(likeBlog(blog));
    } catch (error) {
      dispatch(setNotification("error", error.response.data.error, 5));
    }
  };

  const handleBlogDelete = async (blog) => {
    if (!window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      return;
    }

    try {
      dispatch(removeBlog(blog.id));
    } catch (error) {
      dispatch(setNotification("error", error.response.data.error, 5));
    }
  };

  const blogList = () => {
    return (
      <ul className="blogs">
        {blogs.map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            handleLike={handleBlogLike}
            handleDelete={handleBlogDelete}
          />
        ))}
      </ul>
    );
  };

  return (
    <div>
      {!user && (
        <div>
          <h2>log in to application</h2>
          <Notification />
          <Togglable buttonLabel="login">
            <LoginForm
              username={username}
              password={password}
              handleUsernameChange={({ target }) => setUsername(target.value)}
              handlePasswordChange={({ target }) => setPassword(target.value)}
              handleSubmit={handleLogin}
            />
          </Togglable>
        </div>
      )}
      {user && (
        <div>
          <h2>blogs</h2>
          <Notification />
          <p>
            {user.name} logged in{" "}
            <button id="logout-button" onClick={handleLogout}>
              logout
            </button>
          </p>
          <h2>create new</h2>
          <Togglable buttonLabel="create new blog">
            <BlogForm createBlog={addBlog} />
          </Togglable>
          {blogList()}
        </div>
      )}
    </div>
  );
};

export default App;
