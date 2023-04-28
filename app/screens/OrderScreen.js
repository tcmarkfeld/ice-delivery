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
import moment from "moment";

import useApi from "../hooks/useApi";
import deliveryApi from "../api/delivery";
import ActivityIndicator from "../components/ActivityIndicator";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../config/colors";
import FormField from "../components/forms/FormField";
import Dropdown from "../components/Dropdown";
import NeighborhoodDropdown from "../components/NeighborhoodDropdown";
import Form from "../components/forms/Form";
import SubmitButton from "../components/forms/SubmitButton";
import { ScrollView } from "react-native-gesture-handler";
import AppButton from "../components/Button";

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
  console.log(selectedDateStart);

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
      userInfo.neighborhood.value.toString()
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
    console.log(childData);
    setNeighborhood(childData);
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
  // const formattedDate = moment(selectedDateStart).format("YYYY/MM/DD");

  // console.log(selectedDateStart);

  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : -220}
    >
      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        <ActivityIndicator loading={getDelivery.loading} />
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
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {Platform.OS === "android" ? (
                <TouchableOpacity onPress={() => setShowDatePickerStart(true)}>
                  <Text style={{ color: colors.medium }}>
                    {selectedDateStart.toLocaleString().slice(0, 10)}
                  </Text>
                  {showDatePickerStart && (
                    <DateTimePicker
                      value={selectedDateStart}
                      mode="date"
                      display="default"
                      onChange={handleStartDateChange}
                    />
                  )}
                </TouchableOpacity>
              ) : (
                <DateTimePicker
                  value={selectedDateStart}
                  mode="date"
                  display="default"
                  onChange={handleStartDateChange}
                />
              )}
            </View>
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
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {Platform.OS === "android" ? (
                <TouchableOpacity onPress={() => setShowDatePickerEnd(true)}>
                  <Text style={{ color: colors.medium }}>
                    {selectedDateEnd.toLocaleString().slice(0, 10)}
                  </Text>
                  {showDatePickerEnd && (
                    <DateTimePicker
                      value={selectedDateEnd}
                      mode="date"
                      display="default"
                      onChange={handleEndDateChange}
                    />
                  )}
                </TouchableOpacity>
              ) : (
                <DateTimePicker
                  value={selectedDateEnd}
                  mode="date"
                  display="default"
                  onChange={handleEndDateChange}
                />
              )}
            </View>
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
                  data={data1}
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
                  data={data2}
                  placeholder={ice}
                  onParentCallback={handleCallBackIce}
                  label="Ice Type"
                  icon="cube-outline"
                  name={"ice"}
                ></Dropdown>
              </View>
            </View>

            <Dropdown
              data={data3}
              placeholder={neighborhood}
              onParentCallback={handleCallBackNeighborhood}
              label="Neighborhood"
              icon="home-group"
              name={"neighborhood"}
            ></Dropdown>
            <FormField
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              name="email"
              placeholder="Customer Email"
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
    flexDirection: "column",
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