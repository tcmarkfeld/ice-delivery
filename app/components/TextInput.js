import React from "react";
import { View, TextInput, StyleSheet, Platform } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import defaultStyles from "../config/styles";
import colors from "../config/colors";
import AppText from "./Text";

function AppTextInput({ icon, label, width = "100%", ...otherProps }) {
  return (
    <View style={{ width }}>
      {label && <AppText style={styles.label}>{label}</AppText>}
      <View style={styles.container}>
        {icon && (
          <MaterialCommunityIcons
            name={icon}
            size={20}
            color={defaultStyles.colors.medium}
            style={styles.icon}
          />
        )}
        <TextInput
          placeholderTextColor={defaultStyles.colors.medium}
          style={styles.test}
          {...otherProps}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 8,
    flexDirection: "row",
    padding: 15,
    marginVertical: 10,
    alignItems: "center",
  },
  test: {
    width: "100%",
    fontFamily: Platform.OS === "android" ? "Roboto" : "Avenir",
  },
  icon: {
    marginRight: 10,
  },
  label: {
    marginLeft: 1,
    marginBottom: -5,
    color: colors.medium,
  },
});

export default AppTextInput;
