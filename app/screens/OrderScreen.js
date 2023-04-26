import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";

import DateTimePicker from "@react-native-community/datetimepicker";
import * as Yup from "yup";

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

const validationSchema = Yup.object().shape({
  delivery_address: Yup.string().required().label("Delivery Address"),
  name: Yup.string().required().label("Customer Name"),
  phone_number: Yup.string().required().label("Phone Number").max(13),
  email: Yup.string().required().email().label("Email"),
  special_instructions: Yup.string().label("Special Instructions"),
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
    return item ? item.label : null;
  }

  const fetchDelivery = async () => {
    const result = await getDelivery.request(route.params.id);
    setSelectedDateStart(new Date(result.data[0].start_date));
    setSelectedDateEnd(new Date(result.data[0].end_date));
    setCooler(result.data[0].cooler_size);
    setNeighborhood(result.data[0].neighborhood);
    setIce(result.data[0].ice_type);
    setNeighborhood(getValueLabel(parseInt(neighborhood)));
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
      cooler,
      ice,
      neighborhood
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

  return (
    <KeyboardAvoidingView behavior="padding">
      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        <View style={{ flexDirection: "row", justifyContent: "center" }}>
          {/* Container for Start & End Date */}
          <View style={styles.dateFields}>
            <Text style={{ color: colors.medium, textAlign: "center" }}>
              Start Date:{" "}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <MaterialCommunityIcons
                name="calendar-start"
                color={colors.medium}
                style={{ marginRight: 10 }}
                size={25}
              />
              <DateTimePicker
                value={selectedDateStart}
                mode="date"
                display="default"
                onChange={handleStartDateChange}
              />
            </View>
          </View>
          <View style={styles.dateFields}>
            <Text style={{ color: colors.medium, textAlign: "center" }}>
              End Date:{" "}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <MaterialCommunityIcons
                name="calendar-end"
                color={colors.medium}
                style={{ marginRight: 10 }}
                size={25}
              />
              <DateTimePicker
                value={selectedDateEnd}
                mode="date"
                display="default"
                onChange={handleEndDateChange}
              />
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
            }}
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
          >
            <FormField
              style={styles.formField}
              autoCapitalize="words"
              autoCorrect={false}
              name="name"
              placeholder="Customer Name"
              icon="account-circle-outline"
            />
            <FormField
              style={styles.formField}
              autoCorrect={false}
              name="phone_number"
              placeholder="Phone Number"
              keyboardType="numbers-and-punctuation"
              returnKeyType="done"
              icon="phone"
            />
            <FormField
              style={styles.formField}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              name="email"
              placeholder="Customer Email"
              textContentType="emailAddress"
              icon="email"
            />
            <FormField
              style={styles.formField}
              autoCapitalize="words"
              autoCorrect={false}
              name="delivery_address"
              placeholder="Delivery Address"
              icon="map-marker-radius"
            />
            <Dropdown
              style={styles.dropdown}
              data={data1}
              placeholder={cooler}
              onParentCallback={handleCallBackCooler}
            ></Dropdown>
            <Dropdown
              data={data2}
              style={styles.dropdown}
              placeholder={ice}
              onParentCallback={handleCallBackIce}
            ></Dropdown>
            <NeighborhoodDropdown
              data={data3}
              style={styles.dropdown}
              placeholder={neighborhood}
              onParentCallback={handleCallBackNeighborhood}
            ></NeighborhoodDropdown>
            <FormField
              autoCapitalize="words"
              autoCorrect={true}
              icon="star"
              name="special_instructions"
              placeholder="Special Instructions (optional)"
              returnKeyType="done"
            />
            <SubmitButton style={styles.submitButton} title="SAVE" />
          </Form>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  customerContainer: {
    padding: 10,
    bottom: 10,
  },
  dateFields: {
    flexDirection: "col",
    padding: 10,
    marginVertical: 10,
  },
});

export default OrderScreen;
