import axios from "axios";

export const fetchEvents = () => {
  return axios.get("http://localhost:5000/events");
};
