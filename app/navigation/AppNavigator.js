import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import AddDeliveryScreen from "../screens/AddDeliveryScreen";
import DeliveryScreen from "../screens/DeliveryScreen";
import NewListingButton from "./NewListingButton";
import routes from "./routes";
import colors from "../config/colors";
import OrderStackNavigator from "./OrderStackNavigator";
import { Button } from "react-native";

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Deliveries"
        component={DeliveryScreen}
        options={{
          headerTitleAlign: "center",
          tabBarStyle: {
            elevation: 5, // set elevation to add a shadow
            shadowColor: "black",
            shadowOffset: { width: 0, height: 2 },
          },
          headerStyle: {
            elevation: 5,
            shadowColor: colors.grey,
            shadowOffset: { width: 0, height: 1 },
          },
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name={(props) => {
          <>
            <Button title="Back"></Button>
            <Text headerStyle={"center"}>Add Delivery</Text>
          </>;
        }}
        component={AddDeliveryScreen}
        options={{
          headerTitleAlign: "center",
          tabBarStyle: {
            elevation: 5, // set elevation to add a shadow
            shadowColor: "black",
            shadowOffset: { width: 0, height: 2 },
          },
          headerStyle: {
            elevation: 5,
            shadowColor: colors.grey,
            shadowOffset: { width: 0, height: 1 },
          },
          // tabBarButton: () => (
          //   <NewListingButton
          //     onPress={() => navigation.navigate(routes.ADD_DELIVERY)}
          //   />
          // ),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="plus-box" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Orders"
        component={OrderStackNavigator}
        options={{
          headerTitle: "All Deliveries",
          headerTitleAlign: "center",
          tabBarStyle: {
            elevation: 5, // set elevation to add a shadow
            shadowColor: "black",
            shadowOffset: { width: 0, height: 2 },
          },
          headerStyle: {
            elevation: 5,
            shadowColor: colors.grey,
            shadowOffset: { width: 0, height: 1 },
          },
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="archive" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default AppNavigator;
