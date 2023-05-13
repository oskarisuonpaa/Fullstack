import { createSlice } from "@reduxjs/toolkit";
import blogService from "../services/blogs";

const userSlice = createSlice({
  name: "user",
  initialState: null,
  reducers: {
    set(state, action) {
      return (state = action.payload);
    },
  },
});

export const { set } = userSlice.actions;

export const setUser = (user) => {
  return (dispatch) => {
    dispatch(set(user));

    blogService.setToken(user.token);
  };
};

export const clearUser = () => {};

export default userSlice.reducer;
