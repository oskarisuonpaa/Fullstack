import { createSlice } from "@reduxjs/toolkit";
import blogService from "../services/blogs";

const blogSlice = createSlice({
  name: "blogs",
  initialState: [],
  reducers: {
    appendBlog(state, action) {
      state.push(action.payload);
      return state.sort((a, b) => b.likes - a.likes);
    },
    setBlogs(state, action) {
      state = action.payload;
      return state.sort((a, b) => b.likes - a.likes);
    },
    like(state, action) {
      const id = action.payload;
      const blogToChange = state.find((blog) => blog.id === id);
      const changedBlog = { ...blogToChange, likes: blogToChange.likes++ };
      state.map((blog) => (blog.id !== id ? blog : changedBlog));
      return state.sort((a, b) => b.likes - a.likes);
    },
    remove(state, action) {
      const id = action.payload;
      state = state.filter((blog) => blog.id !== id);
      return state.sort((a, b) => b.likes - a.likes);
    },
  },
});

export const { appendBlog, setBlogs, like, remove } = blogSlice.actions;

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll();
    dispatch(setBlogs(blogs));
  };
};

export const createBlog = (content) => {
  return async (dispatch) => {
    const newBlog = await blogService.create(content);
    dispatch(appendBlog(newBlog));
  };
};

export const likeBlog = (blog) => {
  return async (dispatch) => {
    await blogService.like(blog);
    dispatch(like(blog.id));
  };
};

export const removeBlog = (id) => {
  return async (dispatch) => {
    await blogService.remove(id);
    dispatch(remove(id));
  };
};

export default blogSlice.reducer;
