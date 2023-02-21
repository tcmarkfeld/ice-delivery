import client from "./client";

const login = (email, password) =>
  client.get(`/api/auth/user/login/${email}/${password}`);

export default {
  login,
};
