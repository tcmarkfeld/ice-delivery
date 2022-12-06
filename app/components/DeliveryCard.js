import React from "react";
import { StyleSheet, Text, View } from "react-native";

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
}) {
  return (
    <View style={styles.container}>
      <Text style={ending == true ? styles.ending : styles.current}>
        {cooler} {ice} ice
      </Text>
      <Text style={ending == true ? styles.ending : styles.current}>
        {address}
      </Text>
      <Text style={ending == true ? styles.ending : styles.current}>
        Starts: {start}
      </Text>
      <Text style={ending == true ? styles.ending : styles.current}>
        Ends: {end}
      </Text>
      <Text style={ending == true ? styles.ending : styles.current}>
        {name}
      </Text>
      <Text style={ending == true ? styles.ending : styles.current}>
        {phone}
      </Text>
      <Text style={ending == true ? styles.ending : styles.current}>
        {email}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.grey,
    padding: 10,
    marginLeft: 10,
    marginRight: 10,
    marginVertical: 10,
    borderRadius: 10,
  },
  ending: {
    color: colors.danger,
    fontSize: 15,
    marginVertical: 2.5,
  },
  current: {
    fontSize: 15,
    marginVertical: 2.5,
  },
});

export default DeliveryCard;
