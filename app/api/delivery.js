import client from "./client";
import settings from "../config/settings";
import storage from "../auth/storage";

const baseURL = settings.apiUrl;

const token = storage.getToken();

console.log("api call");

const getTodayDeliveries = () => client.get("/api/delivery/gettoday");
const getEndingToday = () => client.get("/api/delivery/getending");
const getAll = () => client.get("/api/delivery/getall");
const getOne = (id) => client.get(`/api/delivery/${id}`);
const deleteOne = (id) => client.delete(`/api/delivery/delete/${id}`);

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
  if (!special) {
    special = "";
  }
  //create new delivery in database
  const url = baseURL + `/api/delivery/add`;
  fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "auth-token": token._z,
    },
    body: JSON.stringify({
      delivery_address: address,
      customer_name: name,
      customer_phone: phone,
      customer_email: email,
      start_date: start_date,
      end_date: end_date,
      special_instructions: special,
      cooler_size: cooler,
      ice_type: ice,
      neighborhood: neighborhood,
    }),
  }).then((response) => {
    if (response.status == 200) {
      alert("Reservation successfully added!");
    } else {
      alert("Something went wrong. Please try again");
    }
  });
};

const put = (
  id,
  delivery_address,
  customer_name,
  customer_phone,
  customer_email,
  start_date,
  end_date,
  special_instructions,
  cooler_size,
  ice_type,
  neighborhood
) => {
  const saveDeliveryURL = baseURL + `/api/delivery/edit/${id}`;
  fetch(saveDeliveryURL, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "auth-token": token._z,
    },
    body: JSON.stringify({
      id: id,
      delivery_address: delivery_address,
      customer_name: customer_name,
      customer_phone: customer_phone,
      customer_email: customer_email,
      start_date: start_date,
      end_date: end_date,
      special_instructions: special_instructions,
      cooler_size: cooler_size,
      ice_type: ice_type,
      neighborhood: neighborhood,
    }),
  }).then((response) => {
    if (response.status == 200) {
      alert("Reservation has been successfully updated!");
    } else {
      alert("Something went wrong. Please try again");
    }
  });
};

export default {
  getTodayDeliveries,
  getEndingToday,
  getAll,
  post,
  put,
  getOne,
  deleteOne,
};
