import React, { useState } from "react";
import {
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  View,
  TouchableOpacity,
  Platform,
} from "react-native";

import * as Yup from "yup";
import DateTimePicker from "@react-native-community/datetimepicker";

import Dropdown from "../components/Dropdown";
import NeighborhoodDropdown from "../components/NeighborhoodDropdown";
import Form from "../components/forms/Form";
import FormField from "../components/forms/FormField";
import AddressFormField from "../components/forms/AddressField";
import SubmitButton from "../components/forms/SubmitButton";
import delivery from "../api/delivery";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../config/colors";
import Text from "../components/Text";
import { coolerData, iceData, neighborhoodData } from "../components/Constants";

// These are regex expressions for form validation
const nameRegExp = /^(?!.{126,})([\w+]{1,}\s+[\w+]{1,} ?)$/;

const phoneRegExp = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4}$/im;

const validationSchema = Yup.object().shape({
  delivery_address: Yup.string().required().max(149).label("Delivery Address"),
  name: Yup.string()
    .matches(nameRegExp, "Enter first and last name (3 character min. each)")
    .required()
    .max(75)
    .label("Name"),
  phone_number: Yup.string()
    .matches(phoneRegExp, "Phone number is not valid")
    .required()
    .label("Phone Number"),
  email: Yup.string().email().max(75).label("Email"),
  special_instructions: Yup.string().max(150).label("Special Instructions"),
  cooler: Yup.object().required().label("Cooler"),
  cooler_num: Yup.number().min(1).max(10).required().label("Cooler Number"),
  ice: Yup.object().required().label("Ice Type"),
  neighborhood: Yup.object().required().label("Neighborhood"),
  bag_limes: Yup.number().min(0).max(5).required().label("Limes"),
  bag_lemons: Yup.number().min(0).max(5).required().label("Lemons"),
  bag_oranges: Yup.number().min(0).max(5).required().label("Oranges"),
  marg_salt: Yup.number().min(0).max(5).required().label("Marg Salt"),
  tip: Yup.number().min(0).required().label("Tip"),
});

