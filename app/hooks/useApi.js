import { useState } from "react";

export default useApi = (apiFunc) => { //parameter is the function that you want called when request function is called
  const [data, setData] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const request = async (...args) => { //request function parameters are the arguments that you eventually want to pass to the function
    setLoading(true);
    const response = await apiFunc(...args); //here is where parameters pass to the function
    setLoading(false);

    setError(!response.ok);
    setData(response.data);
    return response;
  };

  return { data, error, loading, request };
};

//EXAMPLE: edit appointment screen - wanted to get one specific appt from database
// had to pass back the appt id to controller in order to accomplish this
// when useApi was instantiated on EditAppointmentScreen, it said getapptsapi = useApi(NAME OF FUNCTION TO REQUEST ONE APPT) **not actually calling the function, just passing the name/route to it
// then when getapptsapi.request(3) was called it passed in the specific appt id as an argument
// that argument of 3 was passed to the getOneAppt function on line 10 of this file where it says ...args because apiFunc = getOneAppt = NAME OF FUNCTION TO REQUEST ONE APPT set at the instantiation of this file

//hope that helps cause we were stumped for a WHILE on passing arguments