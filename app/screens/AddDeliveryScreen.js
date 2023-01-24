import React, { useState } from "react";
import {
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  StatusBar,
  RefreshControl,
} from "react-native";

import * as Yup from "yup";

import Dropdown from "../components/Dropdown";
import ErrorMessage from "../components/forms/ErrorMessage";
import Form from "../components/forms/Form";
import FormField from "../components/forms/FormField";
import SubmitButton from "../components/forms/SubmitButton";
import delivery from "../api/delivery";
import NeighborhoodDropdown from "../components/NeighborhoodDropdown";
import AppButton from "../components/Button";

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
  special_instructions: Yup.string().label("Special Instructions"),
});

const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

function AddDeliveryScreen(props) {
  const [refreshing, setRefreshing] = useState(false);
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
      neighborhood,
      userInfo.special_instructions
    );
    setCooler("");
    setIce("");
    setNeighborhood("");
    (userInfo.delivery_address = ""),
      (userInfo.name = ""),
      (userInfo.phone_number = ""),
      (userInfo.email = ""),
      (userInfo.start_date = ""),
      (userInfo.end_date = ""),
      (userInfo.special_instructions = "");
    // setRefreshing(true);
    // wait(500).then(async () => {
    //   // setPastAppts(pastApptsList.data);
    //   setRefreshing(false);
    // });
  };

  const data1 = [
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
    { label: "Cruz Bay (Soundfront at Corolla Bay)", value: 16 },
    { label: "Monteray Shores", value: 15 },
    { label: "Buck Island", value: 14 },
    { label: "Crown Point", value: 13 },
    { label: "KLMPQ", value: 12 },
    { label: "HIJO", value: 11 },
    { label: "Section F", value: 10 },
    { label: "Currituck Club", value: 4 },
    { label: "Section D", value: 9 },
    { label: "Section C", value: 8 },
    { label: "Section B", value: 7 },
    { label: "Section A", value: 6 },
    { label: "Pine Island", value: 5 },
  ];

  const handleCallBackCooler = (childData) => {
    //parent function, dropdown passes selected item back to this function through a prop
    setCooler(childData);
  };

  const handleCallBackIce = (childData) => {
    setIce(childData);
  };

  const handleCallBackNeighborhood = (childData) => {
    setNeighborhood(childData);
  };

  const clearFields = () => {
    console.log("test");
  };

  return (
    <>
      {/* <Screen style={styles.container}> */}
      <KeyboardAvoidingView behavior="padding">
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.container}
          // refreshControl={
          //   <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          // }
        >
          <AppButton onPress={clearFields} title={"Clear Fields"}></AppButton>
          <Form
            initialValues={{
              delivery_address: "",
              name: "",
              phone_number: "",
              email: "",
              start_date: "",
              end_date: "",
              special_instructions: "",
            }}
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
          >
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
            <NeighborhoodDropdown
              data={data3}
              placeholder={"Select neighborhood..."}
              onParentCallback={handleCallBackNeighborhood}
            ></NeighborhoodDropdown>
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
              placeholder="Start Date (YYYY-MM-DD)"
              // keyboardType="numeric"
              returnKeyType="done"
            />
            <FormField
              autoCapitalize="none"
              autoCorrect={false}
              icon="calendar"
              name="end_date"
              placeholder="End Date (YYYY--MM-DD)"
              // keyboardType="numeric"
              returnKeyType="done"
            />
            <FormField
              autoCapitalize="none"
              autoCorrect={false}
              icon="star"
              name="special_instructions"
              placeholder="Special Instructions...(not required)"
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
