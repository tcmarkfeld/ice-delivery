import React, { useEffect, useState, useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  RefreshControl,
  Button,
  StatusBar,
  ImageBackground,
} from "react-native";

import ActivityIndicator from "../components/ActivityIndicator";
import DeliveryCard from "../components/DeliveryCard";
import deliveryApi from "../api/delivery";
import useApi from "../hooks/useApi";
import colors from "../config/colors";

const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

function DeliveryScreen(props) {
  const [refreshing, setRefreshing] = useState(false);

  const getDeliveriesApi = useApi(deliveryApi.getTodayDeliveries);
  const deliveries = useMemo(
    () => getDeliveriesApi.data,
    [getDeliveriesApi.data]
  );

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(500).then(async () => {
      let deliveries = await getDeliveriesApi.request();
      setRefreshing(false);
    });
  }, []);

  var today = new Date().toLocaleString("en-US", {
    timeZone: "America/New_York",
  });
  var count40 = 0;
  var count62 = 0;
  var count40Bagged = 0;
  var count62Bagged = 0;
  var countBags = 0;

  var yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
    .toISOString()
    .toLocaleString("en-US", {
      timeZone: "America/New_York",
    });

  for (let i = 0; i < deliveries.length; i++) {
    if (deliveries[i].end_date.slice(0, 10) != yesterday.slice(0, 10)) {
      if (
        deliveries[i].cooler_size.toLowerCase() == "40 quart" &&
        deliveries[i].ice_type.toLowerCase() == "loose ice" &&
        today != deliveries[i].end_date.slice(0, 10)
      ) {
        count40 += 1;
      } else if (
        deliveries[i].cooler_size.toLowerCase() == "62 quart" &&
        deliveries[i].ice_type.toLowerCase() == "loose ice" &&
        today != deliveries[i].end_date.slice(0, 10)
      ) {
        count62 += 1;
      }
      if (
        deliveries[i].ice_type.toLowerCase() == "bagged ice" &&
        deliveries[i].cooler_size.toLowerCase() == "62 quart" &&
        today != deliveries[i].end_date.slice(0, 10)
      ) {
        count62Bagged += 1;
        countBags += 2;
      } else if (
        deliveries[i].ice_type.toLowerCase() == "bagged ice" &&
        deliveries[i].cooler_size.toLowerCase() == "40 quart" &&
        today != deliveries[i].end_date.slice(0, 10)
      ) {
        count40Bagged += 1;
        countBags += 1;
      }
    }
  }

  try {
    function mapOrder(a, order, key) {
      const map = order.reduce((r, v, i) => ((r[v] = i), r), {});
      return a.sort((a, b) => map[a[key]] - map[b[key]]);
    }
    var item_order = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
    var ordered_array = deliveries.sort(function (a, b) {
      return parseFloat(a.delivery_address) - parseFloat(b.delivery_address);
    });
    ordered_array = mapOrder(ordered_array, item_order, "neighborhood");
  } catch {
    var ordered_array = [];
    console.log("no deliveries");
  }

  var deliverieslist = ordered_array.map((data) => (
    <DeliveryCard
      key={data.id}
      cooler={data.cooler_size.toLowerCase()}
      ice={data.ice_type.toLowerCase()}
      address={data.delivery_address}
      name={data.customer_name}
      phone={data.customer_phone}
      email={data.customer_email}
      neighborhood={data.neighborhood}
      start={data.start_date.slice(0, 10)}
      end={data.end_date.slice(0, 10)}
      ending={
        data.end_date.slice(0, 10) == yesterday.slice(0, 10) ? true : false
      }
      special={data.special_instructions}
    />
  ));

  useEffect(() => {
    getDeliveriesApi.request();
  }, []);

  return (
    <>
      <ImageBackground
        source={require("../assets/textured-background.webp")}
        resizeMode="cover"
        style={styles.image}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <StatusBar barStyle="dark-content" translucent={true} />
          <ActivityIndicator visible={getDeliveriesApi.loading} />
          <View style={styles.countContainer}>
            <View style={{ flexDirection: "row" }}>
              <View>
                <Text style={styles.countText}>
                  62 Quart Bagged: {count62Bagged}
                </Text>
                <Text style={styles.countText}>
                  40 Quart Bagged: {count40Bagged}
                </Text>
                <View style={styles.separator} />
                <Text style={styles.countText}>
                  Number of bags: {countBags}
                </Text>
              </View>
              <View style={styles.looseContainer}>
                <Text style={styles.countText}>62 Quart Loose: {count62}</Text>
                <Text style={styles.countText}>40 Quart Loose: {count40}</Text>
              </View>
            </View>
          </View>
          <View style={styles.body}>
            {getDeliveriesApi.error && (
              <>
                <View style={styles.noDelivContainer}>
                  <Text style={styles.noDeliveries}>
                    Couldn't retrieve the deliveries.
                  </Text>
                  <Button title="Retry" onPress={getDeliveriesApi.request} />
                </View>
              </>
            )}
          </View>
          {deliverieslist.length == 0 ? (
            <View style={styles.noDelivContainer}>
              <Text style={styles.noDeliveries}>No deliveries</Text>
            </View>
          ) : (
            deliverieslist
          )}
        </ScrollView>
      </ImageBackground>
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
  looseContainer: {
    right: 0,
    marginLeft: "auto",
  },
  noDelivContainer: {
    backgroundColor: colors.grey,
    borderRadius: 10,
    padding: 10,
    marginLeft: 10,
    marginRight: 10,
  },
  noDeliveries: {
    textAlign: "center",
  },
  separator: {
    borderBottomColor: colors.black,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  image: {
    flex: 1,
  },
});

export default DeliveryScreen;
