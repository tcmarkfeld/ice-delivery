import React, { useState } from "react";
import {
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import * as Yup from "yup";

import ErrorMessage from "../components/forms/ErrorMessage";
import Form from "../components/forms/Form";
import FormField from "../components/forms/FormField";
import SubmitButton from "../components/forms/SubmitButton";
import Text from "../components/Text";

import authApi from "../api/auth";
import useAuth from "../auth/useAuth";
import colors from "../config/colors";

// This will validate the email and password fields ensuring they enter valid values
const validationSchema = Yup.object().shape({
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(4).label("Password"),
});

function LoginScreen() {
  const [loginFailed, setLoginFailed] = useState(false);
  // Stores the auth token once successful login
  const auth = useAuth();
  const handleSubmit = async ({ email, password }) => {
    const result = await authApi.login(email, password);
    // Messages sent from backend if login is unsuccessful
    if (
      result.data.message == "Email is invalid" ||
      result.data.message == "Password is invalid"
    ) {
      return setLoginFailed(true);
    }
    if (!result.ok) return setLoginFailed(true);
    setLoginFailed(false);
    await auth.logIn(result.data, email);
  };
  return (
    <KeyboardAvoidingView behavior="padding">
      <ScrollView showsVerticalScrollIndicator={false}>
        <Image
          style={styles.logo}
          source={require("../assets/ice-delivery.png")}
        />
        <Text style={styles.subtitle}>Corolla Ice Delivery</Text>

        <Form
          initialValues={{ email: "", password: "" }}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          <ErrorMessage
            error="Invalid email and/or password."
            visible={loginFailed}
          />
          <FormField
            autoCapitalize="none"
            autoCorrect={false}
            icon="email"
            keyboardType="email-address"
            name="email"
            placeholder="Email"
            textContentType="emailAddress"
          />
          <FormField
            autoCapitalize="none"
            autoCorrect={false}
            icon="lock"
            name="password"
            placeholder="Password"
            secureTextEntry
            textContentType="password"
          />
          <SubmitButton title="LOGIN" />
        </Form>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    top: "20%",
    justifyContent: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    alignContent: "flex-start",
    margin: "2%",
  },
  logo: {
    width: 225,
    height: 150,
    alignSelf: "center",
    marginTop: 50,
    marginBottom: 20,
  },
  subtitle: {
    alignSelf: "center",
    marginBottom: 50,
    color: colors.medium,
    fontSize: 20,
  },
  signIn: {
    paddingLeft: 15,
    fontSize: 25,
    marginBottom: 15,
    color: colors.medium,
    fontWeight: "800",
  },
});

export default LoginScreen;
