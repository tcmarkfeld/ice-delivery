import React, { useEffect, useState, useMemo } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Button,
  TouchableOpacity,
  TextInput,
  RefreshControl,
} from "react-native";

import { DataTable } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import ActivityIndicator from "../components/ActivityIndicator";
import colors from "../config/colors";
import deliveryApi from "../api/delivery";
import useApi from "../hooks/useApi";
import Text from "../components/Text";

const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

function AllDeliveriesScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(500).then(async () => {
      let deliveries = await getDeliveriesApi.request();
      setRefreshing(false);
    });
  }, []);

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

  const filtered_array = ordered_array.filter((item) => {
    return (
      item.delivery_address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.customer_phone.includes(searchTerm.toLowerCase()) ||
      item.special_instructions.includes(searchTerm.toLowerCase())
    );
  });

  useEffect(() => {
    getDeliveriesApi.request();
    setLoading(false);
  }, []);

  if (loading) {
    return <ActivityIndicator visible={loading} />;
  }

  const table = filtered_array.map((data) => (
    <DataTable.Row key={data.id} style={styles.orderContainer}>
      <View style={styles.mainView}>
        <View>
          <View flexDirection="row">
            <Text style={{ color: colors.medium, padding: 5 }}>
              {data.start_date.slice(0, 10)}{" "}
              <MaterialCommunityIcons name="arrow-right" size={15} />{" "}
              {data.end_date.slice(0, 10)}
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("Edit Order", { id: data.id })}
              style={styles.editTouchable}
            >
              <Text style={{ color: colors.primary, fontWeight: "500" }}>
                Edit Order
              </Text>
              <MaterialCommunityIcons
                name="chevron-right"
                color={colors.primary}
                size={20}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.greyContainer}>
            <Text style={{ color: colors.medium }}>
              <MaterialCommunityIcons name="account-circle-outline" size={15} />{" "}
              Customer
            </Text>
            <View style={{ right: 0, marginLeft: "auto" }}>
              <Text
                style={{
                  fontWeight: "600",
                  color: colors.onyx,
                }}
              >
                {data.customer_name}
              </Text>
            </View>
          </View>
          <View style={styles.whiteContainer}>
            <Text style={{ color: colors.medium }}>
              <MaterialCommunityIcons name="air-humidifier" size={15} /> Cooler
            </Text>
            <View style={{ right: 0, marginLeft: "auto" }}>
              <Text
                style={{
                  fontWeight: "600",
                  color: colors.onyx,
                }}
              >
                {data.cooler_size.toLowerCase()} {data.ice_type.toLowerCase()}
              </Text>
            </View>
          </View>
          <View style={styles.greyContainer}>
            <Text style={{ color: colors.medium }}>
              <MaterialCommunityIcons name="map-marker-radius" size={17.5} />{" "}
              Address
            </Text>
            <View style={{ right: 0, marginLeft: "auto" }}>
              <Text
                style={{
                  fontWeight: "600",
                  color: colors.onyx,
                }}
              >
                {data.delivery_address}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </DataTable.Row>
  ));

  return (
    <>
      <ActivityIndicator visible={getDeliveriesApi.loading} />
      <ScrollView
        style={{ backgroundColor: colors.lightgrey }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <View style={styles.searchContainer}>
            <MaterialCommunityIcons name="magnify" size={15} />
            <TextInput
              icon={"magnify"}
              style={styles.searchBar}
              onChangeText={(event) => setSearchTerm(event)}
              placeholder="Search..."
            ></TextInput>
          </View>
        </View>
        {getDeliveriesApi.error && (
          <>
            <Text>Couldn't retrieve the deliveries.</Text>
            <Button title="Retry" onPress={getDeliveriesApi.request} />
          </>
        )}
        {deliveries.length == 0 ? (
          <Text style={styles.noEvents}>No deliveries</Text>
        ) : (
          <DataTable style={{ marginBottom: 20 }}>{table}</DataTable>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  orderContainer: {
    flexDirection: "column",
    marginVertical: 7.5,
    justifyContent: "center",
    padding: 10,
    backgroundColor: colors.white,
  },
  mainView: {
    width: "100%",
  },
  greyContainer: {
    backgroundColor: colors.lightgrey,
    flexDirection: "row",
    borderRadius: 8,
    padding: 5,
    justifyContent: "center",
  },
  whiteContainer: {
    flexDirection: "row",
    borderRadius: 8,
    padding: 5,
    justifyContent: "center",
  },
  editTouchable: {
    alignItems: "center",
    justifyContent: "flex-end",
    flexDirection: "row",
    marginVertical: 2.5,
    right: 0,
    marginLeft: "auto",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.grey,
    marginTop: 15,
    borderRadius: 8,
    width: "85%",
    padding: 5,
  },
  searchBar: {
    width: "100%",
    padding: 5,
    marginLeft: 5,
  },
});

export default AllDeliveriesScreen;
