import React, { useEffect, useState, useMemo } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Button,
  TouchableOpacity,
  TextInput,
} from "react-native";

import { DataTable } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import ActivityIndicator from "../components/ActivityIndicator";
import colors from "../config/colors";
import deliveryApi from "../api/delivery";
import useApi from "../hooks/useApi";
import Text from "../components/Text";

function AllDeliveriesScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

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
    <DataTable.Row key={data.id} style={styles.tableRow}>
      <View style={styles.orderContainer}>
        <View style={{ width: "95%" }}>
          <Text style={{ color: colors.medium, padding: 5 }}>
            {data.start_date.slice(0, 10)}{" "}
            <MaterialCommunityIcons name="arrow-right" size={15} />{" "}
            {data.end_date.slice(0, 10)}
          </Text>
          <View style={styles.greyContainer}>
            <Text style={{ color: colors.medium }}>Customer</Text>
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
            <Text style={{ color: colors.medium }}>Cooler</Text>
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
            <Text style={{ color: colors.medium }}>Address</Text>
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
        <TouchableOpacity
          style={{ justifyContent: "center", height: "100%" }}
          onPress={() => navigation.navigate("Order", { id: data.id })}
        >
          <MaterialCommunityIcons name="chevron-right" size={25} />
        </TouchableOpacity>
      </View>
    </DataTable.Row>
  ));

  return (
    <>
      <ScrollView
        style={{ backgroundColor: colors.lightgrey }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 5,
          }}
        >
          <View style={styles.searchContainer}>
            <MaterialCommunityIcons name="magnify" size={15} />
            <TextInput
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
          <DataTable>{table}</DataTable>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  tableRow: {
    justifyContent: "center",
    alignItems: "center",
  },
  orderContainer: {
    flexDirection: "row",
    marginVertical: 5,
    marginHorizontal: 5,
    padding: 10,
    backgroundColor: colors.white,
    borderRadius: 8,
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
