const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");

const api = supertest(app);

test("blogs are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("_id as id", async () => {
  const response = await api.get("/api/blogs");

  expect(response.body[0].id).toBeDefined();
});

test("new blog is added successfully", async () => {
  const newBlog = {
    title: "Test",
    author: "Test",
    url: "Test",
    likes: 0,
  };

  const initialResponse = await api.get("/api/blogs");

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const response = await api.get("/api/blogs");

  expect(response.body).toHaveLength(initialResponse.body.length + 1);
});

test("new blog with no likes defaults to 0", async () => {
  const newBlog = {
    title: "Test",
    author: "Test",
    url: "Test",
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const response = await api.get("/api/blogs");
  expect(response.body[response.body.length - 1].likes).toBe(0);
});

test("new blog with no title responds 400", async () => {
  const newBlog = {
    author: "Test",
    url: "Test",
    likes: 0,
  };

  await api.post("/api/blogs").send(newBlog).expect(400);
});

test("new blog with no url responds 400", async () => {
  const newBlog = {
    title: "Test",
    author: "Test",
    likes: 0,
  };

  await api.post("/api/blogs").send(newBlog).expect(400);
});

test("successful delete", async () => {
  const initialResponse = await api.get("/api/blogs");

  await api
    .delete(
      `/api/blogs/${initialResponse.body[initialResponse.body.length - 1].id}`
    )
    .expect(200);

  const response = await api.get("/api/blogs");

  expect(response.body).toHaveLength(initialResponse.body.length - 1);
});

test("failed delete responds 400", async () => {
  await api.delete(`/api/blogs/${-1}`).expect(400);
});

test("successful update", async () => {
  const initialResponse = await api.get("/api/blogs");

  const update = {
    title: "Test1",
    author: "Test1",
    url: "Test1",
    likes: 1,
  };

  await api
    .put(
      `/api/blogs/${initialResponse.body[initialResponse.body.length - 1].id}`
    )
    .send(update)
    .expect(200);
});

test("failed update with object & invalid id responds 400", async () => {
  const update = {
    title: "Test1",
    author: "Test1",
    url: "Test1",
    likes: 1,
  };

  await api.put(`/api/blogs/${-1}`).send(update).expect(400);
});

test("failed update without object & invalid id responds 400", async () => {
  await api.put(`/api/blogs/${-1}`).expect(400);
});

test("failed update without object & valid id responds 400", async () => {
  const initialResponse = await api.get("/api/blogs");

  await api
    .put(
      `/api/blogs/${initialResponse.body[initialResponse.body.length - 1].id}`
    )
    .expect(400);
});

afterAll(async () => {
  await mongoose.connection.close();
});
