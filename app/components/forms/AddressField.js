import React from "react";

import { useFormikContext } from "formik";

import TextInput from "../TextInput";
import ErrorMessage from "./ErrorMessage";

function AddressFormField({ name, width, onParentCallback, ...otherProps }) {
  const { setFieldTouched, setFieldValue, values, errors, touched } =
    useFormikContext();

  const handleOnChangeText = (name, text) => {
    setFieldTouched(name);
    setFieldValue(name, text);
    onParentCallback(text); // Call the function passed down from the parent component
  };

  return (
    <>
      <TextInput
        onBlur={() => setFieldTouched(name)}
        onChangeText={(text) => handleOnChangeText(name, text)}
        value={values[name]}
        width={width}
        {...otherProps}
      />
      <ErrorMessage error={errors[name]} visible={touched[name]} />
    </>
  );
}

export default AddressFormField;
