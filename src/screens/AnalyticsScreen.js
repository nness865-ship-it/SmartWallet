import React from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";
import { LineChart, PieChart } from "react-native-chart-kit";
import { colors, categoryColors } from "../constants/theme";
import { Card, SectionTitle } from "../components/UI";
import { money } from "../utils/formatters";
import {
  budgetSummary,
  categorySpending,
  monthlyTransactions,
  spendingTrend,
  totalExpenses,
  totalIncome,
} from "../calculations/financials";
const width = Dimensions.get("window").width - 36;
const chart = {
  backgroundGradientFrom: "#fff",
  backgroundGradientTo: "#fff",
  decimalPlaces: 0,
  color: (o = 1) => `rgba(91,92,226,${o})`,
  labelColor: () => colors.muted,
  propsForDots: { r: "4", strokeWidth: "2", stroke: colors.primary },
};
export default function AnalyticsScreen() {
  const transactions = useSelector((s) => s.transactions.items),
    budget = useSelector((s) => s.budget.current?.amount),
    month = monthlyTransactions(transactions),
    expenses = totalExpenses(month),
    income = totalIncome(month),
    categories = categorySpending(month),
    trend = spendingTrend(transactions),
    summary = budgetSummary(transactions, budget);
  const pie = categories.map((x, i) => ({
    name: x.name,
    population: x.amount,
    color: categoryColors[i % categoryColors.length],
    legendFontColor: colors.muted,
    legendFontSize: 12,
  }));
  return (
    <ScrollView style={s.page} contentContainerStyle={s.content}>
      <Text style={s.title}>Analytics</Text>
      <Text style={s.sub}>This month’s financial picture</Text>
      <View style={s.top}>
        <Card style={s.stat}>
          <Text style={s.label}>TOTAL SPENDING</Text>
          <Text style={s.red}>{money(expenses)}</Text>
        </Card>
        <Card style={s.stat}>
          <Text style={s.label}>TRANSACTIONS</Text>
          <Text style={s.value}>{month.length}</Text>
        </Card>
      </View>
      <Card>
        <Text style={s.cardTitle}>Income vs expenses</Text>
        <View style={s.compare}>
          <View>
            <Text style={s.label}>INCOME</Text>
            <Text style={[s.value, { color: colors.success }]}>
              {money(income)}
            </Text>
          </View>
          <View>
            <Text style={s.label}>EXPENSES</Text>
            <Text style={s.red}>{money(expenses)}</Text>
          </View>
          <View>
            <Text style={s.label}>BUDGET</Text>
            <Text style={s.value}>
              {budget ? `${summary.percentage}%` : "—"}
            </Text>
          </View>
        </View>
      </Card>
      <SectionTitle>Spending trend</SectionTitle>
      <Card style={s.chartCard}>
        <LineChart
          data={{
            labels: trend.map((t) => t.label),
            datasets: [{ data: trend.map((t) => t.amount || 0) }],
          }}
          width={width - 36}
          height={190}
          chartConfig={chart}
          bezier
          style={s.chart}
        />
      </Card>
      <SectionTitle>Spending by category</SectionTitle>
      <Card style={s.chartCard}>
        {pie.length ? (
          <PieChart
            data={pie}
            width={width - 36}
            height={210}
            chartConfig={chart}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="0"
            absolute
          />
        ) : (
          <Text style={s.empty}>
            Add expense transactions to see your category chart.
          </Text>
        )}
      </Card>
      {categories.length > 0 && (
        <Card>
          <Text style={s.cardTitle}>Category breakdown</Text>
          {categories.map((x) => (
            <View key={x.name} style={s.breakdown}>
              <Text style={s.category}>{x.name}</Text>
              <Text style={s.value}>{money(x.amount)}</Text>
            </View>
          ))}
        </Card>
      )}
    </ScrollView>
  );
}
const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.canvas },
  content: { padding: 18, gap: 15 },
  title: { fontSize: 27, fontWeight: "800", color: colors.ink, marginTop: 8 },
  sub: { color: colors.muted, marginTop: -10, marginBottom: 5 },
  top: { flexDirection: "row", gap: 12 },
  stat: { flex: 1 },
  label: { fontSize: 10, fontWeight: "800", color: colors.muted },
  value: { fontSize: 18, fontWeight: "800", color: colors.ink, marginTop: 6 },
  red: { fontSize: 18, fontWeight: "800", color: colors.danger, marginTop: 6 },
  cardTitle: { fontSize: 16, fontWeight: "800", color: colors.ink },
  compare: { flexDirection: "row", justifyContent: "space-between" },
  chartCard: { padding: 5, alignItems: "center" },
  chart: { borderRadius: 16 },
  empty: { padding: 30, textAlign: "center", color: colors.muted },
  breakdown: {
    paddingVertical: 11,
    borderBottomColor: colors.line,
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  category: { color: colors.ink, fontWeight: "700" },
});
