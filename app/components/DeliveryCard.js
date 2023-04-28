import React from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Linking,
  Platform,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useToggleCheck } from "../hooks/handleCheck";
import Text from "../components/Text";

import colors from "../config/colors";

function DeliveryCard({
  cooler,
  ice,
  address,
  start,
  end,
  name,
  phone,
  email,
  ending,
  special,
}) {
  const startDate = start.split("-");
  var startMonth = startDate[1];
  var startDay = startDate[2];

  if (startMonth == 1) {
    startMonth = "Jan";
  } else if (startMonth == 2) {
    startMonth = "Feb";
  } else if (startMonth == 3) {
    startMonth = "Mar";
  } else if (startMonth == 4) {
    startMonth = "Apr";
  } else if (startMonth == 5) {
    startMonth = "May";
  } else if (startMonth == 6) {
    startMonth = "Jun";
  } else if (startMonth == 7) {
    startMonth = "Jul";
  } else if (startMonth == 8) {
    startMonth = "Aug";
  } else if (startMonth == 9) {
    startMonth = "Sep";
  } else if (startMonth == 10) {
    startMonth = "Oct";
  } else if (startMonth == 11) {
    startMonth = "Nov";
  } else if (startMonth == 12) {
    startMonth = "Dec";
  }

  const endDate = end.split("-");
  var endMonth = endDate[1];
  var endDay = endDate[2];

  if (endMonth == 1) {
    endMonth = "Jan";
  } else if (endMonth == 2) {
    endMonth = "Feb";
  } else if (endMonth == 3) {
    endMonth = "Mar";
  } else if (endMonth == 4) {
    endMonth = "Apr";
  } else if (endMonth == 5) {
    endMonth = "May";
  } else if (endMonth == 6) {
    endMonth = "Jun";
  } else if (endMonth == 7) {
    endMonth = "Jul";
  } else if (endMonth == 8) {
    endMonth = "Aug";
  } else if (endMonth == 9) {
    endMonth = "Sep";
  } else if (endMonth == 10) {
    endMonth = "Oct";
  } else if (endMonth == 11) {
    endMonth = "Nov";
  } else if (endMonth == 12) {
    endMonth = "Dec";
  }

  const { check, rightIcon, handleCheck } = useToggleCheck();

  const openMap = async () => {
    const destination = encodeURIComponent(`${address} Corolla, NC 27927`);
    const provider = Platform.OS === "ios" ? "apple" : "google";
    const link = `http://maps.${provider}.com/?daddr=${destination}`;

    try {
      const supported = await Linking.canOpenURL(link);

      if (supported) Linking.openURL(link);
    } catch (error) {
      console.log(error);
    }
  };

  var textName = name.split(" ");
  const body = `Hey ${textName[0]}, this is Tim with Corolla Ice Delivery. Just wanted to thank you for your business this past week and hope you enjoyed! If you would be willing to leave us a Google review we would really appreciate it! 
  https://g.page/r/CUBe_7herDpHEAE/review`;

  const sendText = () => {
    Linking.openURL(`sms:${phone}${getSMSDivider()}body=${body}`);
  };
  function getSMSDivider() {
    return Platform.OS === "ios" ? "&" : "?";
  }

  return (
    <>
      <View
        style={
          check == true
            ? styles.completedDelivery
            : ending == true
            ? styles.ending
            : styles.current
        }
      >
        <View flexDirection={"row"}>
          <TouchableOpacity style={styles.checkContainer} onPress={handleCheck}>
            <Text>Completed:</Text>
            <MaterialCommunityIcons
              name={rightIcon}
              color={colors.black}
              size={20}
              style={{ marginLeft: 5 }}
            />
          </TouchableOpacity>
          <Text style={styles.rightSideGrey}>
            {startMonth} {startDay}
            {"  "}
            <MaterialCommunityIcons name="arrow-right" size={15} />
            {"  "}
            {endMonth} {endDay}
          </Text>
        </View>
        <View
          style={{
            borderTopWidth: StyleSheet.hairlineWidth,
            marginVertical: 10,
            borderTopColor: colors.medium,
          }}
        ></View>
        <View style={styles.whiteContainer}>
          <View>
            {ending ? (
              <Text style={styles.importantText}>
                PICKUP {cooler} {ice}
              </Text>
            ) : (
              <Text style={styles.importantText}>
                {cooler} {ice}
              </Text>
            )}
            <TouchableOpacity onPress={openMap}>
              <Text style={{ color: colors.primary, fontWeight: "500" }}>
                <MaterialCommunityIcons name="map-marker-radius" size={17.5} />{" "}
                {address}{" "}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.doubleContainer}>
            <TouchableOpacity
              onPress={() => {
                Linking.openURL(`tel:${phone}`);
              }}
              style={{ marginBottom: 5 }}
            >
              <Text style={styles.linkText}>
                <MaterialCommunityIcons
                  name="phone"
                  color={colors.primary}
                  size={17.5}
                />{" "}
                {phone}
              </Text>
            </TouchableOpacity>
            <Text>
              <MaterialCommunityIcons
                name="account-circle-outline"
                color={colors.medium}
                size={17.5}
              />{" "}
              {name}
            </Text>
          </View>
        </View>

        {special.length == 0 ? null : special == "none" ? null : (
          <Text style={styles.mainText}>
            <MaterialCommunityIcons
              name="star"
              color={colors.medium}
              size={17.5}
            />{" "}
            Special Instructions: {special}
          </Text>
        )}

        {ending == true ? (
          <TouchableOpacity onPress={sendText} style={styles.checkContainer}>
            <MaterialCommunityIcons
              name="send-circle"
              color={colors.primary}
              size={17.5}
            />
            <Text style={styles.reviewText}>Send review text</Text>
          </TouchableOpacity>
        ) : null}

        <View
          style={{
            borderTopWidth: StyleSheet.hairlineWidth,
            marginVertical: 10,
            borderTopColor: colors.medium,
          }}
        ></View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  completedDelivery: {
    backgroundColor: "#c9e5d5",
    padding: 10,
    marginVertical: 7.5,
  },
  ending: {
    backgroundColor: "#fee9ea",
    padding: 10,
    marginVertical: 7.5,
  },
  current: {
    padding: 10,
    marginVertical: 7.5,
    backgroundColor: colors.white,
  },
  doubleContainer: {
    left: 0,
    marginLeft: "auto",
    marginRight: 5,
  },
  rightSideGrey: {
    color: colors.medium,
    right: 0,
    marginLeft: "auto",
    marginRight: 5,
  },
  importantText: {
    fontWeight: "500",
    // marginVertical: 2.5,
    marginBottom: 5,
  },
  mainText: {
    marginVertical: 2.5,
    marginLeft: 5,
  },
  linkText: {
    marginVertical: 2.5,
    fontWeight: "500",
    color: colors.primary,
  },
  reviewText: {
    marginVertical: 2.5,
    marginLeft: 5,
    fontWeight: "500",
    color: colors.primary,
  },
  whiteContainer: {
    flexDirection: "row",
    marginLeft: 5,
    alignItems: "center",
    marginBottom: 5,
  },
  checkContainer: {
    marginLeft: 5,
    alignItems: "center",
    flexDirection: "row",
    width: 200,
  },
});

export default DeliveryCard;
