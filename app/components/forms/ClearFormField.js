import React from "react";
import { StyleSheet } from "react-native";

import { useFormikContext } from "formik";

import TextInput from "../ClearTextInput";
import ErrorMessage from "./ErrorMessage";
// import styles from "../../config/styles";

function ClearFormField({ name, width, ...otherProps }) {
  const { setFieldTouched, setFieldValue, errors, touched, values } =
    useFormikContext();

  return (
    <>
      <TextInput
        onBlur={() => setFieldTouched(name)}
        onChangeText={(text) => setFieldValue(name, text)}
        value={values[name]}
        width={width}
        {...otherProps}
        style={styles.input}
      />
      <ErrorMessage error={errors[name]} visible={touched[name]} />
    </>
  );
}

const styles = StyleSheet.create({
  // This made the width of the actual text input short, so you couldn't click the entire form field
  // and enter a value, you could only tap on the beginning section, so it's commented out on style
  input: {
    width: 150,
  },
});

export default ClearFormField;
