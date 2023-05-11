import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import LoginForm from "./components/LoginForm";
import BlogForm from "./components/BlogForm";
import Togglable from "./components/Togglable";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Notification from "./components/Notification";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [needsUpdate, setNeedsUpdate] = useState(true);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  const [notification, setNotification] = useState({
    type: null,
    message: null,
  });

  useEffect(() => {
    if (needsUpdate) {
      const get = async () => {
        const blogs = await blogService.getAll();
        const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes);
        setBlogs(sortedBlogs);
      };
      get();
      setNeedsUpdate(false);
    }
  }, [needsUpdate]);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
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
      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
      setNotification({
        type: "success",
        message: `logged in as ${user.username}`,
      });
      setTimeout(() => {
        setNotification({ type: null, message: null });
      }, 5000);
    } catch (exception) {
      setNotification({ type: "error", message: "wrong username or password" });
      setTimeout(() => {
        setNotification({ type: null, message: null });
      }, 5000);
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem("loggedBlogappUser");
    setUser(null);
    blogService.setToken(null);
    setNotification({
      type: "success",
      message: "logged out successfully",
    });
    setTimeout(() => {
      setNotification({ type: null, message: null });
    }, 5000);
  };

  const addBlog = async (newBlog) => {
    try {
      const returnedBlog = await blogService.create(newBlog);
      setBlogs(blogs.concat(returnedBlog));
      setNeedsUpdate(true);
      setNotification({
        type: "success",
        message: `a new blog ${newBlog.title} by ${newBlog.author} added`,
      });
      setTimeout(() => {
        setNotification({ type: null, message: null });
      }, 5000);
    } catch (error) {
      setNotification({
        type: "error",
        message: error.response.data.error,
      });
      setTimeout(() => {
        setNotification({ type: null, message: null });
      }, 5000);
    }
  };

  const handleBlogLike = async (blog) => {
    const blogObject = {
      user: blog.user.id,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url,
    };

    try {
      await blogService.update(blog.id, blogObject);
      setNeedsUpdate(true);
    } catch (exception) {
      console.log(exception);
    }
  };

  const handleBlogDelete = async (blog) => {
    if (!window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      return;
    }

    try {
      await blogService.remove(blog.id);
      setNeedsUpdate(true);
    } catch (exception) {
      console.log(exception);
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
          <Notification notification={notification} />
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
          <Notification notification={notification} />
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
