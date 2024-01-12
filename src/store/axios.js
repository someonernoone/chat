import axios from "axios";

let token = JSON.parse(localStorage.getItem("token"));
if (!token) {
  token = "";
}

const api = axios.create({
  baseURL: "https://d618f0ea-cae1-4bd4-954e-88acbd42a1b8-00-2xza46xilhmbu.kirk.replit.dev/api/v1",
  headers: { cookies: token },
});

export default api;
