import React, { useEffect } from "react";
import { StyleSheet, Text, View, ScrollView, Button } from "react-native";
import { DataTable } from "react-native-paper";

import ActivityIndicator from "../components/ActivityIndicator";
import DeliveryCard from "../components/DeliveryCard";
import deliveryApi from "../api/delivery";
import useApi from "../hooks/useApi";

function AllDeliveriesScreen(props) {
  const getDeliveriesApi = useApi(deliveryApi.getAll);
  const deliveries = getDeliveriesApi.data;

  var ordered_array = deliveries.sort(function (a, b) {
    return parseFloat(a.start_date) - parseFloat(b.start_date);
    // Not working right now
  });

  const table = ordered_array.map((data) => (
    <DataTable.Row>
      <DataTable.Cell style={styles.cellName}>
        {data.start_date.slice(0, 10)}
      </DataTable.Cell>
      <DataTable.Cell style={styles.cellName}>
        {data.end_date.slice(0, 10)}
      </DataTable.Cell>
      <DataTable.Cell style={styles.cellName}>
        {data.customer_name}
      </DataTable.Cell>
      <DataTable.Cell style={styles.cellName}>
        {data.customer_phone}
      </DataTable.Cell>
      <DataTable.Cell style={styles.cellName}>
        {data.customer_email}
      </DataTable.Cell>
      <DataTable.Cell style={styles.cellName}>
        {data.delivery_address}
      </DataTable.Cell>
      <DataTable.Cell style={styles.cellName}>
        {data.cooler_size} {data.ice_type.toLowerCase()}
      </DataTable.Cell>
    </DataTable.Row>
  ));

  useEffect(() => {
    getDeliveriesApi.request();
  }, []);

  return (
    <>
      <ScrollView showsVerticalScrollIndicator={false} horizontal>
        <ActivityIndicator visible={getDeliveriesApi.loading} />
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
              <DataTable.Title>Start Date</DataTable.Title>
              <DataTable.Title>End Date</DataTable.Title>
              <DataTable.Title>Name</DataTable.Title>
              <DataTable.Title>Phone</DataTable.Title>
              <DataTable.Title>Email</DataTable.Title>
              <DataTable.Title>Address</DataTable.Title>
              <DataTable.Title>Cooler</DataTable.Title>
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
  },
  cellName: {
    width: 150,
  },
});

export default AllDeliveriesScreen;
