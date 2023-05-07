import axios from "axios";

const getWeather = (lat, lon) => {
  const request = axios.get(
    `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${process.env.REACT_APP_API_KEY}`
  );
  return request.then((response) => response.data);
};

const exportObject = {
  getWeather,
};

export default exportObject;
