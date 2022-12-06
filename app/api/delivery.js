import client from "./client";
import settings from "../config/settings";

const baseURL = settings.apiUrl;

const getTodayDeliveries = () => client.get("/api/delivery/gettoday");
const getEndingToday = () => client.get("/api/delivery/getending");
const getAll = () => client.get("/api/delivery/getall");

const post = (
  cooler,
  ice,
  address,
  name,
  phone,
  email,
  start_date,
  end_date,
  neighborhood
) => {
  //create new appointment in database
  const url =
    baseURL +
    `/api/delivery/add/${cooler}/${ice}/${address}/${name}/${phone}/${email}/${start_date}/${end_date}/${neighborhood}`;
  fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
};

export default { getTodayDeliveries, getEndingToday, getAll, post };
