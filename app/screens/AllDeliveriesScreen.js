import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Button,
  ImageBackground,
  TouchableOpacity,
} from "react-native";

import { DataTable } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";

import ActivityIndicator from "../components/ActivityIndicator";
import colors from "../config/colors";
import FormField from "../components/forms/ClearFormField";
import deliveryApi from "../api/delivery";
import useApi from "../hooks/useApi";
import Form from "../components/forms/Form";
import SubmitButton from "../components/forms/SaveButton";

import * as Yup from "yup";
import Dropdown from "../components/Dropdown";

const validationSchema = Yup.object().shape({
  delivery_address: Yup.string().required().label("Delivery Address"),
  name: Yup.string().required().label("Customer Name"),
  phone_number: Yup.string().required().label("Phone Number").max(13),
  email: Yup.string().required().email().label("Email"),
  special_instructions: Yup.string().label("Special Instructions"),
});

function AllDeliveriesScreen(props) {
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState(new Date());
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [selectedEndDate, setSelectedEndDate] = useState(new Date());
  const [neighborhood, setNeighborhood] = useState("");
  const [ice, setIce] = useState({});
  const [cooler, setCooler] = useState({});
  const [loading, setLoading] = useState(true);

  const getDeliveriesApi = useApi(deliveryApi.getAll);
  const deliveries = useMemo(
    () => getDeliveriesApi.data,
    [getDeliveriesApi.data]
  );

  const ordered_array = useMemo(() => {
    return deliveries.sort(
      (a, b) => new Date(a.start_date) - new Date(b.start_date)
    );
  }, [deliveries]);

  const handleSubmit = useCallback(
    async (userInfo) => {
      const result = await deliveryApi.put(
        userInfo.id,
        userInfo.delivery_address,
        userInfo.name,
        userInfo.phone_number,
        userInfo.email,
        selectedStartDate,
        selectedEndDate,
        userInfo.special_instructions,
        cooler,
        ice,
        userInfo.neighborhood
      );
    },
    [selectedStartDate, selectedEndDate, ice, cooler]
  );

  const handleStartDateChange = useCallback((event, newDate) => {
    setShowStartDatePicker(null);
    if (newDate !== undefined) {
      setSelectedStartDate(newDate);
    }
  }, []);

  const handleEndDateChange = useCallback((event, newDate) => {
    setShowEndDatePicker(null);
    if (newDate !== undefined) {
      setSelectedEndDate(newDate);
    }
  }, []);

  const data1 = [
    { label: "40 QUART", value: 1 },
    { label: "62 QUART", value: 2 },
  ];
  const data2 = [
    { label: "LOOSE ICE", value: 1 },
    { label: "BAGGED ICE", value: 2 },
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

  const handleCallBackCooler = (childData, id) => {
    setCooler((prevState) => ({
      ...prevState,
      [id]: childData,
    }));
  };

  const handleCallBackIce = (childData, id) => {
    setIce((prevState) => ({
      ...prevState,
      [id]: childData,
    }));
  };

  const handleCallBackNeighborhood = (childData, id) => {
    setNeighborhood((prevState) => ({
      ...prevState,
      [id]: childData,
    }));
  };

  useEffect(() => {
    getDeliveriesApi.request();

    const defaultIce = {};
    const defaultCooler = {};
    ordered_array.forEach((delivery) => {
      defaultIce[delivery.id] = delivery.ice_type;
      defaultCooler[delivery.id] = delivery.cooler_size;
    });
    setIce(defaultIce);
    setCooler(defaultCooler);
    async function getState() {
      await new Promise.all([
        ordered_array.forEach((value) => {
          setCooler((prevState) => ({
            ...prevState,
            [value.id]: value.cooler_size,
          }));
          setIce((prevState) => ({
            ...prevState,
            [value.id]: value.ice_type,
          }));
          setSelectedEndDate((prevState) => ({
            ...prevState,
            [value.id]: new Date(
              new Date(value.end_date).setDate(
                new Date(value.end_date).getDate() + 1
              )
            ),
          }));
          setSelectedStartDate((prevState) => ({
            ...prevState,
            [value.id]: new Date(
              new Date(value.start_date).setDate(
                new Date(value.start_date).getDate() + 1
              )
            ),
          }));
        }),
      ]);
      setLoading(false);
    }

    getState();
  }, []);

  if (loading) {
    return <ActivityIndicator visible={loading} />;
  }

  const table = ordered_array.map(
    (data) => (
      // loading ? (
      //   <ActivityIndicator visible={loading} />
      // ) : (
      <DataTable.Row key={data.id}>
        <Form
          initialValues={{
            id: `${data.id}`,
            delivery_address: `${data.delivery_address}`,
            name: `${data.customer_name}`,
            phone_number: `${data.customer_phone}`,
            email: `${data.customer_email}`,
            special_instructions: `${data.special_instructions}`,
            cooler: `${data.cooler_size}`,
            ice_type: `${data.ice_type}`,
            neighborhood: `${data.neighborhood}`,
          }}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          <View style={styles.dateContainer}>
            <TouchableOpacity
              onPress={() => setShowStartDatePicker(true)}
              style={styles.dateInput}
            >
              <Text>hello</Text>
            </TouchableOpacity>
            {showStartDatePicker && (
              <DateTimePicker
                value={selectedStartDate}
                mode="date"
                display="default"
                onChange={handleStartDateChange}
              />
            )}
            <View style={styles.separator} />
            <TouchableOpacity
              onPress={() => setShowEndDatePicker(true)}
              style={styles.dateInput}
            >
              <Text>hello</Text>
            </TouchableOpacity>
            {showEndDatePicker && (
              <DateTimePicker
                value={selectedEndDate}
                mode="date"
                display="default"
                onChange={handleEndDateChange}
              />
            )}
          </View>
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
          <Dropdown
            style={styles.dropdown}
            data={data1}
            placeholder={cooler[data.id]}
            onParentCallback={handleCallBackCooler}
          ></Dropdown>
          <Dropdown
            data={data2}
            style={styles.dropdown}
            placeholder={ice[data.id]}
            onParentCallback={handleCallBackIce}
          ></Dropdown>
          <SubmitButton style={styles.button} title="SAVE" />
        </Form>
      </DataTable.Row>
    )
    // )
  );

  return (
    <>
      <ActivityIndicator visible={loading} />
      <ImageBackground
        source={require("../assets/textured-background.webp")}
        resizeMode="cover"
        style={styles.image}
      >
        <ScrollView showsVerticalScrollIndicator={false} horizontal>
          <View style={styles.body}>
            {getDeliveriesApi.error && (
              <>
                <Text>Couldn't retrieve the deliveries.</Text>
                <Button title="Retry" onPress={getDeliveriesApi.request} />
              </>
            )}
          </View>
          {deliveries.length == 0 ? (
            <Text style={styles.noEvents}>No deliveries</Text>
          ) : (
            <DataTable style={styles.container}>
              <DataTable.Header style={styles.tableHeader}>
                <DataTable.Title style={styles.startDateHeader}>
                  Start Date
                </DataTable.Title>
                <DataTable.Title style={styles.tableHead}>
                  End Date
                </DataTable.Title>
                <DataTable.Title>Name</DataTable.Title>
                <DataTable.Title>Phone</DataTable.Title>
                <DataTable.Title>Email</DataTable.Title>
                <DataTable.Title>Address</DataTable.Title>
                <DataTable.Title>Cooler</DataTable.Title>
                <DataTable.Title>Ice type</DataTable.Title>
              </DataTable.Header>
              {table}
            </DataTable>
          )}
        </ScrollView>
      </ImageBackground>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  dropdown: {
    minWidth: 135,
    maxWidth: 135,
    backgroundColor: colors.white,
    borderRadius: 0,
    // height: 40,
  },
  dateContainer: {
    backgroundColor: colors.white,
    flexDirection: "row",
    paddingRight: 25,
    alignItems: "center",
    width: 200,
  },
  tableHeader: {
    backgroundColor: colors.grey,
    // justifyContent: "space-evenly",
    // marginLeft: 10,
  },
  image: {
    flex: 1,
  },
  formField: {
    width: 200,
  },
  separator: {
    width: 25,
  },
});

export default AllDeliveriesScreen;
