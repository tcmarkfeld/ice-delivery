import { useCallback, useEffect, useMemo, useState } from "react";
import { Text, StyleSheet, View, TouchableOpacity } from "react-native";

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

  const getDelivery = useApi(deliveryApi.getOne);
  const delivery = getDelivery.data;

  const fetchDelivery = async () => {
    setLoading(true);
    await getDelivery.request(route.params.id);
    setLoading(false);
  };

  useEffect(() => {
    fetchDelivery();
  }, []);

  useEffect(() => {
    if (!loading && delivery.length > 0) {
      setSelectedDateStart(new Date(delivery[0].start_date));
      setSelectedDateEnd(new Date(delivery[0].end_date));
    }
  }, [loading, delivery]);

  const handleStartDateChange = (event, newDate) => {
    if (newDate !== undefined) {
      setSelectedDateStart(newDate);
    }
  };

  const handleEndDateChange = (event, newDate) => {
    if (newDate !== undefined) {
      setSelectedDateEnd(newDate);
    }
  };

  if (loading) {
    return <ActivityIndicator visible={loading} />;
  }

  const data = delivery[0];
  console.log(data);

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
      /*cooler,
        ice,*/
      userInfo.neighborhood
    );
  };
  //     [selectedDateStart, selectedDateEnd /*ice, cooler*/]
  //   );

  return (
    <View style={styles.container}>
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
            autoCapitalize="none"
            autoCorrect={false}
            name="name"
            placeholder="Customer Name"
          />
          <FormField
            style={styles.formField}
            autoCorrect={false}
            name="phone_number"
            placeholder="Phone Number"
            keyboardType="numbers-and-punctuation"
            returnKeyType="done"
          />
          <FormField
            style={styles.formField}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            name="email"
            placeholder="Customer Email"
            textContentType="emailAddress"
          />
          <FormField
            style={styles.formField}
            autoCapitalize="none"
            autoCorrect={false}
            name="delivery_address"
            placeholder="Delivery Address"
          />
          {/* <Dropdown
            style={styles.dropdown}
            data={data1}
            placeholder={"cooler"}
            onParentCallback={handleCallBackCooler}
          ></Dropdown>
          <Dropdown
            data={data2}
            style={styles.dropdown}
            placeholder={"ice"}
            onParentCallback={handleCallBackIce}
          ></Dropdown>
          <NeighborhoodDropdown
            data={data3}
            style={styles.dropdown}
            placeholder={"enighborhood"}
            onParentCallback={handleCallBackNeighborhood}
          ></NeighborhoodDropdown> */}
          <SubmitButton style={styles.submitButton} title="SAVE" />
        </Form>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  customerContainer: {},
  dateFields: {
    flexDirection: "col",
    padding: 10,
    marginVertical: 10,
  },
});

export default OrderScreen;
