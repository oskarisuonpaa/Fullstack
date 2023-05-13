/* eslint-disable indent */
import { createContext, useReducer } from "react";
import blogService from "./services/blogs";

const userReducer = (state, action) => {
  switch (action.type) {
    case "SET_USER":
      blogService.setToken(action.user.token);
      return action.user;
    case "CLEAR_USER":
      blogService.setToken(null);
      return null;
    default:
      return state;
  }
};

export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [user, userDispatch] = useReducer(userReducer, null);

  return (
    <UserContext.Provider value={[user, userDispatch]}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
