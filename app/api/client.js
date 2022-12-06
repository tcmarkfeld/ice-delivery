import { create } from "apisauce";
import settings from "../config/settings";

const apiClient = create({
  baseURL: settings.apiUrl,
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
    return response;
  }

  return data ? { ok: true, data } : response;
};

export default apiClient;
