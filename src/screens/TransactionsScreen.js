import React, { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../constants/theme";
import { TransactionRow } from "../components/UI";
import TransactionForm from "../components/TransactionForm";
import {
  deleteTransaction,
  persistTransaction,
} from "../store/transactionSlice";
export default function TransactionsScreen() {
  const items = useSelector((s) => s.transactions.items),
    dispatch = useDispatch(),
    [form, setForm] = useState(false),
    [editing, setEditing] = useState(null);
  const close = () => {
    setForm(false);
    setEditing(null);
  };
  const remove = (id) =>
    Alert.alert("Delete transaction?", "This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => dispatch(deleteTransaction(id)),
      },
    ]);
  return (
    <View style={s.page}>
      <View style={s.header}>
        <View>
          <Text style={s.title}>Transactions</Text>
          <Text style={s.sub}>Manual entries for this prototype</Text>
        </View>
        <Pressable onPress={() => setForm(true)} style={s.add}>
          <Ionicons name="add" color="#fff" size={25} />
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={s.list}>
        {items.length ? (
          items.map((t) => (
            <TransactionRow
              key={t.id}
              transaction={t}
              onEdit={() => {
                setEditing(t);
                setForm(true);
              }}
              onDelete={() => remove(t.id)}
            />
          ))
        ) : (
          <Text style={s.empty}>
            No transactions yet. Add one to get started.
          </Text>
        )}
      </ScrollView>
      <TransactionForm
        visible={form}
        transaction={editing}
        onClose={close}
        onSave={async (t) => {
          await dispatch(persistTransaction(t));
          close();
        }}
      />
    </View>
  );
}
const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.canvas },
  header: {
    padding: 18,
    paddingTop: 25,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { fontSize: 27, fontWeight: "800", color: colors.ink },
  sub: { color: colors.muted, fontSize: 13, marginTop: 3 },
  add: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  list: {
    backgroundColor: "#fff",
    marginHorizontal: 18,
    borderRadius: 18,
    paddingHorizontal: 15,
    paddingBottom: 3,
  },
  empty: { color: colors.muted, textAlign: "center", padding: 40 },
});
