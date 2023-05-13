import { useState } from "react";

const Blog = ({ blog, handleLike, handleDelete }) => {
  const [showAll, setShowAll] = useState(false);

  const hideWhenShowAll = { display: showAll ? "none" : "" };
  const showWhenShowAll = { display: showAll ? "" : "none" };

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  return (
    <li className="blog" style={blogStyle}>
      <div className="simple" style={hideWhenShowAll}>
        <p>
          {blog.title} {blog.author}{" "}
          <button id="view-button" onClick={toggleShowAll}>
            view
          </button>
        </p>
      </div>
      <div className="detailed" style={showWhenShowAll}>
        <p>
          {blog.title} {blog.author}{" "}
          <button id="hide-button" onClick={toggleShowAll}>
            hide
          </button>
        </p>
        <p id="url">{blog.url}</p>
        <p id="likes">
          likes {blog.likes}{" "}
          <button id="like-button" onClick={() => handleLike(blog)}>
            like
          </button>
        </p>
        <p id="user">{blog.user.name}</p>
        <button id="delete-button" onClick={() => handleDelete(blog)}>
          remove
        </button>
      </div>
    </li>
  );
};

export default Blog;
