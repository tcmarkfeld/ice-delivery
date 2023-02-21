import React, { useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Button,
  ImageBackground,
} from "react-native";
import { DataTable } from "react-native-paper";

import ActivityIndicator from "../components/ActivityIndicator";
import colors from "../config/colors";
import FormField from "../components/forms/ClearFormField";
import deliveryApi from "../api/delivery";
import useApi from "../hooks/useApi";
import Form from "../components/forms/Form";
import SubmitButton from "../components/forms/SaveButton";
import moment from "moment";

import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  delivery_address: Yup.string().required().label("Delivery Address"),
  name: Yup.string().required().label("Customer Name"),
  phone_number: Yup.string().required().label("Phone Number").max(13),
  email: Yup.string().required().email().label("Email"),
  start_date: Yup.string().required().label("Start Date"),
  end_date: Yup.string().required().label("End Date"),
  special_instructions: Yup.string().label("Special Instructions"),
});

function AllDeliveriesScreen(props) {
  const getDeliveriesApi = useApi(deliveryApi.getAll);
  const deliveries = getDeliveriesApi.data;

  var ordered_array = deliveries.sort(function (a, b) {
    return new Date(a.start_date) - new Date(b.start_date);
  });

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
    <DataTable.Row key={data.id}>
      <Form
        initialValues={{
          id: `${data.id}`,
          delivery_address: `${data.delivery_address}`,
          name: `${data.customer_name}`,
          phone_number: `${data.customer_phone}`,
          email: `${data.customer_email}`,
          start_date: `${data.start_date.slice(0, 10)}`,
          end_date: `${
            /*moment(*/ data.end_date.slice(0, 10) /*).format("MM/DD/YYYY")*/
          }`,
          special_instructions: `${data.special_instructions}`,
          cooler: `${data.cooler_size}`,
          ice_type: `${data.ice_type}`,
          neighborhood: `${data.neighborhood}`,
        }}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        <FormField
          autoCapitalize="none"
          autoCorrect={false}
          name="start_date"
          placeholder="Start Date (MM-DD-YYYY)"
          returnKeyType="done"
        />
        <FormField
          autoCapitalize="none"
          autoCorrect={false}
          name="end_date"
          placeholder="End Date (MM-DD-YYYY)"
          returnKeyType="done"
        />
        <FormField
          autoCapitalize="none"
          autoCorrect={false}
          name="name"
          placeholder="Customer Name"
        />
        <FormField
          autoCorrect={false}
          name="phone_number"
          placeholder="Phone Number"
          keyboardType="numbers-and-punctuation"
          returnKeyType="done"
        />
        <FormField
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          name="email"
          placeholder="Customer Email"
          textContentType="emailAddress"
        />
        <FormField
          autoCapitalize="none"
          autoCorrect={false}
          name="delivery_address"
          placeholder="Delivery Address"
        />
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
        <SubmitButton style={styles.button} title="SAVE" />
      </Form>
    </DataTable.Row>
  ));

  useEffect(() => {
    getDeliveriesApi.request();
  }, []);

  return (
    <>
      <ActivityIndicator visible={getDeliveriesApi.loading} />
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
  tableHeader: {
    backgroundColor: colors.grey,
    // justifyContent: "space-evenly",
    marginLeft: 10,
  },
  image: {
    flex: 1,
  },
});

export default AllDeliveriesScreen;
