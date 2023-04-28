import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { View } from "react-native";

import AddDeliveryScreen from "../screens/AddDeliveryScreen";
import DeliveryScreen from "../screens/DeliveryScreen";
import OrderStackNavigator from "./OrderStackNavigator";
import colors from "../config/colors";

const Tab = createBottomTabNavigator();

const TAB_ICON = {
  Deliveries: "home",
  AddDelivery: "plus-box",
  Orders: "archive",
};

const activeTab = (focused, size, color, iconName) => {
  return focused ? (
    <View
      style={{
        borderTopWidth: 2,
        width: "100%",
        height: "100%",
        borderColor: colors.primary,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <MaterialCommunityIcons name={iconName} size={size} color={color} />
    </View>
  ) : (
    <MaterialCommunityIcons name={iconName} size={size} color={color} />
  );
};

const iconOptions = ({ route }) => {
  const iconName = TAB_ICON[route.name];
  return {
    tabBarIcon: ({ focused, size, color }) =>
      activeTab(focused, 24, color, iconName),
    headerShown: true,
    headerTitleAlign: "center",
    tabBarHideOnKeyboard: true,
    tabBarInactiveTintColor: colors.lightgrey,
    headerTintColor: colors.lightgrey,
    tabBarStyle: {
      backgroundColor: colors.onyx,
    },
    headerStyle: {
      backgroundColor: colors.onyx,
    },
  };
};

export const TabNavigator = () => {
  return (
    <Tab.Navigator screenOptions={iconOptions}>
      <Tab.Screen
        name="Deliveries"
        component={DeliveryScreen}
        options={{ title: "Deliveries" }}
      ></Tab.Screen>
      <Tab.Screen
        name="AddDelivery"
        component={AddDeliveryScreen}
        options={{
          title: "Add Delivery",
          tabBarIconStyle: ({ focused }) => (
            (borderTopWidth = 2), (borderColor = "black")
          ),
        }}
      ></Tab.Screen>
      <Tab.Screen
        name="Orders"
        component={OrderStackNavigator}
        options={{
          headerShown: false,
          tabBarIconStyle: ({ focused }) => (
            (borderTopWidth = 2), (borderColor = "black")
          ),
        }}
      ></Tab.Screen>
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        headerTitleAlign: "center",
        tabBarHideOnKeyboard: true,
        tabBarInactiveTintColor: colors.lightgrey,
        headerTintColor: colors.lightgrey,
        tabBarStyle: {
          backgroundColor: colors.onyx,
        },
        headerStyle: {
          backgroundColor: colors.onyx,
        },
      }}
    >
      <Tab.Screen
        name="Deliveries"
        component={DeliveryScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Add Delivery"
        component={AddDeliveryScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="plus-box" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="All Deliveries"
        component={OrderStackNavigator}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="archive" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
