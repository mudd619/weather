import axios from "axios"


export const getPlaces = (input_value, key) => axios.get(`https://api.geoapify.com/v1/geocode/autocomplete?text=${input_value}&apiKey=${key}`);

export const getWeather = (lat, lon, key) => axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly&appid=${key}`);