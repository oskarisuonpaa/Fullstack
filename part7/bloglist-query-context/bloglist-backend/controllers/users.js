const bcrypt = require("bcryptjs");
const User = require("../models/user");

const usersRouter = require("express").Router();

usersRouter.post("/", async (request, response) => {
  const { name, username, password } = request.body;

  if (!password) {
    return response.status(400).send({ error: "password required" });
  } else if (password.length < 3) {
    return response
      .status(400)
      .send({ error: "password has to be atleast 3 characters long" });
  }

  const user = new User({
    name,
    username,
    password: await bcrypt.hash(password, 10),
  });

  const result = await user.save();
  return response.status(201).json(result);
});

usersRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate("blogs", {
    url: 1,
    title: 1,
    author: 1,
  });
  return response.json(users);
});

module.exports = usersRouter;
