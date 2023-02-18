import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Linking,
  Platform,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useToggleCheck } from "../hooks/handleCheck";

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
  var startYear = startDate[0];
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
  var endYear = endDate[0];
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
    <View
      style={
        check == true
          ? styles.completedDelivery
          : ending == true
          ? styles.ending
          : styles.current
      }
    >
      <View style={styles.addressDateContainer}>
        <View>
          <Text style={styles.importantText}>
            {cooler} {ice}
          </Text>
          <TouchableOpacity onPress={openMap}>
            <Text style={styles.addressText}>{address}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.dateContainer}>
          <Text style={styles.mainText}>
            Starts: {startMonth} {startDay}
          </Text>
          <Text style={styles.mainText}>
            Ends: {endMonth} {endDay}
          </Text>
        </View>
      </View>
      <Text style={styles.mainText}>
        <MaterialCommunityIcons
          name="human-male"
          color={colors.black}
          size={15}
        />{" "}
        {name}
      </Text>
      <TouchableOpacity
        onPress={() => {
          Linking.openURL(`tel:${phone}`);
        }}
        style={styles.touchableContainer}
      >
        <View style={styles.phoneContainer}>
          <MaterialCommunityIcons name="phone" color={colors.black} size={15} />
          <Text style={styles.phoneText}>{phone}</Text>
        </View>
      </TouchableOpacity>
      <View style={styles.checkContainer}>
        <Text style={styles.mainText}>
          <MaterialCommunityIcons name="email" color={colors.black} size={15} />{" "}
          {email}
        </Text>
        <View style={styles.checkBox}>
          <TouchableOpacity onPress={handleCheck}>
            <MaterialCommunityIcons
              name={rightIcon}
              color={colors.black}
              size={25}
            />
          </TouchableOpacity>
        </View>
      </View>
      {ending == true ? (
        <TouchableOpacity onPress={sendText} style={styles.touchableContainer}>
          <View style={styles.phoneContainer}>
            <MaterialCommunityIcons
              name="message-text-outline"
              color={colors.black}
              size={15}
            />
            <Text style={styles.phoneText}> Send review text</Text>
          </View>
        </TouchableOpacity>
      ) : null}
      {special.length == 0
        ? null
        : (special = "none" ? null : (
            <Text style={styles.specialInstructions}>
              Instructions: {special}
            </Text>
          ))}
    </View>
  );
}

const styles = StyleSheet.create({
  completedDelivery: {
    backgroundColor: "#B1D8B7",
    padding: 10,
    marginLeft: 10,
    marginRight: 10,
    marginVertical: 10,
    borderRadius: 10,
  },
  ending: {
    backgroundColor: "#F7BEC0",
    padding: 10,
    marginLeft: 10,
    marginRight: 10,
    marginVertical: 10,
    borderRadius: 10,
  },
  current: {
    backgroundColor: colors.grey,
    padding: 10,
    marginLeft: 10,
    marginRight: 10,
    marginVertical: 10,
    borderRadius: 10,
  },
  addressDateContainer: {
    flexDirection: "row",
    marginBottom: 5,
  },
  dateContainer: {
    right: 0,
    marginLeft: "auto",
  },
  addressText: {
    fontSize: 15,
    textDecorationLine: "underline",
    marginVertical: 2,
  },
  phoneText: {
    textDecorationLine: "underline",
    fontSize: 15,
    marginVertical: 2,
    paddingLeft: 2.5,
  },
  phoneContainer: {
    flexDirection: "row",
  },
  importantText: {
    fontSize: 15,
    fontWeight: "500",
    marginVertical: 2,
  },
  mainText: {
    marginVertical: 2,
    fontSize: 15,
  },
  checkContainer: {
    flexDirection: "row",
  },
  checkBox: {
    right: 0,
    marginLeft: "auto",
  },
  specialInstructions: {
    fontSize: 15,
    marginVertical: 2,
  },
  touchableContainer: {
    width: 200,
  },
});

export default DeliveryCard;
