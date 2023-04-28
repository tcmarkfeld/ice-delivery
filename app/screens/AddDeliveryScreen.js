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
import {
  coolerData,
  iceData,
  neighborhoodData,
  corollaLight,
  sectionA,
  sectionB,
  sectionC,
  sectionD,
  sectionE,
  sectionF,
  hijo,
  klmpq,
  crownPoint,
  spinDrift,
  pineIsland,
  buckIsland,
  oceanHill,
  cruzBay,
  whalehead,
  whaleheadRight,
  monterayShores,
  currituckClub,
} from "../components/Constants";

// These are regex expressions for form validation
const nameRegExp = /^(?!.{126,})([\w+]{3,}\s+[\w+]{3,} ?)$/;

const phoneRegExp = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4}$/im;

const validationSchema = Yup.object().shape({
  delivery_address: Yup.string().required().min(5).label("Delivery Address"),
  name: Yup.string()
    .matches(nameRegExp, "Enter first and last name (3 character min. each)")
    .required()
    .label("Name"),
  phone_number: Yup.string()
    .matches(phoneRegExp, "Phone number is not valid")
    .required()
    .label("Phone Number"),
  email: Yup.string().email().label("Email"),
  special_instructions: Yup.string().label("Special Instructions"),
  cooler: Yup.object().required().label("Cooler"),
  ice: Yup.object().required().label("Ice Type"),
  neighborhood: Yup.object().required().label("Neighborhood"),
});

function AddDeliveryScreen(props) {
  const [neighborhood, setNeighborhood] = useState();
  const [ice, setIce] = useState("");
  const [cooler, setCooler] = useState("");
  const [address, setAddress] = useState("");
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
      userInfo.special_instructions
    );
    setSelectedDateStart(new Date());
    setSelectedDateEnd(new Date());

    resetForm();
  };

  const checkAddress = (str) => {
    str = str.replaceAll(/\s|[0-9]/g, "").toUpperCase();
    if (sectionA.includes(str)) {
      setNeighborhood(7);
    } else if (sectionB.includes(str)) {
      setNeighborhood(8);
    } else if (sectionC.includes(str)) {
      setNeighborhood(9);
    } else if (sectionD.includes(str)) {
      setNeighborhood(10);
    } else if (sectionE.includes(str)) {
      setNeighborhood(11);
    } else if (sectionF.includes(str)) {
      setNeighborhood(12);
    } else if (hijo.includes(str)) {
      setNeighborhood(13);
    } else if (klmpq.includes(str)) {
      setNeighborhood(14);
    } else if (crownPoint.includes(str)) {
      setNeighborhood(15);
    } else if (spinDrift.includes(str)) {
      setNeighborhood(6);
    } else if (pineIsland.includes(str)) {
      setNeighborhood(5);
    } else if (buckIsland.includes(str)) {
      setNeighborhood(16);
    } else if (oceanHill.includes(str)) {
      setNeighborhood(1);
    } else if (corollaLight.includes(str)) {
      setNeighborhood(2);
    } else if (cruzBay.includes(str)) {
      setNeighborhood(19);
    } else if (whalehead.includes(str)) {
      setNeighborhood(3);
    } else if (whaleheadRight.includes(str)) {
      setNeighborhood(18);
    } else if (monterayShores.includes(str)) {
      setNeighborhood(17);
    } else if (currituckClub.includes(str)) {
      setNeighborhood(4);
    }
  };

  const getAddress = (childData) => {
    setAddress(childData);
    checkAddress(childData);
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
              ice: "",
              neighborhood: "",
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
            <AddressFormField
              autoCapitalize="words"
              autoCorrect={false}
              icon="map-marker-radius"
              name="delivery_address"
              value={address}
              placeholder="Delivery Address"
              onParentCallback={getAddress}
            />

            <View style={{ width: "100%", flexDirection: "row" }}>
              <View width={"47.5%"}>
                <Text style={styles.dateLabel}>Start Date</Text>
                <View style={styles.dateFields}>
                  <MaterialCommunityIcons
                    name="calendar-start"
                    color={colors.medium}
                    size={20}
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
              autoCapitalize="words"
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
    color: colors.medium,
  },
  selectedDate: {
    marginTop: 20,
  },
});

export default AddDeliveryScreen;
