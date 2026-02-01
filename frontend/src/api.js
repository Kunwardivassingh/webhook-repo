import axios from "axios";

export const fetchEvents = () => {
  return axios.get("https://webhook-repo-1-3r16.onrender.com/events");
};
