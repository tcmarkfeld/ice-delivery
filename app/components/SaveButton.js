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
  //used on LoginScreen and RegisterScreen and HomeScreen(additional edi on screen)
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
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    height: 25,
    // width: "100%",
    marginVertical: 10,
  },
  text: {
    color: colors.white,
    fontSize: 18,
    textTransform: "uppercase",
    fontWeight: "bold",
  },
});

export default SaveButton;
