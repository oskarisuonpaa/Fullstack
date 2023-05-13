import { useState, useEffect, useContext } from "react";
import Blog from "./components/Blog";
import LoginForm from "./components/LoginForm";
import BlogForm from "./components/BlogForm";
import Togglable from "./components/Togglable";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Notification from "./components/Notification";
import NotificationContext from "./NotificationContext";
import UserContext from "./UserContext";
import { useMutation, useQuery, useQueryClient } from "react-query";

const App = () => {
  const [, notificationDispatch] = useContext(NotificationContext);
  const [user, userDispatch] = useContext(UserContext);

  const queryClient = useQueryClient();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      userDispatch({ type: "SET_USER", user });
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
      userDispatch({ type: "SET_USER", user });
      setUsername("");
      setPassword("");
      notificationDispatch({
        type: "SET",
        notification: {
          type: "success",
          message: `logged in as ${user.username}`,
        },
      });
      setTimeout(() => {
        notificationDispatch({ type: "CLEAR" });
      }, 5000);
    } catch (exception) {
      notificationDispatch({
        type: "SET",
        notification: {
          type: "error",
          message: "wrong username or password",
        },
      });
      setTimeout(() => {
        notificationDispatch({ type: "CLEAR" });
      }, 5000);
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem("loggedBlogappUser");
    userDispatch({ type: "CLEAR_USER" });
    notificationDispatch({
      type: "SET",
      notification: {
        type: "success",
        message: "logged out successfully",
      },
    });
    setTimeout(() => {
      notificationDispatch({ type: "CLEAR" });
    }, 5000);
  };

  const updateBlogMutation = useMutation(blogService.update, {
    onSuccess: () => {
      queryClient.invalidateQueries("blogs");
    },
  });

  const newBlogMutation = useMutation(blogService.create, {
    onSuccess: (blog) => {
      queryClient.invalidateQueries("blogs");
      notificationDispatch({
        type: "SET",
        notification: {
          type: "success",
          message: `a new blog ${blog.title} by ${blog.author} added`,
        },
      });
      setTimeout(() => {
        notificationDispatch({ type: "CLEAR" });
      }, 5000);
    },
    onError: (error) => {
      notificationDispatch({
        type: "SET",
        notification: {
          type: "error",
          message: error.response.data.error,
        },
      });
      setTimeout(() => {
        notificationDispatch({ type: "CLEAR" });
      }, 5000);
    },
  });

  const deleteBlogMutation = useMutation(blogService.remove, {
    onSuccess: () => {
      queryClient.invalidateQueries("blogs");
    },
    onError: (error) => {
      notificationDispatch({
        type: "SET",
        notification: {
          type: "error",
          message: error.response.data.error,
        },
      });
      setTimeout(() => {
        notificationDispatch({ type: "CLEAR" });
      }, 5000);
    },
  });

  const handleLike = (blog) => {
    updateBlogMutation.mutate({ ...blog, likes: blog.likes + 1 });
  };

  const addBlog = async (blog) => {
    newBlogMutation.mutate(blog);
  };

  const handleBlogDelete = async (blog) => {
    if (!window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      return;
    }

    deleteBlogMutation.mutate(blog.id);
  };

  const result = useQuery("blogs", blogService.getAll, { retry: 1 });

  if (result.isLoading) {
    return <div>loading data...</div>;
  } else if (result.isError) {
    return <div>bloglist service not available due to problems in server</div>;
  }

  const blogs = result.data;

  const blogList = () => {
    return (
      <ul className="blogs">
        {blogs
          .sort((a, b) => b.likes - a.likes)
          .map((blog) => (
            <Blog
              key={blog.id}
              blog={blog}
              handleLike={handleLike}
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
