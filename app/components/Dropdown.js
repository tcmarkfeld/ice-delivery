import React, { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import colors from "../config/colors";

const DropdownComponent = (props) => {
  const [value, setValue] = useState(props.value);
  const [isFocus, setIsFocus] = useState(false);

  useEffect(() => {
    if (props.value != null) {
      setValue(props.value);
    }
  }, [props.value]);

  return (
    <View>
      <Dropdown
        style={[styles.dropdown, isFocus, props.style]}
        placeholderStyle={styles.placeholderStyle}
        iconStyle={styles.iconStyle}
        data={props.data}
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={!isFocus ? props.placeholder : "..."}
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(item) => {
          setValue(item.value);
          props.onParentCallback(item.label);
          setIsFocus(false);
        }}
        dropdownOffset={{ bottom: -100 }}
        dropdownPosition="bottom"
      />
    </View>
  );
};

export default DropdownComponent;

const styles = StyleSheet.create({
  dropdown: {
    backgroundColor: colors.light,
    borderRadius: 25,
    padding: 10,
    marginVertical: 10,
  },
  placeholderStyle: {
    color: "gray",
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
});
