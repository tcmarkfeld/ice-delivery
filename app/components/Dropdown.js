import React from "react";
import { StyleSheet, View, Platform } from "react-native";
import { useFormikContext } from "formik";
import { Dropdown } from "react-native-element-dropdown";
import colors from "../config/colors";
import AppText from "./Text";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ErrorMessage from "./forms/ErrorMessage";

const DropdownComponent = ({ name, label, icon, data, ...otherProps }) => {
  const { values, setFieldValue, errors, touched } = useFormikContext();
  const value = values[name];

  const handleValueChange = (itemValue) => {
    setFieldValue(name, itemValue);
  };

  return (
    <View style={{ width: "100%" }}>
      {label && <AppText style={styles.label}>{label}</AppText>}
      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        data={data}
        labelField="label"
        valueField="value"
        placeholder="..."
        value={value}
        activeColor={colors.primary}
        statusBarIsTranslucent={true}
        fontFamily={Platform.OS === "android" ? "Roboto" : "Avenir"}
        itemTextStyle={{ color: colors.medium }}
        renderLeftIcon={() => (
          <MaterialCommunityIcons
            name={icon}
            size={20}
            color={colors.medium}
            style={styles.icon}
          />
        )}
        onChange={handleValueChange}
        containerStyle={{ borderRadius: 8 }}
        dropdownOffset={{ bottom: -100 }}
        dropdownPosition="bottom"
        {...otherProps}
      />
      <ErrorMessage error={errors[name]} visible={touched[name]} />
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
