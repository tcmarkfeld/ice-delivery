import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import defaultStyles from "../config/styles";
import colors from "../config/colors";

function ClearTextInput({ width = "100%", ...otherProps }) {
  return (
    <View style={[styles.container, { width }]}>
      <TextInput
        placeholderTextColor={defaultStyles.colors.medium}
        style={styles.test}
        {...otherProps}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    // borderRadius: 25,
    borderColor: colors.light,
    borderWidth: 0.25,
    flexDirection: "row",
    padding: 5,
    // marginVertical: 10,
    flex: 1,
  },
  test: {
    width: "100%",
  },
});

export default ClearTextInput;
