import React, { useState } from "react";
import {
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  View,
  TouchableOpacity,
} from "react-native";

import * as Yup from "yup";
import DateTimePicker from "@react-native-community/datetimepicker";

import Dropdown from "../components/Dropdown";
import Form from "../components/forms/Form";
import FormField from "../components/forms/FormField";
import SubmitButton from "../components/forms/SubmitButton";
import delivery from "../api/delivery";
import NeighborhoodDropdown from "../components/NeighborhoodDropdown";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../config/colors";
import Text from "../components/Text";

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

  const handleEndDateChange = (event, newDate) => {
    setShowDatePickerEnd(false);
    if (newDate !== undefined) {
      setSelectedDateEnd(newDate);
    }
  };

  return (
    <>
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
              autoCapitalize="words"
              autoCorrect={false}
              icon="map-marker-radius"
              name="delivery_address"
              placeholder="Delivery Address"
            />
            <FormField
              autoCapitalize="words"
              autoCorrect={false}
              icon="account-circle-outline"
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

            <View style={styles.dateFields}>
              <MaterialCommunityIcons
                name="calendar-start"
                color={colors.medium}
                style={{ marginRight: 10 }}
                size={20}
              />
              <Text style={{ color: colors.medium }}>
                Start Date:{" "}
                <DateTimePicker
                  value={selectedDateStart}
                  mode="date"
                  display="default"
                  onChange={handleStartDateChange}
                />
              </Text>
            </View>

            <View style={styles.dateFields}>
              <MaterialCommunityIcons
                name="calendar-end"
                color={colors.medium}
                style={{ marginRight: 10 }}
                size={20}
              />
              <Text style={{ color: colors.medium }}>
                End Date:{" "}
                <DateTimePicker
                  value={selectedDateEnd}
                  mode="date"
                  display="default"
                  onChange={handleEndDateChange}
                />
              </Text>
            </View>

            <FormField
              autoCapitalize="words"
              autoCorrect={true}
              icon="star"
              name="special_instructions"
              placeholder="Special Instructions (optional)"
              returnKeyType="done"
            />
            <SubmitButton title="SAVE" />
          </Form>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    bottom: 10,
  },
  dateFields: {
    backgroundColor: colors.lightgrey,
    borderRadius: 25,
    flexDirection: "row",
    padding: 15,
    marginVertical: 10,
    width: "100%",
    alignItems: "center",
  },
  selectedDate: {
    marginTop: 20,
  },
});

export default AddDeliveryScreen;
