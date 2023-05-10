const mongoose = require("mongoose");
const supertest = require("supertest");
const helper = require("./test_helper");
const app = require("../app");
const api = supertest(app);
const User = require("../models/user");

beforeEach(async () => {
  await User.deleteMany({});
  await User.insertMany(helper.initialUsers);
});

describe("addition of a new user", () => {
  test("succeeds with valid data", async () => {
    const newUser = {
      name: "Test",
      username: "Test",
      password: "Test",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDB();
    expect(usersAtEnd).toHaveLength(helper.initialUsers.length + 1);

    const contents = usersAtEnd.map((user) => user.username);
    expect(contents).toContain(newUser.username);
  });

  test("fails if password has invalid length", async () => {
    const newUser = {
      name: "Test",
      username: "Test",
      password: "Te",
    };

    await api.post("/api/users").send(newUser).expect(400);
  });

  test("fails if no password", async () => {
    const newUser = {
      name: "Test",
      username: "Test",
    };

    await api.post("/api/users").send(newUser).expect(400);
  });

  test("fails if no username", async () => {
    const newUser = {
      name: "Test",
      password: "Test",
    };

    await api.post("/api/users").send(newUser).expect(400);
  });

  test("fails if username has invalid length", async () => {
    const newUser = {
      name: "Test",
      username: "Te",
      password: "Test",
    };

    await api.post("/api/users").send(newUser).expect(400);
  });

  test("fails if username taken", async () => {
    await api.post("/api/users").send(helper.initialUsers[0]).expect(400);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
