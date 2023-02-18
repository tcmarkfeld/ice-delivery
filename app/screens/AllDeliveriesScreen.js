import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Button,
  RefreshControl,
} from "react-native";
import { DataTable } from "react-native-paper";

import ActivityIndicator from "../components/ActivityIndicator";
import FormField from "../components/forms/ClearFormField";
import deliveryApi from "../api/delivery";
import useApi from "../hooks/useApi";
import Form from "../components/forms/Form";
import SubmitButton from "../components/forms/SubmitButton";

import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  delivery_address: Yup.string().required().label("Delivery Address"),
  name: Yup.string().required().label("Customer Name"),
  phone_number: Yup.string().required().label("Phone Number"),
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

function AllDeliveriesScreen(props) {
  const [refreshing, setRefreshing] = useState(false);

  const getDeliveriesApi = useApi(deliveryApi.getAll);
  const deliveries = getDeliveriesApi.data;

  var ordered_array = deliveries.sort(function (a, b) {
    return new Date(a.start_date) - new Date(b.start_date);
  });

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(500).then(async () => {
      let deliveries = await getDeliveriesApi.request();
      setRefreshing(false);
    });
  }, []);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  var firstday;
  var lastday;
  function getWeek(date) {
    var curr = new Date(date); // get current date
    var first = curr.getDate() - curr.getDay() - 2; // First day is the  day of the month - the day of the week
    firstday = new Date(curr.setDate(first)).toUTCString().slice(0, 11);
    lastday = new Date(curr.setDate(curr.getDate() + 7))
      .toUTCString()
      .slice(5, 11);

    return [firstday, lastday];

    // Not really accurate (look at last date)
  }

  const handleSubmit = async (userInfo) => {
    const result = deliveryApi.put(
      userInfo.id,
      userInfo.delivery_address,
      userInfo.name,
      userInfo.phone_number,
      userInfo.email,
      userInfo.start_date,
      userInfo.end_date,
      userInfo.special_instructions,
      userInfo.cooler,
      userInfo.ice_type,
      userInfo.neighborhood
    );
  };

  const table = ordered_array.map((data) => (
    <DataTable.Row>
      <Form
        key={data.id}
        initialValues={{
          id: `${data.id}`,
          delivery_address: `${data.delivery_address}`,
          name: `${data.customer_name}`,
          phone_number: `${data.customer_phone}`,
          email: `${data.customer_email}`,
          start_date: `${data.start_date.slice(0, 10)}`,
          end_date: `${data.end_date.slice(0, 10)}`,
          special_instructions: `${data.special_instructions}`,
          cooler: `${data.cooler_size}`,
          ice_type: `${data.ice_type}`,
          neighborhood: `${data.neighborhood}`,
        }}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        {/* <DataTable.Cell style={styles.cellReg}> */}
        <FormField
          autoCapitalize="none"
          autoCorrect={false}
          name="start_date"
          placeholder="Start Date (MM-DD-YYYY)"
          returnKeyType="done"
        />
        {/* </DataTable.Cell> */}
        {/* <DataTable.Cell style={styles.cellReg}> */}
        <FormField
          autoCapitalize="none"
          autoCorrect={false}
          name="end_date"
          placeholder="End Date (MM-DD-YYYY)"
          returnKeyType="done"
        />
        {/* </DataTable.Cell> */}
        {/* <DataTable.Cell style={styles.cellReg}> */}
        <FormField
          autoCapitalize="none"
          autoCorrect={false}
          name="name"
          placeholder="Customer Name"
        />
        {/* </DataTable.Cell> */}
        {/* <DataTable.Cell style={styles.cellReg}> */}
        <FormField
          autoCorrect={false}
          name="phone_number"
          placeholder="Phone Number"
          keyboardType="numbers-and-punctuation"
          returnKeyType="done"
        />
        {/* </DataTable.Cell> */}
        {/* <DataTable.Cell style={styles.cellBig}> */}
        <FormField
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          name="email"
          placeholder="Customer Email"
          textContentType="emailAddress"
        />
        {/* </DataTable.Cell> */}
        {/* <DataTable.Cell style={styles.cellBig}> */}
        <FormField
          autoCapitalize="none"
          autoCorrect={false}
          name="delivery_address"
          placeholder="Delivery Address"
        />
        {/* </DataTable.Cell> */}
        {/* <DataTable.Cell style={styles.cellReg}> */}
        <FormField
          autoCapitalize="none"
          autoCorrect={false}
          name="cooler"
          placeholder="Cooler"
        />
        <FormField
          autoCapitalize="none"
          autoCorrect={false}
          name="ice_type"
          placeholder="Ice type"
        />
        {/* </DataTable.Cell> */}
        <DataTable.Cell style={styles.cellReg}>
          <SubmitButton style={styles.button} title="SAVE" />
        </DataTable.Cell>
      </Form>
    </DataTable.Row>
  ));

  useEffect(() => {
    getDeliveriesApi.request();
  }, []);

  return (
    <>
      <ActivityIndicator visible={getDeliveriesApi.loading} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        horizontal
      >
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
              <DataTable.Title>End Date</DataTable.Title>
              <DataTable.Title>Name</DataTable.Title>
              <DataTable.Title>Phone</DataTable.Title>
              <DataTable.Title>Email</DataTable.Title>
              <DataTable.Title>Address</DataTable.Title>
              <DataTable.Title>Cooler</DataTable.Title>
              <DataTable.Title>Ice type</DataTable.Title>
              <DataTable.Title>Save</DataTable.Title>
            </DataTable.Header>
            {table}
          </DataTable>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  tableHeader: {
    backgroundColor: "#DCDCDC",
    justifyContent: "space-evenly",
  },
  // startDateHeader: {
  //   marginLeft: 50,
  // },
  cellBig: {
    width: 210,
  },
  cellReg: {
    width: 150,
    // marginVertical: 2,
    // justifyContent: "center",
    // alignContent: "center",
  },
});

export default AllDeliveriesScreen;
