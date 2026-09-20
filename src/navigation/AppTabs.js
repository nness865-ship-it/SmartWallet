import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../constants/theme";
import HomeScreen from "../screens/HomeScreen";
import TransactionsScreen from "../screens/TransactionsScreen";
import BudgetScreen from "../screens/BudgetScreen";
import AnalyticsScreen from "../screens/AnalyticsScreen";
import GoalsScreen from "../screens/GoalsScreen";
const Tab = createBottomTabNavigator();
const screens = {
  Home: HomeScreen,
  Transactions: TransactionsScreen,
  Budget: BudgetScreen,
  Analytics: AnalyticsScreen,
  Goals: GoalsScreen,
};
export default function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: "#9AA4B5",
        tabBarStyle: { height: 66, paddingTop: 7 },
        tabBarIcon: ({ color, size }) => (
          <Ionicons
            name={
              {
                Home: "home",
                Transactions: "swap-horizontal",
                Budget: "wallet",
                Analytics: "bar-chart",
                Goals: "flag",
              }[route.name]
            }
            size={size}
            color={color}
          />
        ),
      })}
    >
      {Object.entries(screens).map(([name, component]) => (
        <Tab.Screen key={name} name={name} component={component} />
      ))}
    </Tab.Navigator>
  );
}
