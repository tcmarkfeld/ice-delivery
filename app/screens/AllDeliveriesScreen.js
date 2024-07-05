import React, { useEffect, useState, useMemo } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Button,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  Modal,
  Platform,
} from "react-native";

import { DataTable } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";

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
  const [modalVisible, setModalVisible] = useState(false);
  const [tipModalVisible, setTipModalVisible] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedDateStart, setSelectedDateStart] = useState(new Date());
  const [showDatePickerStart, setShowDatePickerStart] = useState(false);
  const [selectedDateEnd, setSelectedDateEnd] = useState(new Date());
  const [showDatePickerEnd, setShowDatePickerEnd] = useState(false);
  const [tipAmount, setTipAmount] = useState(null);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(500).then(async () => {
      let deliveries = await getDeliveriesApi.request();
      setRefreshing(false);
    });
  }, []);

  const tipReport = useApi(deliveryApi.tipReport);

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

  var filtered_array = ordered_array.filter((item) => {
    return (
      item.delivery_address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.customer_phone.includes(searchTerm.toLowerCase()) ||
      item.special_instructions.includes(searchTerm.toLowerCase())
    );
  });

  if (startDate != null && endDate != null) {
    filtered_array = ordered_array.filter((item) => {
      let [startMonth, startDay, startYear] = startDate.split("/").map(Number);
      let [endMonth, endDay, endYear] = endDate.split("/").map(Number);
      const itemStartDate = new Date(item.start_date);
      const itemEndDate = new Date(item.end_date);
      const rangeStartDate = new Date(startYear, startMonth - 1, startDay);
      const rangeEndDate = new Date(endYear, endMonth - 1, endDay);

      // Check if any day within item's range falls within the range of startDate and endDate
      const isItemInRange =
        (itemStartDate >= rangeStartDate && itemStartDate <= rangeEndDate) ||
        (itemEndDate >= rangeStartDate && itemEndDate <= rangeEndDate) ||
        (itemStartDate <= rangeStartDate && itemEndDate >= rangeEndDate);
      console.log(itemStartDate + " " + itemEndDate);
      console.log(rangeStartDate + " " + rangeEndDate);
      console.log(startDate);
      return isItemInRange;
    });
  }

  function getWeekStartEndDates(startMonth, endMonth) {
    const startDate = new Date();
    startDate.setMonth(startMonth - 1); // Adjust month to 0-based index
    startDate.setDate(1); // Start from the first day of the month

    // Set the start day to the next Saturday or keep it as the current day if it's already Saturday
    while (startDate.getDay() !== 6) {
      // 6 represents Saturday
      startDate.setDate(startDate.getDate() + 1);
    }

    const endDate = new Date();
    endDate.setMonth(endMonth); // Adjust month to 0-based index
    endDate.setDate(0); // Set to the last day of the previous month

    const weekDates = [];

    while (startDate <= endDate) {
      const startOfWeek = new Date(startDate);
      const endOfWeek = new Date(startDate);
      endOfWeek.setDate(startOfWeek.getDate() + 7); // Add six days to get the end of the week

      const startFormatted = startOfWeek.toLocaleDateString("en-US", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      });
      const endFormatted = endOfWeek.toLocaleDateString("en-US", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      });

      weekDates.push({
        start: startFormatted,
        end: endFormatted,
      });

      startDate.setDate(startDate.getDate() + 7); // Move to the next week
    }

    return weekDates;
  }

  // var startMonth = 4;
  const today = new Date().toLocaleDateString().slice(0, 1);

  // Generate array of start and end dates for each week from April (month 4) until September (month 9)
  var startMonth = 4;
  const endMonth = 8;
  const weeklyDates = getWeekStartEndDates(startMonth, endMonth);

  useEffect(() => {
    getDeliveriesApi.request();
    setLoading(false);
  }, []);

  if (loading) {
    return <ActivityIndicator visible={getDeliveriesApi.loading} />;
  }

  function setDates(start, end) {
    setStartDate(start);
    setEndDate(end);
    setModalVisible(false);
  }

  const handleStartDateChange = (event, newDate) => {
    setShowDatePickerStart(false);
    if (newDate !== undefined) {
      setSelectedDateStart(newDate);
    }
  };

  const handleEndDateChange = (event, newDate) => {
    setShowDatePickerEnd(false);
    if (newDate !== undefined) {
      setSelectedDateEnd(newDate);
    }
  };

  const clearModal = () => {
    setTipModalVisible(!tipModalVisible);
    setSelectedDateEnd(new Date());
    setSelectedDateStart(new Date());
    setTipAmount(0);
  };

  const runTipReport = () => {
    var tip_array = ordered_array.filter((item) => {
      const itemDate = new Date(item.timestamp);
      const rangeStartDate = new Date(selectedDateStart);
      const rangeEndDate = new Date(selectedDateEnd);

      // Check if any day within item's timestamp falls within the range of startDate and endDate
      const isItemInRange =
        rangeStartDate <= itemDate && itemDate <= rangeEndDate;

      return isItemInRange;
    });
    var totalTips = 0;

    for (var i = 0; i < tip_array.length; i++) {
      totalTips += parseInt(tip_array[i].tip);
    }
    setTipAmount(totalTips);
  };

  const weeks = weeklyDates.map((data, index) => (
    <View key={index}>
      <TouchableOpacity
        style={styles.filterDatesContainer}
        onPress={() => setDates(data.start, data.end)}
      >
        <Text
          style={{
            marginRight: 10,
            color: colors.onyx,
            width: "35%",
            textAlign: "center",
            fontWeight: "500",
          }}
        >
          {data.start}
        </Text>
        <MaterialCommunityIcons
          name="arrow-right"
          size={15}
          color={colors.onyx}
        />
        <Text
          style={{
            marginLeft: 10,
            color: colors.onyx,
            width: "35%",
            textAlign: "center",
            fontWeight: "500",
          }}
        >
          {data.end}
        </Text>
      </TouchableOpacity>
      <View
        style={{
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: colors.medium,
          marginVertical: 5,
        }}
      ></View>
    </View>
  ));

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
                {data.cooler_num > 1 ? data.cooler_num + "x" : null}{" "}
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
            flexDirection: "row",
            marginBottom: 10,
          }}
        >
          <View style={styles.searchContainer}>
            <MaterialCommunityIcons
              name="magnify"
              color={colors.medium}
              size={15}
            />
            <TextInput
              icon={"magnify"}
              style={styles.searchBar}
              value={searchTerm}
              onChangeText={(event) => setSearchTerm(event)}
              placeholder="Search..."
            ></TextInput>
            {searchTerm.length > 0 ? (
              <TouchableOpacity onPress={() => setSearchTerm("")}>
                <MaterialCommunityIcons
                  color={colors.medium}
                  name="window-close"
                  size={15}
                />
              </TouchableOpacity>
            ) : null}
          </View>
          <TouchableOpacity
            style={styles.filterTouchable}
            onPress={() => setModalVisible(true)}
          >
            <MaterialCommunityIcons
              name="tune-variant"
              size={15}
              color={colors.medium}
            />
            <Text style={{ color: colors.medium }}>Filter</Text>
          </TouchableOpacity>

          {/* TIP MODAL TOUCHABLE */}
          <TouchableOpacity
            style={styles.filterTouchable}
            onPress={() => setTipModalVisible(true)}
          >
            <MaterialCommunityIcons
              name="currency-usd"
              size={15}
              color={colors.medium}
            />
            <Text style={{ color: colors.medium }}>Tips</Text>
          </TouchableOpacity>
        </View>
        {/* FILTER BY WEEK MODAL */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={{ marginBottom: 5 }}>Filter by Week:</Text>
              <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.modalText}>{weeks}</Text>
              </ScrollView>
              <TouchableOpacity
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Text style={styles.textStyle}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* TIP REPORT MODAL */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={tipModalVisible}
          onRequestClose={() => {
            setTipModalVisible(!tipModalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={{ marginBottom: 20 }}>
                <View style={{ marginBottom: 10, alignItems: "center" }}>
                  <Text>Start Date:</Text>
                  {Platform.OS === "android" ? (
                    <TouchableOpacity
                      onPress={() => setShowDatePickerStart(true)}
                    >
                      <Text style={{ color: colors.medium }}>
                        {selectedDateStart.toLocaleString().slice(0, 10)}
                      </Text>
                      {showDatePickerStart && (
                        <DateTimePicker
                          value={selectedDateStart}
                          accentColor={colors.primary}
                          mode="date"
                          display="default"
                          onChange={handleStartDateChange}
                        />
                      )}
                    </TouchableOpacity>
                  ) : (
                    <DateTimePicker
                      value={selectedDateStart}
                      accentColor={colors.primary}
                      mode="date"
                      display="default"
                      onChange={handleStartDateChange}
                    />
                  )}
                </View>

                <View style={{ marginBottom: 10, alignItems: "center" }}>
                  <Text>End Date:</Text>
                  {Platform.OS === "android" ? (
                    <TouchableOpacity
                      onPress={() => setShowDatePickerEnd(true)}
                    >
                      <Text style={{ color: colors.medium }}>
                        {selectedDateEnd.toLocaleString().slice(0, 10)}
                      </Text>
                      {showDatePickerEnd && (
                        <DateTimePicker
                          value={selectedDateEnd}
                          accentColor={colors.primary}
                          mode="date"
                          display="default"
                          onChange={handleEndDateChange}
                        />
                      )}
                    </TouchableOpacity>
                  ) : (
                    <DateTimePicker
                      value={selectedDateEnd}
                      accentColor={colors.primary}
                      mode="date"
                      display="default"
                      onChange={handleEndDateChange}
                    />
                  )}
                </View>
              </View>
              <Text
                style={{
                  color: colors.black,
                  marginBottom: 20,
                  fontWeight: "500",
                }}
              >
                Total tips: ${tipAmount}
              </Text>
              <TouchableOpacity
                style={[styles.button, styles.tipButton]}
                onPress={runTipReport}
              >
                <Text style={styles.textStyle}>Run Report</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonClose]}
                onPress={() => clearModal()}
              >
                <Text style={styles.textStyle}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {startDate != null && endDate != null ? (
          <TouchableOpacity
            style={styles.dateFilter}
            onPress={() => setDates(null, null)}
          >
            <Text
              style={{
                color: colors.lightgrey,
                marginRight: 5,
                fontWeight: "bold",
              }}
            >
              {startDate} - {endDate}{" "}
            </Text>
            <MaterialCommunityIcons
              color={colors.lightgrey}
              name="selection-remove"
              size={20}
            />
          </TouchableOpacity>
        ) : null}
        {getDeliveriesApi.error && (
          <>
            <Text>Couldn't retrieve the deliveries.</Text>
            <Button title="Retry" onPress={getDeliveriesApi.request} />
          </>
        )}
        {deliveries.length == 0 ? (
          <View style={styles.noDelivContainer}>
            <Text style={styles.noDeliveries}>No deliveries</Text>
          </View>
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
    width: "45%",
    padding: 5,
  },
  searchBar: {
    width: "80%",
    padding: 5,
    marginLeft: 5,
  },
  filterTouchable: {
    backgroundColor: colors.grey,
    width: "20%",
    marginLeft: "5%",
    height: "75%",
    marginTop: 15,
    borderRadius: 8,
    padding: 5,
    alignItems: "center",
    justifyContent: "space-evenly",
    flexDirection: "row",
    color: colors.medium,
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
  //Modal Styling
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    maxHeight: 500,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 8,
    padding: 10,
    elevation: 2,
    marginTop: 5,
  },
  buttonClose: {
    backgroundColor: colors.primary,
    width: 105,
  },
  tipButton: {
    backgroundColor: colors.lime,
    width: 105,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  filterDatesContainer: {
    flexDirection: "row",
    marginBottom: 2.5,
    alignItems: "center",
    marginVertical: 5,
    backgroundColor: colors.lightgrey,
    width: 250,
    justifyContent: "center",
    borderRadius: 8,
    padding: 5,
  },
  dateFilter: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginVertical: 5,
    backgroundColor: colors.primary,
    alignSelf: "center",
    padding: 10,
    borderRadius: 8,
  },
});

export default AllDeliveriesScreen;
