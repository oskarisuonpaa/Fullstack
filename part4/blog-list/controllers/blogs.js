const Blog = require("../models/blog");

const blogsRouter = require("express").Router();

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({});
  return response.json(blogs);
});

blogsRouter.post("/", async (request, response) => {
  if (!request.body.url || !request.body.title) {
    return response.sendStatus(400);
  }

  const blog = new Blog(request.body);
  const result = await blog.save();
  return response.status(201).json(result);
});

blogsRouter.delete("/:id", async (request, response) => {
  try {
    await Blog.findByIdAndDelete(request.params.id);
  } catch (error) {
    return response.sendStatus(400);
  }
  return response.sendStatus(200);
});

blogsRouter.put("/:id", async (request, response) => {
  if (Object.keys(request.body).length === 0) {
    return response.sendStatus(400);
  }

  const { title, author, url, likes } = request.body;

  const blog = {
    title,
    author,
    url,
    likes,
  };

  try {
    await Blog.findByIdAndUpdate(request.params.id, blog, {
      new: true,
    });
  } catch (error) {
    return response.sendStatus(400);
  }

  return response.sendStatus(200);
});

module.exports = blogsRouter;
