import { create } from "apisauce";
import cache from "../utility/cache";
import authStorage from "../auth/storage";
import settings from "../config/settings";

const apiClient = create({
  baseURL: settings.apiUrl,
});

apiClient.addAsyncRequestTransform(async (request) => {
  console.log("api call");
  const authToken = await authStorage.getToken();
  if (!authToken) return;
  // Sends the token in a header so when you hit the api, it can verify it
  request.headers["auth-token"] = authToken;
});

const get = apiClient.get;
apiClient.get = async (url, params, axiosConfig) => {
  const response = await get(url, params, axiosConfig);
  if (
    response.data.message == "Email is invalid" ||
    response.data.message == "Password is invalid"
  ) {
    return response;
  }
  if (response.ok) {
    cache.store(url, response.data);
    return response;
  }

  const data = await cache.get(url);
  return data ? { ok: true, data } : response;
};

export default apiClient;
