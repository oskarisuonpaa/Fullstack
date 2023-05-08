import axios from "axios";

const getWeather = (lat, lon) => {
  const request = axios.get(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${process.env.REACT_APP_API_KEY}`
  );
  return request.then((response) => response.data);
};

const exportObject = {
  getWeather,
};

export default exportObject;
