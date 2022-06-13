import axios from "axios";
export const baseURL = process.env.REACT_APP_AXIOS_URL;
//export const baseURL = "http://192.168.1.82:8080/";
//export const baseURL = "http://sistema3c.sytes.net/"; //http://sistema3c.sytes.net/  http://192.168.1.72:8080/
export const server = axios.create({
  baseURL: baseURL + "api",
});

server.defaults.timeout = 10000;
server.defaults.timeoutErrorMessage = "timeout";
