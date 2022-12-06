import React, { useEffect } from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";

import ActivityIndicator from "../components/ActivityIndicator";
import DeliveryCard from "../components/DeliveryCard";
import deliveryApi from "../api/delivery";
import useApi from "../hooks/useApi";

function DeliveryScreen(props) {
  const getDeliveriesApi = useApi(deliveryApi.getTodayDeliveries);
  const deliveries = getDeliveriesApi.data;

  const deliverieslist = deliveries.map((data) => (
    <DeliveryCard
      key={data.id}
      cooler={data.cooler_size}
      ice={data.ice_type}
      address={data.delivery_address}
      name={data.customer_name}
      phone={data.customer_phone}
      email={data.customer_email}
      start={data.start_date.slice(0, 10)}
      end={data.end_date.slice(0, 10)}
      ending={
        data.end_date.slice(0, 10) == new Date().toISOString().slice(0, 10)
          ? true
          : false
      }
    />
  ));

  useEffect(() => {
    getDeliveriesApi.request();
  }, []);

  return (
    <>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ActivityIndicator visible={getDeliveriesApi.loading} />
        <View style={styles.countContainer}>
          <Text style={styles.countText}>62 Quart Count: </Text>
          <Text style={styles.countText}>40 Quart Count: </Text>
          <Text style={styles.countText}>Number of bags: </Text>
        </View>
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
          deliverieslist
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  countContainer: {
    margin: 10,
  },
  countText: {
    fontWeight: "500",
    fontSize: 17.5,
    marginVertical: 2.5,
  },
});

export default DeliveryScreen;
