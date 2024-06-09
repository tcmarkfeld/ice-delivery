import React, { useEffect, useState, useMemo } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  RefreshControl,
  Button,
  StatusBar,
} from "react-native";

import ActivityIndicator from "../components/ActivityIndicator";
import DeliveryCard from "../components/DeliveryCard";
import deliveryApi from "../api/delivery";
import useApi from "../hooks/useApi";
import colors from "../config/colors";
import Text from "../components/Text";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

function DeliveryScreen(props) {
  const [refreshing, setRefreshing] = useState(false);
  const [hidden, setHidden] = useState(true);

  const getDeliveriesApi = useApi(deliveryApi.getTodayDeliveries);
  const deliveries = getDeliveriesApi.data;

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
  var count200Bagged = 0;
  var countBags = 0;
  var bagLimes = 0;
  var bagOranges = 0;
  var bagLemons = 0;
  var margSalt = 0;
  var freezePops = 0;

  var yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
    .toISOString()
    .toLocaleString("en-US", {
      timeZone: "America/New_York",
    });

  var date = new Date();

  var getYear = date.toLocaleString("default", { year: "numeric" });
  var getMonth = date.toLocaleString("default", { month: "2-digit" });
  var getDay = date.toLocaleString("default", { day: "2-digit" });
  var dateFormat = getYear + "-" + getMonth + "-" + getDay;

  for (let i = 0; i < deliveries.length; i++) {
    if (deliveries[i].end_date.slice(0, 10) != yesterday.slice(0, 10)) {
      if (
        deliveries[i].cooler_size.toLowerCase() == "40 quart" &&
        deliveries[i].ice_type.toLowerCase() == "loose ice" &&
        today != deliveries[i].end_date.slice(0, 10)
      ) {
        count40 += 1 * deliveries[i].cooler_num;
      } else if (
        deliveries[i].cooler_size.toLowerCase() == "62 quart" &&
        deliveries[i].ice_type.toLowerCase() == "loose ice" &&
        today != deliveries[i].end_date.slice(0, 10)
      ) {
        count62 += 1 * deliveries[i].cooler_num;
      } else if (
        deliveries[i].ice_type.toLowerCase() == "bagged ice" &&
        deliveries[i].cooler_size.toLowerCase() == "62 quart" &&
        today != deliveries[i].end_date.slice(0, 10)
      ) {
        count62Bagged += 1 * deliveries[i].cooler_num;
        countBags += 2 * deliveries[i].cooler_num;
      } else if (
        deliveries[i].ice_type.toLowerCase() == "bagged ice" &&
        deliveries[i].cooler_size.toLowerCase() == "40 quart" &&
        today != deliveries[i].end_date.slice(0, 10)
      ) {
        count40Bagged += 1 * deliveries[i].cooler_num;
        countBags += 1 * deliveries[i].cooler_num;
      } else if (
        deliveries[i].ice_type.toLowerCase() == "bagged ice" &&
        deliveries[i].cooler_size.toLowerCase() == "big ass 200 qt" &&
        today != deliveries[i].end_date.slice(0, 10)
      ) {
        count200Bagged += 1 * deliveries[i].cooler_num;
        countBags += 8 * deliveries[i].cooler_num;
      }
    }
    if (deliveries[i].start_date.slice(0, 10) == dateFormat) {
      if (parseInt(deliveries[i].bag_limes) > 0) {
        bagLimes += parseInt(deliveries[i].bag_limes);
      }
    }
    if (deliveries[i].start_date.slice(0, 10) == dateFormat) {
      if (parseInt(deliveries[i].bag_oranges) > 0) {
        bagOranges += parseInt(deliveries[i].bag_oranges);
      }
    }
    if (deliveries[i].start_date.slice(0, 10) == dateFormat) {
      if (parseInt(deliveries[i].bag_lemons) > 0) {
        bagLemons += parseInt(deliveries[i].bag_lemons);
      }
    }
    if (deliveries[i].start_date.slice(0, 10) == dateFormat) {
      if (parseInt(deliveries[i].marg_salt) > 0) {
        margSalt += parseInt(deliveries[i].marg_salt);
      }
    }
    if (deliveries[i].start_date.slice(0, 10) == dateFormat) {
      if (parseInt(deliveries[i].freeze_pops) > 0) {
        freezePops += parseInt(deliveries[i].freeze_pops);
      }
    }
  }

  try {
    function mapOrder(a, order, key) {
      const map = order.reduce((r, v, i) => ((r[v] = i), r), {});
      return a.sort((a, b) => map[a[key]] - map[b[key]]);
    }
    var item_order = [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
    ];

    var addressPriority = {
      C: 0,
      W: 1,
      L: 2,
    };

    const deliveryordered = deliveries.sort(function (a, b) {
      return parseFloat(b.delivery_address) - parseFloat(a.delivery_address);
    });

    var ordered_array = deliveryordered.sort(function (a, b) {
      var aNeighborhoodPriority = item_order[a.neighborhood];
      var bNeighborhoodPriority = item_order[b.neighborhood];

      if (
        a.neighborhood == "1" ||
        b.neighborhood == "1" ||
        a.neighborhood == "5" ||
        b.neighborhood == "5"
      ) {
        return parseFloat(a.delivery_address) - parseFloat(b.delivery_address);
      } else if (a.neighborhood == "3" || b.neighborhood == "3") {
        if (aNeighborhoodPriority !== bNeighborhoodPriority) {
          return bNeighborhoodPriority - aNeighborhoodPriority;
        } else {
          var aAddressPrefix = a.delivery_address
            .replace(/[^a-zA-Z]/g, "")
            .toUpperCase()
            .slice(0, 1);
          var bAddressPrefix = b.delivery_address
            .replace(/[^a-zA-Z]/g, "")
            .toUpperCase()
            .slice(0, 1);

          var aAddressPriority = addressPriority[aAddressPrefix];
          var bAddressPriority = addressPriority[bAddressPrefix];

          var aAddressValue = parseFloat(a.delivery_address);
          var bAddressValue = parseFloat(b.delivery_address);
          var exceeds925 = aAddressValue > 925 || bAddressValue > 925;

          if (aAddressValue !== bAddressValue) {
            if (exceeds925) {
              if (aAddressValue >= 925 && bAddressValue >= 925) {
                return aAddressPriority - bAddressPriority;
              } else if (aAddressValue >= 925) {
                return -1;
              } else if (bAddressValue >= 925) {
                return 1;
              }
            }
            return bAddressValue - aAddressValue;
          } else if (aAddressPrefix !== bAddressPrefix) {
            return aAddressPriority - bAddressPriority;
          } else {
            return 0;
          }
        }
      } else {
        return parseFloat(b.delivery_address) - parseFloat(a.delivery_address);
      }
    });
    ordered_array = mapOrder(ordered_array, item_order, "neighborhood");
  } catch {
    var ordered_array = [];
  }

  var deliverieslist = ordered_array.map((data) => (
    <DeliveryCard
      key={data.id}
      cooler={data.cooler_size.toLowerCase()}
      num_cooler={data.cooler_num}
      ice={data.ice_type.toLowerCase()}
      address={data.delivery_address}
      name={data.customer_name}
      phone={data.customer_phone}
      neighborhood={data.neighborhood}
      start={data.start_date.slice(0, 10)}
      end={data.end_date.slice(0, 10)}
      ending={
        data.end_date.slice(0, 10) == yesterday.slice(0, 10) ? true : false
      }
      special={data.special_instructions}
      bag_limes={data.bag_limes}
      bag_oranges={data.bag_oranges}
      bag_lemons={data.bag_lemons}
      marg_salt={data.marg_salt}
      freeze_pops={data.freeze_pops}
      deliverytime={data.deliverytime}
      dayornight={data.dayornight}
    />
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
        style={{ backgroundColor: colors.lightgrey }}
      >
        <StatusBar barStyle="light-content" translucent={true} />

        <View style={styles.coolerNumContainer}>
          <View style={styles.baggedContainer}>
            <Text style={styles.countText}>
              62 Quart Bagged - {count62Bagged}
            </Text>
            <Text style={styles.countText}>
              40 Quart Bagged - {count40Bagged}
            </Text>
            {count200Bagged > 0 ? (
              <Text style={styles.countText}>
                200 Quart Bagged - {count200Bagged}
              </Text>
            ) : null}
            <Text style={styles.bagText}>Total Bags - {countBags}</Text>
            {bagLemons > 0 ? (
              <Text style={styles.lemonText}>
                <MaterialCommunityIcons
                  name="fruit-citrus"
                  color={colors.lemon}
                  size={15}
                />{" "}
                Bag of Lemons - {bagLemons}
              </Text>
            ) : null}
            {margSalt > 0 ? (
              <Text style={styles.saltText}>
                <MaterialCommunityIcons
                  name="shaker"
                  color={colors.medium}
                  size={15}
                />{" "}
                Marg Salt - {margSalt}
              </Text>
            ) : null}
          </View>
          <View style={styles.looseContainer}>
            <Text style={styles.countText}>62 Quart Loose - {count62}</Text>
            <Text style={styles.countText}>40 Quart Loose - {count40}</Text>
            {bagLimes > 0 ? (
              <Text style={styles.limeText}>
                <MaterialCommunityIcons
                  name="fruit-citrus"
                  color={colors.lime}
                  size={15}
                />{" "}
                Bag of Limes - {bagLimes}
              </Text>
            ) : null}
            {bagOranges > 0 ? (
              <Text style={styles.orangeText}>
                <MaterialCommunityIcons
                  name="fruit-citrus"
                  color={colors.orange}
                  size={15}
                />{" "}
                Bag of Oranges - {bagOranges}
              </Text>
            ) : null}
            {freezePops > 0 ? (
              <Text style={styles.redText}>
                <MaterialCommunityIcons
                  name="ice-pop"
                  color={colors.red}
                  size={15}
                />{" "}
                Freeeze Pops - {freezePops}
              </Text>
            ) : null}
          </View>
        </View>

        <View style={styles.body}>
          {getDeliveriesApi.error && (
            <View style={styles.noDelivContainer}>
              <Text style={styles.noDeliveries}>
                Couldn't retrieve the deliveries.
              </Text>
              <Button title="Retry" onPress={getDeliveriesApi.request} />
            </View>
          )}
        </View>
        {deliverieslist.length == 0 ? (
          <View style={styles.noDelivContainer}>
            <Text style={styles.noDeliveries}>No deliveries</Text>
          </View>
        ) : (
          <>{deliverieslist}</>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  body: {
    marginVertical: 7.5,
  },
  countContainer: {
    margin: 10,
    backgroundColor: colors.white,
    borderRadius: 8,
    flexDirection: "row",
    padding: 10,
  },
  countText: {
    marginVertical: 2.5,
    color: colors.onyx,
    fontWeight: "500",
  },
  chevronContainer: {
    backgroundColor: colors.white,
    marginTop: 7.5,
    flexDirection: "row",
    alignItems: "center",
    height: 50,
  },
  bagText: {
    marginVertical: 2.5,
    right: 0,
    marginLeft: "auto",
    color: colors.onyx,
    fontWeight: "500",
  },
  limeText: {
    marginVertical: 2.5,
    color: colors.lime,
    fontWeight: "500",
  },
  saltText: {
    marginVertical: 2.5,
    color: colors.medium,
    fontWeight: "500",
  },
  lemonText: {
    marginVertical: 2.5,
    color: colors.lemon,
    fontWeight: "500",
  },
  orangeText: {
    marginVertical: 2.5,
    color: colors.orange,
    fontWeight: "500",
  },
  redText: {
    marginVertical: 2.5,
    color: colors.red,
    fontWeight: "500",
  },
  looseContainer: {
    right: 0,
    marginLeft: "auto",
  },
  coolerNumContainer: {
    backgroundColor: colors.white,
    marginTop: 20,
    flexDirection: "row",
    paddingHorizontal: 15,
    padding: 5,
    borderRadius: 25,
    marginHorizontal: 15,
    borderColor: colors.primary,
    borderWidth: 2,
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
});

export default DeliveryScreen;
