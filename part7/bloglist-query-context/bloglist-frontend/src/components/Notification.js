import { useContext } from "react";
import NotificationContext from "../NotificationContext";

const Notification = () => {
  const [notification] = useContext(NotificationContext);

  const { type, message } = notification;

  if (message === "") {
    return null;
  }

  if (type === "error") {
    return <div className="error">{message}</div>;
  } else {
    return <div className="success">{message}</div>;
  }
};

export default Notification;
