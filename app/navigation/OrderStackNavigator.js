import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import OrderScreen from "../screens/OrderScreen";
import AllDeliveriesScreen from "../screens/AllDeliveriesScreen";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../config/colors";
import { TouchableOpacity } from "react-native";

function OrderStackNavigator() {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator
      initialRouteName="All Deliveries"
      screenOptions={({ navigation }) => ({
        headerTintColor: colors.lightgrey,
        headerStyle: {
          backgroundColor: colors.onyx,
        },
        headerLeft: ({ canGoBack }) => {
          if (canGoBack)
            return (
              <TouchableOpacity
                onPress={() => {
                  navigation.goBack();
                }}
              >
                <MaterialCommunityIcons
                  name="chevron-left"
                  size={30}
                  color={colors.lightgrey}
                  style={{ marginLeft: 15 }}
                />
              </TouchableOpacity>
            );
          return null;
        },
      })}
    >
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitleAlign: "center",
        }}
        name="All Deliveries"
        component={AllDeliveriesScreen}
      />
      <Stack.Screen
        name="Edit Order"
        options={{ headerTitleAlign: "center" }}
        component={OrderScreen}
      />
    </Stack.Navigator>
  );
}

export default OrderStackNavigator;
