import axios from "axios";
const baseUrl = "/api/blogs";

let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const create = async (newBlog) => {
  const config = {
    headers: { Authorization: token },
  };

  const response = await axios.post(baseUrl, newBlog, config);
  return response.data;
};

const like = async (blog) => {
  const config = {
    headers: { Authorization: token },
  };

  const updateObject = {
    title: blog.title,
    author: blog.author,
    url: blog.url,
    likes: blog.likes + 1,
  };

  const response = await axios.put(
    `${baseUrl}/${blog.id}`,
    updateObject,
    config
  );
  return response.data;
};

const remove = async (id) => {
  const config = {
    headers: { Authorization: token },
  };

  const response = await axios.delete(`${baseUrl}/${id}`, config);
  return response.data;
};

export default { getAll, setToken, create, like, remove };
