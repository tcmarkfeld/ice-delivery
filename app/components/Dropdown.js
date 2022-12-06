import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import colors from "../config/colors";

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
      <Dropdown
        style={[styles.dropdown, isFocus, props.style]}
        placeholderStyle={styles.placeholderStyle}
        // selectedTextStyle={styles.selectedTextStyle}
        //inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={props.data}
        //search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={!isFocus ? props.placeholder : "..."}
        //searchPlaceholder="Search..."
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(item) => {
          setValue(item.value); //for edit appt screen this still sets what is visible in the dropdown if they pick a different test, so user can still pick a new one
          props.onParentCallback(item.label); //passes selected test back to parent edit appt screen
          setIsFocus(false);
        }}
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
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    color: "gray",
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
