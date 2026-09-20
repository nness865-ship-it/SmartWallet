import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";
import {
  Card,
  ProgressBar,
  SectionTitle,
  AlertCard,
  TransactionRow,
} from "../components/UI";
import { colors } from "../constants/theme";
import { money } from "../utils/formatters";
import {
  alertsFor,
  budgetSummary,
  totalExpenses,
  totalIncome,
} from "../calculations/financials";
export default function HomeScreen() {
  const transactions = useSelector((s) => s.transactions.items);
  const amount = useSelector((s) => s.budget.current?.amount);
  const income = totalIncome(transactions),
    expenses = totalExpenses(transactions),
    summary = budgetSummary(transactions, amount),
    alerts = alertsFor(transactions, amount);
  const greeting =
    new Date().getHours() < 12
      ? "Good morning"
      : new Date().getHours() < 17
        ? "Good afternoon"
        : "Good evening";
  return (
    <ScrollView style={s.page} contentContainerStyle={s.content}>
      <Text style={s.greeting}>{greeting}</Text>
      <Text style={s.balance}>{money(income - expenses)}</Text>
      <Text style={s.sub}>Current balance</Text>
      <View style={s.stats}>
        <Card style={s.stat}>
          <Text style={s.label}>INCOME</Text>
          <Text style={[s.statValue, { color: colors.success }]}>
            {money(income)}
          </Text>
        </Card>
        <Card style={s.stat}>
          <Text style={s.label}>EXPENSES</Text>
          <Text style={[s.statValue, { color: colors.danger }]}>
            {money(expenses)}
          </Text>
        </Card>
      </View>
      <SectionTitle>Monthly budget</SectionTitle>
      <Card>
        <View style={s.budgetHead}>
          <View>
            <Text style={s.label}>YOUR BUDGET</Text>
            <Text style={s.budget}>{amount ? money(amount) : "Not set"}</Text>
          </View>
          <Text style={s.percent}>
            {amount ? `${summary.percentage}%` : ""}
          </Text>
        </View>
        {amount ? (
          <>
            <ProgressBar
              value={summary.percentage}
              color={summary.percentage > 100 ? colors.danger : colors.primary}
            />
            <View style={s.budgetFoot}>
              <Text>{money(summary.spent)} spent</Text>
              <Text
                style={{
                  color: summary.remaining < 0 ? colors.danger : colors.success,
                }}
              >
                {money(Math.abs(summary.remaining))}{" "}
                {summary.remaining < 0 ? "over" : "remaining"}
              </Text>
            </View>
          </>
        ) : (
          <Text style={s.hint}>
            Set a budget in the Budget tab to track your monthly plan.
          </Text>
        )}
      </Card>
      {alerts.length > 0 && (
        <>
          <SectionTitle>Smart alerts</SectionTitle>
          {alerts.map((a, i) => (
            <AlertCard key={i} alert={a} />
          ))}
        </>
      )}
      <SectionTitle>Recent transactions</SectionTitle>
      <Card style={{ paddingVertical: 3 }}>
        {transactions.length ? (
          transactions
            .slice(0, 5)
            .map((t) => <TransactionRow transaction={t} key={t.id} />)
        ) : (
          <Text style={s.empty}>Your recent activity will appear here.</Text>
        )}
      </Card>
    </ScrollView>
  );
}
const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.canvas },
  content: { padding: 18, paddingBottom: 30 },
  greeting: { fontSize: 15, color: colors.muted, marginTop: 8 },
  balance: { fontSize: 35, fontWeight: "800", color: colors.ink, marginTop: 4 },
  sub: { color: colors.muted, fontSize: 13 },
  stats: { flexDirection: "row", gap: 12, marginVertical: 22 },
  stat: { flex: 1 },
  label: {
    fontSize: 11,
    fontWeight: "800",
    color: colors.muted,
    letterSpacing: 0.4,
  },
  statValue: { fontSize: 18, fontWeight: "800", marginTop: 6 },
  budgetHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  budget: { fontSize: 22, fontWeight: "800", color: colors.ink, marginTop: 3 },
  percent: { fontWeight: "800", fontSize: 20, color: colors.primary },
  budgetFoot: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    color: colors.muted,
  },
  hint: { color: colors.muted, lineHeight: 20 },
  empty: { padding: 16, color: colors.muted, textAlign: "center" },
});
