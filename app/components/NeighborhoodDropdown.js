import React, { useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import colors from "../config/colors";
import AppText from "./Text";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const DropdownComponent = (props) => {
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);

  const GetValue = () => {
    //this is checking to see if I am already passing in a value from the edit appt screen to automatically fill in the dropdown at the BEGINNING
    if (value == null && props.value != null) {
      //shouldn't pass this condition check if no value is passed on props OR value has already been set once
      setValue(props.value);
    }
    // else if (value != null && props.value == 'refresh') {
    //   //console.log('test');
    //   setValue(null);
    // }
  };

  return (
    <View>
      {GetValue()}
      {props.label && <AppText style={styles.label}>{props.label}</AppText>}
      <Dropdown
        style={[styles.dropdown, isFocus, props.style]}
        placeholderStyle={styles.placeholderStyle}
        data={props.data}
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
        onChange={(item) => {
          setValue(item.value); //for edit appt screen this still sets what is visible in the dropdown if they pick a different test, so user can still pick a new one
          props.onParentCallback(item.value); //passes selected value back
          setIsFocus(false);
        }}
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
  icon: {
    marginRight: 5,
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
