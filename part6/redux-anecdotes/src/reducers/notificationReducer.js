import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: "",
  reducers: {
    set(state, action) {
      return action.payload;
    },
    clear(state, action) {
      return "";
    },
  },
});

export const { set, clear } = notificationSlice.actions;

export const setNotification = (message, time) => {
  return (dispatch) => {
    dispatch(set(message));
    setTimeout(() => {
      dispatch(clear());
    }, 1000 * time);
  };
};
export default notificationSlice.reducer;