function AddDeliveryScreen(props) {
  const [neighborhood, setNeighborhood] = useState();
  const [ice, setIce] = useState("");
  const [cooler, setCooler] = useState("");
  const [selectedDateStart, setSelectedDateStart] = useState(new Date());
  const [showDatePickerStart, setShowDatePickerStart] = useState(false);
  const [selectedDateEnd, setSelectedDateEnd] = useState(new Date());
  const [showDatePickerEnd, setShowDatePickerEnd] = useState(false);

  const handleSubmit = (userInfo, { resetForm }) => {
    const result = delivery.post(
      userInfo.cooler.label,
      userInfo.ice.label,
      userInfo.delivery_address,
      userInfo.name,
      userInfo.phone_number,
      userInfo.email,
      selectedDateStart,
      selectedDateEnd,
      userInfo.neighborhood.value,
      userInfo.special_instructions,
      userInfo.cooler_num,
      userInfo.bag_limes,
      userInfo.bag_lemons,
      userInfo.bag_oranges,
      userInfo.marg_salt,
      userInfo.tip
    );
    setSelectedDateStart(new Date());
    setSelectedDateEnd(new Date());

    resetForm();
  };

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
      if (
        selectedDateEnd.toISOString().slice(0, 10) ==
        new Date().toISOString().slice(0, 10)
      ) {
        setSelectedDateEnd(newDate);
      }
    }
  };

  const handleEndDateChange = (event, newDate) => {
    setShowDatePickerEnd(false);
    if (newDate !== undefined) {
      setSelectedDateEnd(newDate);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : -220}
    >
      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        <View style={{ marginBottom: 20 }}>
          <Form
            initialValues={{
              delivery_address: "",
              name: "",
              phone_number: "",
              email: "",
              special_instructions: "",
              cooler: "",
              cooler_num: "1",
              ice: "",
              neighborhood: "",
              bag_limes: "0",
              bag_lemons: "0",
              bag_oranges: "0",
              marg_salt: "0",
              tip: "0",
            }}
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
          >
            <FormField
              autoCapitalize="words"
              autoCorrect={false}
              icon="account-circle-outline"
              name="name"
              placeholder="Customer Name"
            />
            <FormField
              icon="phone"
              name="phone_number"
              placeholder="(000) 000-0000"
              keyboardType={"phone-pad"}
              returnKeyType="done"
            />
            <FormField
              autoCapitalize="words"
              autoCorrect={false}
              icon="map-marker-radius"
              name="delivery_address"
              placeholder="Delivery Address"
            />

            <View style={{ width: "100%", flexDirection: "row" }}>
              <View width={"47.5%"}>
                <Text style={styles.dateLabel}>Start Date</Text>
                <View style={styles.dateFields}>
                  <MaterialCommunityIcons
                    name="calendar-start"
                    color={colors.medium}
                    size={20}
                    style={{ marginRight: 5 }}
                  />
                  {Platform.OS === "android" ? (
                    <TouchableOpacity
                      onPress={() => setShowDatePickerStart(true)}
                    >
                      <Text style={{ color: colors.medium }}>
                        {selectedDateStart.toLocaleString().slice(0, 10)}
                      </Text>
                      {showDatePickerStart && (
                        <DateTimePicker
                          value={selectedDateStart}
                          accentColor={colors.primary}
                          mode="date"
                          display="default"
                          onChange={handleStartDateChange}
                        />
                      )}
                    </TouchableOpacity>
                  ) : (
                    <DateTimePicker
                      value={selectedDateStart}
                      accentColor={colors.primary}
                      mode="date"
                      display="default"
                      onChange={handleStartDateChange}
                    />
                  )}
                </View>
              </View>
              <View style={{ width: "5%" }}></View>
              <View width={"47.5%"}>
                <Text style={styles.dateLabel}>End Date</Text>
                <View style={styles.dateFields}>
                  <MaterialCommunityIcons
                    name="calendar-end"
                    color={colors.medium}
                    style={{ marginRight: 5 }}
                    size={20}
                  />
                  {Platform.OS === "android" ? (
                    <TouchableOpacity
                      onPress={() => setShowDatePickerEnd(true)}
                    >
                      <Text style={{ color: colors.medium }}>
                        {selectedDateEnd.toLocaleString().slice(0, 10)}
                      </Text>
                      {showDatePickerEnd && (
                        <DateTimePicker
                          value={selectedDateEnd}
                          accentColor={colors.primary}
                          mode="date"
                          display="default"
                          onChange={handleEndDateChange}
                        />
                      )}
                    </TouchableOpacity>
                  ) : (
                    <DateTimePicker
                      value={selectedDateEnd}
                      accentColor={colors.primary}
                      mode="date"
                      display="default"
                      onChange={handleEndDateChange}
                    />
                  )}
                </View>
              </View>
            </View>

            <View flexDirection={"row"}>
              <View style={{ width: "47.5%" }}>
                <Dropdown
                  data={coolerData}
                  placeholder={"Select cooler..."}
                  onParentCallback={handleCallBackCooler}
                  icon="air-humidifier"
                  name={"cooler"}
                ></Dropdown>
              </View>
              <View style={{ width: "5%" }}></View>
              <View style={{ width: "47.5%" }}>
                <Dropdown
                  data={iceData}
                  placeholder={"Select ice..."}
                  onParentCallback={handleCallBackIce}
                  icon="cube-outline"
                  name={"ice"}
                ></Dropdown>
              </View>
            </View>

            <View flexDirection={"row"}>
              <View style={{ width: "47.5%" }}>
                <FormField
                  keyboardType="number-pad"
                  icon="pound"
                  name="cooler_num"
                  placeholder="Number of Coolers"
                  returnKeyType="done"
                  label="Number of Coolers"
                />
              </View>
              <View style={{ width: "5%" }}></View>
              <View style={{ width: "47.5%" }}>
                <FormField
                  keyboardType="number-pad"
                  icon="fruit-citrus"
                  name="bag_limes"
                  placeholder="Limes"
                  label="Limes"
                  returnKeyType="done"
                />
              </View>
            </View>

            <View flexDirection={"row"}>
              <View style={{ width: "30%" }}>
                <FormField
                  keyboardType="number-pad"
                  icon="pound"
                  name="bag_oranges"
                  placeholder="Oranges"
                  label="Oranges"
                  returnKeyType="done"
                />
              </View>
              <View style={{ width: "5%" }}></View>
              <View style={{ width: "30%" }}>
                <FormField
                  keyboardType="number-pad"
                  icon="pound"
                  name="bag_lemons"
                  placeholder="Lemons"
                  label="Lemons"
                  returnKeyType="done"
                />
              </View>
              <View style={{ width: "5%" }}></View>
              <View style={{ width: "30%" }}>
                <FormField
                  keyboardType="number-pad"
                  icon="shaker"
                  name="marg_salt"
                  placeholder="Marg Salt"
                  label="Marg Salt"
                  returnKeyType="done"
                />
              </View>
            </View>

            <FormField
              keyboardType="number-pad"
              icon="currency-usd"
              name="tip"
              placeholder="Tip"
              label="Tip"
              returnKeyType="done"
            />

            <NeighborhoodDropdown
              data={neighborhoodData}
              placeholder={"Select neighborhood..."}
              value={neighborhood}
              onParentCallback={handleCallBackNeighborhood}
              icon="home-group"
              name={"neighborhood"}
            ></NeighborhoodDropdown>

            <FormField
              autoCapitalize="none"
              autoCorrect={false}
              icon="email"
              keyboardType="email-address"
              name="email"
              placeholder="Customer Email (optional)"
              textContentType="emailAddress"
            />
            <FormField
              autoCorrect={true}
              icon="star"
              name="special_instructions"
              placeholder="Special Instructions (optional)"
              returnKeyType="done"
            />
            <SubmitButton title="SAVE" />
          </Form>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    height: "100%",
    backgroundColor: colors.lightgrey,
  },
  dateFields: {
    width: "100%",
    flexDirection: "row",
    backgroundColor: colors.white,
    padding: 10,
    borderRadius: 8,
    marginVertical: 15,
    height: 55,
    alignItems: "center",
  },
  dateLabel: {
    marginLeft: 1,
    marginBottom: -5,
    marginTop: 5,
    color: colors.medium,
  },
  selectedDate: {
    marginTop: 20,
  },
});

export default AddDeliveryScreen;
