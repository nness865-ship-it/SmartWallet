import React, { useEffect, useState } from "react";
import { ActivityIndicator, StatusBar, StyleSheet, View } from "react-native";
import { Provider } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { store } from "./src/store/store";
import { initializeDatabase } from "./src/database/database";
import { loadTransactions } from "./src/store/transactionSlice";
import { loadBudget } from "./src/store/budgetSlice";
import { loadGoals } from "./src/store/goalSlice";
import AppTabs from "./src/navigation/AppTabs";

function Bootstrap() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    async function start() {
      await initializeDatabase();
      await Promise.all([
        store.dispatch(loadTransactions()),
        store.dispatch(loadBudget()),
        store.dispatch(loadGoals()),
      ]);
      setReady(true);
    }
    start();
  }, []);
  if (!ready)
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#5B5CE2" />
      </View>
    );
  return (
    <SafeAreaView style={styles.safeArea}>
      <NavigationContainer>
        <AppTabs />
      </NavigationContainer>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <StatusBar barStyle="dark-content" />
        <Bootstrap />
      </SafeAreaProvider>
    </Provider>
  );
}
const styles = StyleSheet.create({
  loader: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F6F8FC",
  },
  safeArea: { flex: 1 },
});
