import axios from "axios";

const baseURL = "https://restcountries.com/v3.1/all";

const getAll = () => {
  const request = axios.get(baseURL);
  return request.then((response) => response.data);
};

const exportObject = {
  getAll,
};

export default exportObject;
