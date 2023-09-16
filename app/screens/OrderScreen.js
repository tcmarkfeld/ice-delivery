import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Alert,
  Platform,
} from "react-native";

import DateTimePicker from "@react-native-community/datetimepicker";
import * as Yup from "yup";

import useApi from "../hooks/useApi";
import deliveryApi from "../api/delivery";
import ActivityIndicator from "../components/ActivityIndicator";
import colors from "../config/colors";
import FormField from "../components/forms/FormField";
import Dropdown from "../components/Dropdown";
import Form from "../components/forms/Form";
import SubmitButton from "../components/forms/SubmitButton";
import { ScrollView } from "react-native-gesture-handler";
import AppButton from "../components/Button";
import {
  coolerData,
  iceData,
  neighborhoodData,
  timeData,
} from "../components/Constants";

const nameRegExp = /^(?!.{126,})([\w+]{1,}\s+[\w+]{1,} ?)$/;

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
  cooler_num: Yup.string().required().label("Cooler Number"),
  bag_limes: Yup.string().required().label("Limes"),
  bag_lemons: Yup.string().required().label("Lemons"),
  bag_oranges: Yup.string().required().label("Oranges"),
  marg_salt: Yup.string().required().label("Marg Salt"),
  tip: Yup.string().required().label("Tip"),
  time: Yup.number().min(1).max(12).required().label("Time"),
});

