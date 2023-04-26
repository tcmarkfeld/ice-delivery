import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

import colors from "../config/colors";

function SaveButton({
  title,
  onPress,
  color = "primary",
  buttonStyle,
  textStyle,
}) {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: colors[color] }]}
      onPress={onPress}
    >
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.grey,
    borderRadius: 2,
    justifyContent: "center",
    alignItems: "center",
    height: 40,
    width: "4%",
    marginVertical: 2.5,
    marginLeft: 5,
  },
  text: {
    color: colors.white,
    fontSize: 16,
    textTransform: "uppercase",
    fontWeight: "bold",
  },
});

export default SaveButton;
