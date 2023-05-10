const Blog = require("../models/blog");
const User = require("../models/user");

const initialBlogs = [
  {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
  },
  {
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
  },
  {
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
  },
  {
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
  },
  {
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
  },
  {
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
  },
];

const blogsInDB = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

const initialUsers = [
  {
    name: "Michael Chan",
    username: "Chan",
    password: "123456",
  },
  {
    name: "Edsger W. Dijkstra",
    username: "Dijkstra",
    password: "123456",
  },
  {
    name: "Robert C. Martin",
    username: "Martin",
    password: "123456",
  },
];

const usersInDB = async () => {
  const users = await User.find({});
  return users.map((user) => user.toJSON());
};

const userCredentials = {
  username: "Scotty",
  password: "123456",
};

const deleteUser = async () => {
  await User.findOneAndDelete({
    name: "Michael Scott",
    username: "Scotty",
  });
};

module.exports = {
  initialBlogs,
  blogsInDB,
  initialUsers,
  usersInDB,
  deleteUser,
  userCredentials,
};
