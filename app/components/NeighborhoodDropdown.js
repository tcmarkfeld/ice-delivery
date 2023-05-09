import React, { useState, useEffect } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import colors from "../config/colors";
import AppText from "./Text";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ErrorMessage from "./forms/ErrorMessage";
import { useFormikContext } from "formik";
import {
  corollaLight,
  sectionA,
  sectionB,
  sectionC,
  sectionD,
  sectionE,
  sectionF,
  hijo,
  klmpq,
  crownPoint,
  spinDrift,
  pineIsland,
  buckIsland,
  oceanHill,
  cruzBay,
  whalehead,
  whaleheadRight,
  monterayShores,
  currituckClub,
} from "../components/Constants";
const DropdownComponent = ({ name, label, icon, data, ...otherProps }) => {
  const { values, setFieldValue, errors, touched } = useFormikContext();
  const [isFocus, setIsFocus] = useState(false);

  const value = values[name];

  useEffect(() => {
    const str = values.delivery_address.replace(/[^a-zA-Z]/g, "").toUpperCase();
    console.log(str);
    if (sectionA.includes(str)) {
      setFieldValue("neighborhood", { label: "Section A", value: 7 });
    } else if (sectionB.includes(str)) {
      setFieldValue("neighborhood", { label: "Section B", value: 8 });
    } else if (sectionC.includes(str)) {
      setFieldValue("neighborhood", { label: "Section C", value: 9 });
    } else if (sectionD.includes(str)) {
      setFieldValue("neighborhood", { label: "Section D", value: 10 });
    } else if (sectionE.includes(str)) {
      setFieldValue("neighborhood", { label: "Section E", value: 11 });
    } else if (sectionF.includes(str)) {
      setFieldValue("neighborhood", { label: "Section F", value: 12 });
    } else if (hijo.includes(str)) {
      setFieldValue("neighborhood", { label: "HIJO", value: 13 });
    } else if (klmpq.includes(str)) {
      setFieldValue("neighborhood", { label: "KLMPQ", value: 14 });
    } else if (crownPoint.includes(str)) {
      setFieldValue("neighborhood", { label: "Crown Point", value: 15 });
    } else if (spinDrift.includes(str)) {
      setFieldValue("neighborhood", { label: "Spindrift", value: 6 });
    } else if (pineIsland.includes(str)) {
      setFieldValue("neighborhood", { label: "Pine Island", value: 5 });
    } else if (buckIsland.includes(str)) {
      setFieldValue("neighborhood", { label: "Buck Island", value: 16 });
    } else if (oceanHill.includes(str)) {
      setFieldValue("neighborhood", { label: "Ocean Hill", value: 1 });
    } else if (corollaLight.includes(str)) {
      setFieldValue("neighborhood", { label: "Corolla Light", value: 2 });
    } else if (cruzBay.includes(str)) {
      setFieldValue("neighborhood", {
        label: "Cruz Bay (Soundfront at Corolla Bay)",
        value: 19,
      });
    } else if (whalehead.includes(str)) {
      setFieldValue("neighborhood", { label: "Whalehead", value: 3 });
    } else if (whaleheadRight.includes(str)) {
      setFieldValue("neighborhood", { label: "Whalehead Right", value: 18 });
    } else if (monterayShores.includes(str)) {
      setFieldValue("neighborhood", { label: "Monteray Shores", value: 17 });
    } else if (currituckClub.includes(str)) {
      setFieldValue("neighborhood", { label: "Currituck Club", value: 4 });
    }
  }, [values["delivery_address"]]);

  const handleDropdownChange = (itemValue) => {
    setFieldValue(name, itemValue);
  };

  return (
    <View>
      {label && <AppText style={styles.label}>{label}</AppText>}
      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        data={data}
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder="Select neighborhood..."
        value={value}
        statusBarIsTranslucent={true}
        activeColor={colors.primary}
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
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={handleDropdownChange}
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
