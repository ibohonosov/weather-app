import axios from "axios";

const API_KEY = "4de52e9e939adcbf607c467d0cae16c1";
const GEO_URL = "http://api.openweathermap.org/geo/1.0/direct";
const WEATHER_DATA_URL = "https://api.openweathermap.org/data/2.5/";

export const getGeo = (query) => {
  return axios.get(`${GEO_URL}`, {
    params: {
      q: query,
      limit: 5,
      appid: API_KEY,
    },
  });
};

export const getWeather = (lat, lon) => {
  return axios.get(`${WEATHER_DATA_URL}weather`, {
    params: {
      lat,
      lon,
      units: "metric",
      lang: "ua",
      appid: API_KEY,
    },
  });
};
export const getForecast = (lat, lon) => {
  return axios.get(`${WEATHER_DATA_URL}forecast`, {
    params: {
      lat,
      lon,
      units: "metric",
      lang: "ua",
      appid: API_KEY,
    },
  });
};
