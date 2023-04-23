import React, { useState } from "react";
import {
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  ImageBackground,
  Button,
  Text,
  View,
} from "react-native";

import * as Yup from "yup";
import DateTimePicker from "@react-native-community/datetimepicker";

import Dropdown from "../components/Dropdown";
import Form from "../components/forms/Form";
import FormField from "../components/forms/FormField";
import SubmitButton from "../components/forms/SubmitButton";
import delivery from "../api/delivery";
import NeighborhoodDropdown from "../components/NeighborhoodDropdown";

// These are regex expressions for form validation
const nameRegExp = /^(?!.{126,})([\w+]{3,}\s+[\w+]{3,} ?)$/;

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
  special_instructions: Yup.string().label("Special Instructions"),
});

function AddDeliveryScreen(props) {
  const [neighborhood, setNeighborhood] = useState("");
  const [ice, setIce] = useState("");
  const [cooler, setCooler] = useState("");
  const [selectedDateStart, setSelectedDateStart] = useState(new Date());
  const [showDatePickerStart, setShowDatePickerStart] = useState(false);
  const [selectedDateEnd, setSelectedDateEnd] = useState(new Date());
  const [showDatePickerEnd, setShowDatePickerEnd] = useState(false);

  const handleSubmit = (userInfo) => {
    console.log("here");
    const result = delivery.post(
      cooler,
      ice,
      userInfo.delivery_address,
      userInfo.name,
      userInfo.phone_number,
      userInfo.email,
      selectedDateStart,
      selectedDateEnd,
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

  const handleStartDateChange = (event, newDate) => {
    setShowDatePickerStart(false);
    if (newDate !== undefined) {
      setSelectedDateStart(newDate);
    }
  };

  const handleStartButtonClick = () => {
    setShowDatePickerStart(true);
  };

  const handleEndDateChange = (event, newDate) => {
    setShowDatePickerEnd(false);
    if (newDate !== undefined) {
      setSelectedDateEnd(newDate);
    }
  };

  const handleEndButtonClick = () => {
    setShowDatePickerEnd(true);
  };

  return (
    <>
      <ImageBackground
        source={require("../assets/textured-background.webp")}
        resizeMode="cover"
        style={styles.image}
      >
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
              <View style={styles.dateContainer}>
                <Button title="Start Date" onPress={handleStartButtonClick} />
                {showDatePickerStart && (
                  <DateTimePicker
                    value={selectedDateStart}
                    mode="date"
                    display="default"
                    onChange={handleStartDateChange}
                  />
                )}
                <Text style={styles.selectedDate}>
                  Selected Start Date: {selectedDateStart.toLocaleDateString()}
                </Text>
                <Button title="End Date" onPress={handleEndButtonClick} />
                {showDatePickerEnd && (
                  <DateTimePicker
                    value={selectedDateEnd}
                    mode="date"
                    display="default"
                    onChange={handleEndDateChange}
                  />
                )}
                <Text style={styles.selectedDate}>
                  Selected End Date: {selectedDateEnd.toLocaleDateString()}
                </Text>
              </View>
              <FormField
                autoCapitalize="none"
                autoCorrect={false}
                icon="star"
                name="special_instructions"
                placeholder="Special Instructions (optional)"
                returnKeyType="done"
              />
              <SubmitButton style={styles.button} title="ADD DELIVERY" />
            </Form>
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    bottom: 10,
  },
  image: {
    flex: 1,
  },
  dateContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
  },
  selectedDate: {
    marginTop: 20,
  },
});

export default AddDeliveryScreen;
