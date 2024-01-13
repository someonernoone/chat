import axios from "axios";

let token = JSON.parse(localStorage.getItem("token"));
if (!token) {
  token = "";
}

const api = axios.create({
  baseURL: "/api/v1",
  headers: { cookies: token },
});

export default api;