function OrderScreen({ navigation, route }) {
  const [loading, setLoading] = useState(true);
  const [selectedDateStart, setSelectedDateStart] = useState(new Date());
  const [selectedDateEnd, setSelectedDateEnd] = useState(new Date());
  const [showDatePickerStart, setShowDatePickerStart] = useState(false);
  const [showDatePickerEnd, setShowDatePickerEnd] = useState(false);
  const [neighborhood, setNeighborhood] = useState();
  const [ice, setIce] = useState();
  const [cooler, setCooler] = useState();

  const getDelivery = useApi(deliveryApi.getOne);
  const deleteDelivery = useApi(deliveryApi.deleteOne);
  const delivery = getDelivery.data;

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

  function getValueLabel(value) {
    const item = data3.find((obj) => obj.value === value);
    if (item) {
      if (!isNaN(neighborhood)) {
        setNeighborhood(item.label);
      }
    }
  }

  const fetchDelivery = async () => {
    const result = await getDelivery.request(route.params.id);
    setSelectedDateStart(new Date(result.data[0].start_date));
    setSelectedDateEnd(new Date(result.data[0].end_date));
    setCooler(result.data[0].cooler_size);
    setNeighborhood(result.data[0].neighborhood);
    setIce(result.data[0].ice_type);
    await getValueLabel(parseInt(neighborhood));
    setLoading(false);
  };

  useEffect(() => {
    fetchDelivery();
  }, []);

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

  if (loading) {
    return <ActivityIndicator visible={loading} />;
  }

  const data = delivery[0];

  const handleSubmit = async (userInfo) => {
    const result = await deliveryApi.put(
      userInfo.id,
      userInfo.delivery_address,
      userInfo.name,
      userInfo.phone_number,
      userInfo.email,
      selectedDateStart,
      selectedDateEnd,
      userInfo.special_instructions,
      userInfo.cooler.label,
      userInfo.ice.label,
      userInfo.neighborhood.value.toString(),
      userInfo.cooler_num,
      userInfo.bag_limes,
      userInfo.bag_lemons,
      userInfo.bag_oranges,
      userInfo.marg_salt,
      userInfo.tip,
      userInfo.time,
      userInfo.timeam.label
    );
    navigation.navigate("All Deliveries");
  };

  const confirmDelete = async () => {
    Alert.alert(
      "Confirm",
      "Are you sure you would like to delete this reservation?", // <- this part is optional, you can pass an empty string
      [
        {
          text: "Cancel",
          onPress: () => {},
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            deleteDelivery.request(route.params.id);
            navigation.navigate("All Deliveries");
            Alert.alert("Success", "Reservation deleted. Refresh page.");
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleCallBackCooler = (childData) => {
    setCooler(childData);
  };

  const handleCallBackIce = (childData) => {
    setIce(childData);
  };

  const handleCallBackNeighborhood = (childData) => {
    setNeighborhood(childData);
  };

  const handleCallBackTime = (childData) => {
    console.log(childData);
    setTimeAm(childData);
  };

  const data1 = [
    { label: "40 QUART", value: 1 },
    { label: "62 QUART", value: 2 },
  ];
  const data2 = [
    { label: "LOOSE ICE", value: 1 },
    { label: "BAGGED ICE", value: 2 },
  ];

  var initialCooler;
  if (data.cooler_size === "40 QUART") {
    initialCooler = {
      label: data.cooler_size,
      value: 1,
    };
  } else {
    initialCooler = {
      label: data.cooler_size,
      value: 2,
    };
  }
  var initialIce;
  if (data.ice_type === "LOOSE ICE") {
    initialIce = {
      label: data.ice_type,
      value: 1,
    };
  } else {
    initialIce = {
      label: data.ice_type,
      value: 2,
    };
  }
  const initialNeighborhood = {
    label: data.neighborhood_name,
    value: data.neighborhood_id,
  };

  var initialTime;
  if (data.dayornight === "AM") {
    initialTime = {
      label: data.dayornight,
      value: 1,
    };
  } else {
    initialTime = {
      label: data.dayornight,
      value: 2,
    };
  }

  return (
    <>
      <ActivityIndicator loading={loading} />
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : -220}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.container}
        >
          <View style={{ flexDirection: "row" }}>
            {/* Container for Start & End Date */}
            <View style={styles.dateFields}>
              <Text
                style={{
                  color: colors.medium,
                  textAlign: "center",
                  marginBottom: 5,
                }}
              >
                Start Date
              </Text>
              {Platform.OS === "android" ? (
                <TouchableOpacity onPress={() => setShowDatePickerStart(true)}>
                  <Text style={{ color: colors.medium }}>
                    {selectedDateStart.toLocaleString().slice(0, 10)}
                  </Text>
                  {showDatePickerStart && (
                    <DateTimePicker
                      value={selectedDateStart}
                      accentColor={colors.primary}
                      timeZoneOffsetInMinutes={1}
                      mode="date"
                      display="default"
                      onChange={handleStartDateChange}
                    />
                  )}
                </TouchableOpacity>
              ) : (
                <View style={{ marginRight: 20 }}>
                  <DateTimePicker
                    value={selectedDateStart}
                    accentColor={colors.primary}
                    timeZoneOffsetInMinutes={1}
                    mode="date"
                    display="default"
                    onChange={handleStartDateChange}
                  />
                </View>
              )}
            </View>
            <View style={{ width: "5%" }}></View>
            <View style={styles.dateFields}>
              <Text
                style={{
                  color: colors.medium,
                  textAlign: "center",
                  marginBottom: 5,
                }}
              >
                End Date
              </Text>
              {Platform.OS === "android" ? (
                <TouchableOpacity onPress={() => setShowDatePickerEnd(true)}>
                  <Text style={{ color: colors.medium }}>
                    {selectedDateEnd.toLocaleString().slice(0, 10)}
                  </Text>
                  {showDatePickerEnd && (
                    <DateTimePicker
                      accentColor={colors.primary}
                      value={selectedDateEnd}
                      timeZoneOffsetInMinutes={1}
                      mode="date"
                      display="default"
                      onChange={handleEndDateChange}
                    />
                  )}
                </TouchableOpacity>
              ) : (
                <View style={{ marginRight: 20 }}>
                  <DateTimePicker
                    accentColor={colors.primary}
                    value={selectedDateEnd}
                    timeZoneOffsetInMinutes={1}
                    mode="date"
                    display="default"
                    onChange={handleEndDateChange}
                  />
                </View>
              )}
            </View>
          </View>

          {/* Container for Customer Information */}
          <View style={styles.customerContainer}>
            <Form
              initialValues={{
                id: `${route.params.id}`,
                delivery_address: `${data.delivery_address}`,
                name: `${data.customer_name}`,
                phone_number: `${data.customer_phone}`,
                email: `${data.customer_email}`,
                special_instructions: `${data.special_instructions}`,
                cooler: initialCooler,
                ice: initialIce,
                neighborhood: initialNeighborhood,
                cooler_num: `${data.cooler_num}`,
                bag_limes: `${data.bag_limes}`,
                bag_lemons: `${data.bag_lemons}`,
                bag_oranges: `${data.bag_oranges}`,
                marg_salt: `${data.marg_salt}`,
                tip: `${data.tip}`,
                time: `${data.deliverytime}`,
                timeam: initialTime,
              }}
              onSubmit={handleSubmit}
              validationSchema={validationSchema}
            >
              <View style={{ flexDirection: "row", justifyContent: "center" }}>
                <FormField
                  width={"47.5%"}
                  autoCapitalize="words"
                  autoCorrect={false}
                  name="name"
                  placeholder="Customer Name"
                  icon="account-circle-outline"
                  label="Customer Name"
                />
                <View style={{ width: "5%" }}></View>
                <FormField
                  width={"47.5%"}
                  autoCorrect={false}
                  name="phone_number"
                  placeholder="Phone Number"
                  keyboardType="numbers-and-punctuation"
                  returnKeyType="done"
                  icon="phone"
                  label="Phone Number"
                />
              </View>
              <FormField
                autoCapitalize="words"
                autoCorrect={false}
                name="delivery_address"
                placeholder="Delivery Address"
                icon="map-marker-radius"
                label="Delivery Address"
              />

              <View flexDirection={"row"}>
                <View style={{ width: "47.5%" }}>
                  <Dropdown
                    data={coolerData}
                    placeholder={cooler}
                    onParentCallback={handleCallBackCooler}
                    label="Cooler Size"
                    icon="air-humidifier"
                    name={"cooler"}
                  ></Dropdown>
                </View>
                <View style={{ width: "5%" }}></View>
                <View style={{ width: "47.5%" }}>
                  <Dropdown
                    data={iceData}
                    placeholder={ice}
                    onParentCallback={handleCallBackIce}
                    label="Ice Type"
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
                    placeholder="Bag of Limes"
                    label="Bag of Limes"
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
                    label="Bag of Oranges"
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
                    label="Bag of Lemons"
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

              <Dropdown
                data={neighborhoodData}
                placeholder={neighborhood}
                onParentCallback={handleCallBackNeighborhood}
                label="Neighborhood"
                icon="home-group"
                name={"neighborhood"}
              ></Dropdown>

              <View flexDirection={"row"}>
                <View style={{ width: "47.5%" }}>
                  <FormField
                    autoCapitalize="none"
                    autoCorrect={false}
                    icon="clock"
                    name="time"
                    keyboardType="number-pad"
                    returnKeyType="done"
                    placeholder="Delivery Time (optnl)"
                  />
                </View>
                <View style={{ width: "5%" }}></View>
                <View style={{ width: "47.5%" }}>
                  <Dropdown
                    data={timeData}
                    placeholder={"AM/PM..."}
                    onParentCallback={handleCallBackTime}
                    icon="timer-sand"
                    name={"timeam"}
                  ></Dropdown>
                </View>
              </View>

              <FormField
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                name="email"
                placeholder="Customer Email (optional)"
                textContentType="emailAddress"
                icon="email"
                label="Customer Email"
              />
              <FormField
                autoCapitalize="words"
                autoCorrect={true}
                icon="star"
                name="special_instructions"
                placeholder="Special Instructions (optional)"
                returnKeyType="done"
                label="Special Instructions"
              />
              <View style={{ flexDirection: "row", justifyContent: "center" }}>
                <View style={{ width: "47.5%" }}>
                  <SubmitButton style={styles.submitButton} title="SAVE" />
                </View>
                <View style={{ width: "5%" }}></View>
                <View style={{ width: "47.5%" }}>
                  <AppButton
                    onPress={confirmDelete}
                    title={"Delete"}
                    color="danger"
                  />
                </View>
              </View>
            </Form>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.lightgrey,
    padding: 10,
    height: "100%",
  },
  customerContainer: {
    bottom: 10,
    width: "100%",
  },
  dateFields: {
    width: "47.5%",
    backgroundColor: colors.white,
    padding: 10,
    borderRadius: 8,
    marginVertical: 15,
  },
  dropdownStacked: {
    width: "47.5%",
  },
});

export default OrderScreen;
