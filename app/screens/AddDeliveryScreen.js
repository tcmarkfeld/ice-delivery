import React, { useState } from "react";
import { StyleSheet, KeyboardAvoidingView, ScrollView } from "react-native";

import * as Yup from "yup";

import Screen from "../components/Screen";
import Dropdown from "../components/Dropdown";
import ErrorMessage from "../components/forms/ErrorMessage";
import Form from "../components/forms/Form";
import FormField from "../components/forms/FormField";
import SubmitButton from "../components/forms/SubmitButton";
import delivery from "../api/delivery";

// These are regex expressions for form validation
const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const nameRegExp = /^(?!.{126,})([\w+]{3,}\s+[\w+]{3,} ?)$/;

const dateRegExp =
  /(0[1-9]|1[012])[- \-.](0[1-9]|[12][0-9]|3[01])[- \-.](19|20)\d\d/;

const validationSchema = Yup.object().shape({
  delivery_address: Yup.string().required().label("Delivery Address"),
  name: Yup.string()
    .matches(nameRegExp, "Enter first and last name (3 character min. each)")
    .required()
    .label("Customer Name"),
  phone_number: Yup.string()
    // .min(10, "Phone number must be 10 digits")
    // .max(10, "Phone number must be 10 digits")
    // .matches(phoneRegExp, "Phone number is not valid")
    .required()
    .label("Phone Number"),
  email: Yup.string().required().email().label("Email"),
  start_date: Yup.string()
    // .matches(dateRegExp, "Must be in MM.DD.YYYY format (no spaces)")
    .required()
    .label("Start Date"),
  end_date: Yup.string()
    // .matches(dateRegExp, "Must be in MM.DD.YYYY format (no spaces)")
    .required()
    .label("End Date"),
});

function AddDeliveryScreen(props) {
  const [neighborhood, setNeighborhood] = useState("");
  const [ice, setIce] = useState("");
  const [cooler, setCooler] = useState("");

  const handleSubmit = (userInfo) => {
    const result = delivery.post(
      cooler,
      ice,
      userInfo.delivery_address,
      userInfo.name,
      userInfo.phone_number,
      userInfo.email,
      userInfo.start_date,
      userInfo.end_date,
      neighborhood
    );
  };

  const data1 = [
    //flat data for types of test they can book appt for
    { label: "40 Quart", value: 1 },
    { label: "62 Quart", value: 2 },
  ];
  const data2 = [
    { label: "Loose ice", value: 1 },
    { label: "Bagged ice", value: 2 },
  ];
  const data3 = [
    { label: "Ocean Hill", value: 1 },
    { label: "Corolla Light", value: 2 },
    { label: "Whalehead", value: 3 },
    { label: "Cruz Bay", value: 4 },
    { label: "Monteray Shores", value: 5 },
    { label: "Crown Point", value: 6 },
    { label: "Currituck Club", value: 7 },
  ];

  const handleCallBackCooler = (childData) => {
    //parent function, dropdown passes selected time back to this function through a prop
    setCooler(childData);
  };

  const handleCallBackIce = (childData) => {
    //parent function, dropdown passes selected time back to this function through a prop
    setIce(childData);
  };

  const handleCallBackNeighborhood = (childData) => {
    //parent function, dropdown passes selected time back to this function through a prop
    setNeighborhood(childData);
  };

  return (
    <>
      {/* <Screen style={styles.container}> */}
      <KeyboardAvoidingView behavior="padding">
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.container}
        >
          <Form
            initialValues={{
              delivery_address: "",
              name: "",
              phone_number: "",
              email: "",
              start_date: "",
              end_date: "",
            }}
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
          >
            <ErrorMessage
              error="Invalid email and/or password."
              // visible={loginFailed}
            />
            <Dropdown
              data={data1}
              placeholder={"Select cooler size..."}
              onParentCallback={handleCallBackCooler}
            ></Dropdown>
            <Dropdown
              data={data2}
              placeholder={"Select ice type..."}
              onParentCallback={handleCallBackIce}
            ></Dropdown>
            <Dropdown
              data={data3}
              placeholder={"Select neighborhood..."}
              onParentCallback={handleCallBackNeighborhood}
            ></Dropdown>
            <FormField
              autoCapitalize="none"
              autoCorrect={false}
              icon="pin"
              name="delivery_address"
              placeholder="Delivery Address"
            />
            <FormField
              autoCapitalize="none"
              autoCorrect={false}
              icon="human-male"
              name="name"
              placeholder="Customer Name"
            />
            <FormField
              autoCorrect={false}
              icon="phone"
              name="phone_number"
              placeholder="Phone Number"
              keyboardType="numbers-and-punctuation"
              returnKeyType="done"
            />
            <FormField
              autoCapitalize="none"
              autoCorrect={false}
              icon="email"
              keyboardType="email-address"
              name="email"
              placeholder="Customer Email"
              textContentType="emailAddress"
            />
            <FormField
              autoCapitalize="none"
              autoCorrect={false}
              icon="calendar"
              name="start_date"
              placeholder="Start Date (MM.DD.YYYY)"
              // keyboardType="numeric"
              returnKeyType="done"
            />
            <FormField
              autoCapitalize="none"
              autoCorrect={false}
              icon="calendar"
              name="end_date"
              placeholder="End Date (MM.DD.YYYY)"
              // keyboardType="numeric"
              returnKeyType="done"
            />
            <SubmitButton style={styles.button} title="ADD DELIVERY" />
          </Form>
        </ScrollView>
      </KeyboardAvoidingView>
      {/* </Screen> */}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    bottom: 10,
    // top: 10,
  },
});

export default AddDeliveryScreen;
