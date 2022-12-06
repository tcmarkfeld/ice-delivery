import React, { useEffect } from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";

import ActivityIndicator from "../components/ActivityIndicator";
import DeliveryCard from "../components/DeliveryCard";
import deliveryApi from "../api/delivery";
import useApi from "../hooks/useApi";

function AllDeliveriesScreen(props) {
  const getDeliveriesApi = useApi(deliveryApi.getAll);
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
    />
  ));

  useEffect(() => {
    getDeliveriesApi.request();
  }, []);

  return (
    <>
      <ScrollView showsVerticalScrollIndicator={false}>
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
          deliverieslist
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({});

export default AllDeliveriesScreen;
