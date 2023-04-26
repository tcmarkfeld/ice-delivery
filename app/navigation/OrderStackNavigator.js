import React from "react";
import {
  createStackNavigator,
  HeaderBackButton,
} from "@react-navigation/stack";

import OrderScreen from "../screens/OrderScreen";
import AllDeliveriesScreen from "../screens/AllDeliveriesScreen";

function OrderStackNavigator() {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator initialRouteName="All Deliveries">
      <Stack.Screen
        options={{ headerShown: false }}
        name="All Deliveries"
        component={AllDeliveriesScreen}
      />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="Order"
        component={OrderScreen}
      />
    </Stack.Navigator>
  );
}

export default OrderStackNavigator;
