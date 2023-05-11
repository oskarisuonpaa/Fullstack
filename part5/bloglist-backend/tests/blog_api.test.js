const mongoose = require("mongoose");
const supertest = require("supertest");
const helper = require("./test_helper");
const app = require("../app");
const api = supertest(app);
const Blog = require("../models/blog");

let TOKEN = "";

beforeAll(async () => {
  await api.post("/api/users").send({
    name: "Michael Scott",
    username: "Scotty",
    password: "123456",
  });

  const response = await api.post("/api/login").send(helper.userCredentials);
  TOKEN = "Bearer " + response.body.token;
});

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(helper.initialBlogs);
});

describe("when there is initially some blogs saved", () => {
  test("all blogs are returned as json", async () => {
    const response = await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
    expect(response.body).toHaveLength(helper.initialBlogs.length);
  });

  test("blogs return _id as id", async () => {
    const response = await api.get("/api/blogs");

    expect(response.body[0].id).toBeDefined();
  });
});

describe("addition of a new blog with valid token", () => {
  test("succeeds with valid data", async () => {
    const newBlog = {
      title: "Test",
      author: "Test",
      url: "Test",
      likes: 0,
    };

    await api
      .post("/api/blogs")
      .set("Authorization", TOKEN)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await helper.blogsInDB();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

    const contents = blogsAtEnd.map((blog) => blog.title);
    expect(contents).toContain(newBlog.title);
  });

  test("that with no likes defaults it to 0", async () => {
    const newBlog = {
      title: "Test",
      author: "Test",
      url: "Test",
    };

    await api
      .post("/api/blogs")
      .set("Authorization", TOKEN)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await helper.blogsInDB();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);
    expect(blogsAtEnd[blogsAtEnd.length - 1].likes).toBe(0);
  });

  test("fails with status code 400 if has no title", async () => {
    const newBlog = {
      author: "Test",
      url: "Test",
      likes: 0,
    };

    await api
      .post("/api/blogs")
      .set("Authorization", TOKEN)
      .send(newBlog)
      .expect(400);

    const blogsAtEnd = await helper.blogsInDB();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
  });

  test("fails with status code 400 if has no url", async () => {
    const newBlog = {
      title: "Test",
      author: "Test",
      likes: 0,
    };

    await api
      .post("/api/blogs")
      .set("Authorization", TOKEN)
      .send(newBlog)
      .expect(400);

    const blogsAtEnd = await helper.blogsInDB();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
  });
});

describe("deletion of a blog with valid token", () => {
  test("succeeds if id is valid", async () => {
    const newBlog = {
      title: "Test",
      author: "Test",
      url: "Test",
      likes: 0,
    };

    await api
      .post("/api/blogs")
      .set("Authorization", TOKEN)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const response = await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);

    await api
      .delete(`/api/blogs/${response.body[response.body.length - 1].id}`)
      .set("Authorization", TOKEN)
      .expect(204);

    const blogsAtEnd = await helper.blogsInDB();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);

    const contents = blogsAtEnd.map((blog) => blog.title);
    expect(contents).not.toContain(newBlog.title);
  });

  test("fails if id is invalid", async () => {
    await api
      .delete(`/api/blogs/${-1}`)
      .set("Authorization", TOKEN)
      .expect(400);

    const blogsAtEnd = await helper.blogsInDB();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
  });
});

describe("update of a blog with valid token", () => {
  test("succeeds with valid data and id", async () => {
    const update = {
      title: "React patterns",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
      likes: -1,
    };

    const response = await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);

    await api
      .put(`/api/blogs/${response.body[response.body.length - 1].id}`)
      .set("Authorization", TOKEN)
      .send(update)
      .expect(200);

    const blogsAtEnd = await helper.blogsInDB();

    const contents = blogsAtEnd.map((blog) => blog.likes);
    expect(contents).toContain(update.likes);
  });

  test("fails with valid data and invalid id", async () => {
    const update = {
      title: "React patterns",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
      likes: -1,
    };

    await api
      .put(`/api/blogs/${-1}`)
      .set("Authorization", TOKEN)
      .send(update)
      .expect(400);

    const blogsAtEnd = await helper.blogsInDB();

    const contents = blogsAtEnd.map((blog) => blog.likes);
    expect(contents).not.toContain(update.likes);
  });

  test("fails with invalid data and id", async () => {
    await api.put(`/api/blogs/${-1}`).set("Authorization", TOKEN).expect(400);
  });

  test("fails with invalid data and valid id", async () => {
    await api
      .put(
        `/api/blogs/${helper.initialBlogs[helper.initialBlogs.length - 1].id}`
      )
      .set("Authorization", TOKEN)
      .expect(400);
  });
});

describe("without valid token", () => {
  test("addition of a new blog fails", async () => {
    const newBlog = {
      title: "Test",
      author: "Test",
      url: "Test",
      likes: 0,
    };

    await api.post("/api/blogs").send(newBlog).expect(401);

    const blogsAtEnd = await helper.blogsInDB();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);

    const contents = blogsAtEnd.map((blog) => blog.title);
    expect(contents).not.toContain(newBlog.title);
  });

  test("deletion of a blog fails", async () => {
    const newBlog = {
      title: "Test",
      author: "Test",
      url: "Test",
      likes: 0,
    };

    await api
      .post("/api/blogs")
      .set("Authorization", TOKEN)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const response = await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);

    await api
      .delete(`/api/blogs/${response.body[response.body.length - 1].id}`)
      .expect(401);

    const blogsAtEnd = await helper.blogsInDB();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

    const contents = blogsAtEnd.map((blog) => blog.title);
    expect(contents).toContain(newBlog.title);
  });

  test("update of a blog fails", async () => {
    const update = {
      title: "React patterns",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
      likes: 8,
    };

    await api
      .put(`/api/blogs/${helper.initialBlogs[0].id}`)
      .send(update)
      .expect(401);

    const blogsAtEnd = await helper.blogsInDB();

    const contents = blogsAtEnd.map((blog) => blog.likes);
    expect(contents).not.toContain(update.likes);
  });
});

afterAll(async () => {
  await helper.deleteUser();
  await mongoose.connection.close();
});
