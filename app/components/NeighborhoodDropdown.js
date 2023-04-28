import React, { useState, useEffect } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import colors from "../config/colors";
import AppText from "./Text";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const DropdownComponent = (props) => {
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);

  useEffect(() => {
    // Update the state of the dropdown value when props.value changes
    setValue(props.value);
  }, [props.value]);

  const handleDropdownChange = (item) => {
    setValue(item.value);
    props.onParentCallback(item.value);
    setIsFocus(false);
  };

  const handleOtherFieldChange = (value) => {
    // Update the state of the dropdown value based on the other field value
    setValue(value);
    setIsFocus(true); // Set isFocus to true to make the dropdown appear active
  };

  const data = [
    { label: "Option 1", value: "option1" },
    { label: "Option 2", value: "option2" },
    { label: "Option 3", value: "option3" },
  ];

  return (
    <View>
      {props.label && <AppText style={styles.label}>{props.label}</AppText>}
      <Dropdown
        style={[styles.dropdown, isFocus, props.style]}
        placeholderStyle={styles.placeholderStyle}
        data={props.data || data}
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={!isFocus ? props.placeholder : "..."}
        value={value}
        statusBarIsTranslucent={true}
        activeColor={colors.primary}
        fontFamily={Platform.OS === "android" ? "Roboto" : "Avenir"}
        itemTextStyle={{ color: colors.medium }}
        renderLeftIcon={() => (
          <MaterialCommunityIcons
            name={props.icon}
            size={20}
            color={colors.medium}
            style={styles.icon}
          />
        )}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={handleDropdownChange}
      />
    </View>
  );
};

export default DropdownComponent;

const styles = StyleSheet.create({
  dropdown: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 10,
    marginVertical: 10,
    width: "100%",
    alignItems: "center",
  },
  placeholderStyle: {
    color: colors.medium,
    fontSize: 14,
  },
  label: {
    marginLeft: 1,
    marginBottom: -5,
    color: colors.medium,
  },
  icon: {
    marginRight: 10,
  },
});
