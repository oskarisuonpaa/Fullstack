const Notification = ({ notification }) => {
  const { type, message } = notification;

  if (message === null) {
    return null;
  }

  if (type === "error") {
    return <div className="error">{message}</div>;
  } else {
    return <div className="success">{message}</div>;
  }
};

export default Notification;
