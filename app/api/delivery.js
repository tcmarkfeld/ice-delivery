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
  neighborhood,
  special
) => {
  if (special === "") {
    special = "none";
  }
  //create new delivery in database
  const url =
    baseURL +
    `/api/delivery/add/${cooler}/${ice}/${address}/${name}/${phone}/${email}/${start_date}/${end_date}/${neighborhood}/${special}`;
  fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  }).then((response) => {
    if (response.status == 200) {
      alert("Delivery has been successfully added");
    } else {
      alert("Something went wrong. Please try again");
    }
  });
};

export default { getTodayDeliveries, getEndingToday, getAll, post };
