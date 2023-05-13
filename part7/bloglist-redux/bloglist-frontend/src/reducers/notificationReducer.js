import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: { type: "", message: "" },
  reducers: {
    set(state, action) {
      state.type = action.payload.type;
      state.message = action.payload.message;
    },
    clear(state) {
      state.type = "";
      state.message = "";
    },
  },
});

export const { set, clear } = notificationSlice.actions;

export const setNotification = (type, message, time) => {
  return (dispatch) => {
    dispatch(set({ type, message }));
    setTimeout(() => {
      dispatch(clear());
    }, 1000 * time);
  };
};

export default notificationSlice.reducer;
