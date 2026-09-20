import React, { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { colors } from "../constants/theme";
import { Card, ProgressBar, AlertCard } from "../components/UI";
import { money } from "../utils/formatters";
import { alertsFor, budgetSummary } from "../calculations/financials";
import { persistBudget } from "../store/budgetSlice";
export default function BudgetScreen() {
  const transactions = useSelector((s) => s.transactions.items),
    saved = useSelector((s) => s.budget.current?.amount),
    dispatch = useDispatch(),
    [input, setInput] = useState(saved ? String(saved) : "");
  const summary = budgetSummary(transactions, saved),
    alerts = alertsFor(transactions, saved).filter((a) => a.level !== "info");
  return (
    <ScrollView style={s.page} contentContainerStyle={s.content}>
      <Text style={s.title}>Monthly budget</Text>
      <Text style={s.sub}>Your spending plan for this month</Text>
      <Card style={s.hero}>
        <Text style={s.heroLabel}>BUDGET USED</Text>
        <Text style={s.big}>{saved ? `${summary.percentage}%` : "—"}</Text>
        <ProgressBar
          value={summary.percentage}
          color={summary.percentage > 100 ? "#FFD2D2" : "#56E39F"}
        />
        <View style={s.row}>
          <View>
            <Text style={s.heroLabel}>SPENT</Text>
            <Text style={s.heroAmount}>{money(summary.spent)}</Text>
          </View>
          <View>
            <Text style={s.heroLabel}>REMAINING</Text>
            <Text
              style={[
                s.heroAmount,
                {
                  color: summary.remaining < 0 ? colors.danger : colors.success,
                },
              ]}
            >
              {money(Math.abs(summary.remaining))}
            </Text>
          </View>
        </View>
      </Card>
      <Card>
        <Text style={s.cardTitle}>Set monthly limit</Text>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="e.g. 25000"
          keyboardType="decimal-pad"
          style={s.input}
        />
        <Pressable
          style={s.button}
          onPress={() => input && dispatch(persistBudget(Number(input)))}
        >
          <Text style={s.buttonText}>Save budget</Text>
        </Pressable>
      </Card>
      {saved && (
        <Card>
          <Text style={s.cardTitle}>Spending pace</Text>
          <View style={s.row}>
            <View>
              <Text style={s.small}>DAILY AVERAGE</Text>
              <Text style={s.amount}>{money(summary.averageDaily)}</Text>
            </View>
            <View>
              <Text style={s.small}>SAFE DAILY SPEND</Text>
              <Text style={s.amount}>{money(summary.safeDaily)}</Text>
            </View>
          </View>
        </Card>
      )}
      {alerts.map((a, i) => (
        <AlertCard key={i} alert={a} />
      ))}
    </ScrollView>
  );
}
const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.canvas },
  content: { padding: 18, gap: 15 },
  title: { fontSize: 27, fontWeight: "800", color: colors.ink, marginTop: 8 },
  sub: { color: colors.muted, marginTop: -10, marginBottom: 5 },
  hero: { backgroundColor: colors.primary },
  label: { color: colors.muted, fontSize: 11, fontWeight: "800" },
  heroLabel: { color: "#E8E8FF", fontSize: 11, fontWeight: "800" },
  big: { fontSize: 39, color: "#fff", fontWeight: "800", marginVertical: 8 },
  row: { flexDirection: "row", justifyContent: "space-between", marginTop: 20 },
  small: { fontSize: 10, fontWeight: "800", color: colors.muted },
  amount: { fontSize: 17, fontWeight: "800", color: colors.ink, marginTop: 4 },
  heroAmount: { fontSize: 17, fontWeight: "800", color: "#FFFFFF", marginTop: 4 },
  heroText: { color: "#fff" },
  cardTitle: { fontWeight: "800", fontSize: 16, color: colors.ink },
  input: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 12,
    padding: 13,
    marginTop: 14,
  },
  button: {
    backgroundColor: colors.primary,
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "#fff", fontWeight: "800" },
});
