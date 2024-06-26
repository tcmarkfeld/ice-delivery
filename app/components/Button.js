import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import Text from "./Text";

import colors from "../config/colors";

function AppButton({
  title,
  onPress,
  color = "primary",
  buttonStyle,
  textStyle,
}) {
  return (
    <TouchableOpacity
      style={[styles.button, buttonStyle, { backgroundColor: colors[color] }]}
      onPress={onPress}
    >
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    width: "100%",
    marginVertical: 10,
  },
  text: {
    color: colors.white,
    fontSize: 18,
    textTransform: "uppercase",
    letterSpacing: 2,
    fontWeight: "bold",
  },
});

export default AppButton;
