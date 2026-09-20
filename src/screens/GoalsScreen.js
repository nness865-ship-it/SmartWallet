import React, { useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../constants/theme";
import { Card, ProgressBar } from "../components/UI";
import { money, today } from "../utils/formatters";
import { goalProgress } from "../calculations/financials";
import { addToGoal, createGoal, deleteGoal } from "../store/goalSlice";
import { persistTransaction } from "../store/transactionSlice";
export default function GoalsScreen() {
  const goals = useSelector((s) => s.goals.items),
    dispatch = useDispatch(),
    [modal, setModal] = useState(false),
    [name, setName] = useState(""),
    [target, setTarget] = useState(""),
    [contribute, setContribute] = useState(null),
    [transferType, setTransferType] = useState("add"),
    [amount, setAmount] = useState("");
  const save = async () => {
    if (name && target) {
      await dispatch(
        createGoal({ name, target_amount: Number(target), current_amount: 0 }),
      );
      setName("");
      setTarget("");
      setModal(false);
    }
  };
  const transfer = async () => {
    const value = Number(amount);
    if (!value || value <= 0) return;
    if (transferType === "remove" && value > Number(contribute.current_amount)) return;
    const isWithdrawal = transferType === "remove";
    await dispatch(addToGoal({ id: contribute.id, amount: isWithdrawal ? -value : value }));
    await dispatch(persistTransaction({
      amount: value,
      type: isWithdrawal ? "income" : "expense",
      category: "Goals",
      merchant: `${isWithdrawal ? "Withdrawal from" : "Contribution to"} ${contribute.name}`,
      date: today(),
      source: isWithdrawal ? "goal_withdrawal" : "goal_contribution",
    }));
    setContribute(null);
  };
  return (
    <View style={s.page}>
      <View style={s.header}>
        <View>
          <Text style={s.title}>Financial goals</Text>
          <Text style={s.sub}>Turn plans into progress</Text>
        </View>
        <Pressable style={s.add} onPress={() => setModal(true)}>
          <Ionicons name="add" color="#fff" size={25} />
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={s.list}>
        {goals.length ? (
          goals.map((g) => {
            const pct = goalProgress(g);
            return (
              <Card key={g.id} style={s.goal}>
                <View style={s.goalHead}>
                  <View>
                    <Text style={s.goalName}>{g.name}</Text>
                    <Text style={s.meta}>
                      {money(g.current_amount)} of {money(g.target_amount)}
                    </Text>
                  </View>
                  <Pressable
                    onPress={() =>
                      Alert.alert("Delete goal?", g.name, [
                        { text: "Cancel", style: "cancel" },
                        {
                          text: "Delete",
                          style: "destructive",
                          onPress: () => dispatch(deleteGoal(g.id)),
                        },
                      ])
                    }
                  >
                    <Ionicons
                      name="trash-outline"
                      size={19}
                      color={colors.muted}
                    />
                  </Pressable>
                </View>
                <ProgressBar value={pct} color={colors.teal} />
                <View style={s.goalBottom}>
                  <Text style={s.percent}>{pct}% complete</Text>
                  <View style={s.goalActions}>
                    <Pressable onPress={() => { setContribute(g); setTransferType("remove"); setAmount(""); }}>
                      <Text style={s.removeMoney}>Withdraw</Text>
                    </Pressable>
                    <Pressable onPress={() => { setContribute(g); setTransferType("add"); setAmount(""); }}>
                      <Text style={s.addMoney}>Add money</Text>
                    </Pressable>
                  </View>
                </View>
              </Card>
            );
          })
        ) : (
          <Text style={s.empty}>
            Create a goal for something you are saving toward.
          </Text>
        )}
      </ScrollView>
      <Modal visible={modal} transparent animationType="slide">
        <View style={s.back}>
          <View style={s.sheet}>
            <Text style={s.sheetTitle}>New financial goal</Text>
            <TextInput
              placeholder="Goal name, e.g. New laptop"
              value={name}
              onChangeText={setName}
              style={s.input}
            />
            <TextInput
              placeholder="Target amount"
              value={target}
              onChangeText={setTarget}
              keyboardType="decimal-pad"
              style={s.input}
            />
            <Pressable style={s.button} onPress={save}>
              <Text style={s.buttonText}>Create goal</Text>
            </Pressable>
            <Pressable onPress={() => setModal(false)}>
              <Text style={s.close}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <Modal visible={!!contribute} transparent animationType="fade">
        <View style={s.back}>
          <View style={s.sheet}>
            <Text style={s.sheetTitle}>{transferType === "add" ? "Add to" : "Withdraw from"} {contribute?.name}</Text>
            <TextInput
              placeholder="Amount"
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
              style={s.input}
            />
            <Pressable
              style={s.button}
              onPress={transfer}
            >
              <Text style={s.buttonText}>{transferType === "add" ? "Add money" : "Withdraw money"}</Text>
            </Pressable>
            <Pressable onPress={() => setContribute(null)}>
              <Text style={s.close}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}
const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.canvas },
  header: {
    padding: 18,
    paddingTop: 25,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
  list: { padding: 18, gap: 12 },
  goal: { gap: 14 },
  goalHead: { flexDirection: "row", justifyContent: "space-between" },
  goalName: { fontSize: 17, fontWeight: "800", color: colors.ink },
  meta: { color: colors.muted, marginTop: 3 },
  goalBottom: { flexDirection: "row", justifyContent: "space-between" },
  goalActions: { flexDirection: "row", gap: 16 },
  percent: { color: colors.teal, fontWeight: "800" },
  addMoney: { color: colors.primary, fontWeight: "800" },
  removeMoney: { color: colors.muted, fontWeight: "800" },
  empty: { color: colors.muted, textAlign: "center", padding: 45 },
  back: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(20,30,50,.35)",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 22,
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.ink,
    marginBottom: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 12,
    padding: 13,
    marginBottom: 10,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    marginTop: 4,
  },
  buttonText: { color: "#fff", fontWeight: "800" },
  close: {
    textAlign: "center",
    color: colors.muted,
    fontWeight: "700",
    paddingTop: 16,
  },
});
