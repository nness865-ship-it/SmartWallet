import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../constants/theme";
import { money, shortDate } from "../utils/formatters";

export function Card({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>;
}
export function ProgressBar({ value, color = colors.primary }) {
  return (
    <View style={styles.track}>
      <View
        style={[
          styles.fill,
          {
            width: `${Math.min(100, Math.max(0, value))}%`,
            backgroundColor: color,
          },
        ]}
      />
    </View>
  );
}
export function SectionTitle({ children, action, onPress }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{children}</Text>
      {action && (
        <Pressable onPress={onPress}>
          <Text style={styles.action}>{action}</Text>
        </Pressable>
      )}
    </View>
  );
}
export function AlertCard({ alert }) {
  const icon =
    alert.level === "danger"
      ? "alert-circle"
      : alert.level === "warning"
        ? "warning"
        : "bulb";
  const color =
    alert.level === "danger"
      ? colors.danger
      : alert.level === "warning"
        ? colors.warning
        : colors.primary;
  return (
    <View style={[styles.alert, { borderLeftColor: color }]}>
      <Ionicons name={icon} size={20} color={color} />
      <Text style={styles.alertText}>{alert.text}</Text>
    </View>
  );
}
export function TransactionRow({ transaction, onEdit, onDelete }) {
  const expense = transaction.type === "expense";
  return (
    <View style={styles.transaction}>
      <View
        style={[
          styles.avatar,
          { backgroundColor: expense ? "#FFF1F1" : "#EAF9F2" },
        ]}
      >
        <Ionicons
          name={expense ? "arrow-up" : "arrow-down"}
          color={expense ? colors.danger : colors.success}
          size={18}
        />
      </View>
      <View style={styles.txInfo}>
        <Text style={styles.merchant}>{transaction.merchant}</Text>
        <Text style={styles.meta}>
          {transaction.category} · {shortDate(transaction.date)}
        </Text>
      </View>
      <Text
        style={[
          styles.amount,
          { color: expense ? colors.danger : colors.success },
        ]}
      >
        {expense ? "-" : "+"}
        {money(transaction.amount)}
      </Text>
      {onEdit && (
        <Pressable onPress={onEdit} hitSlop={8}>
          <Ionicons name="pencil-outline" size={18} color={colors.muted} />
        </Pressable>
      )}
      {onDelete && (
        <Pressable onPress={onDelete} hitSlop={8}>
          <Ionicons name="trash-outline" size={18} color={colors.muted} />
        </Pressable>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 18,
    shadowColor: "#1E2B4A",
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  track: {
    height: 9,
    backgroundColor: "#E8EBF3",
    borderRadius: 9,
    overflow: "hidden",
  },
  fill: { height: "100%", borderRadius: 9 },
  section: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  sectionTitle: { fontSize: 17, fontWeight: "700", color: colors.ink },
  action: { fontWeight: "700", color: colors.primary },
  alert: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 14,
    borderRadius: 12,
    borderLeftWidth: 4,
    marginBottom: 9,
  },
  alertText: { flex: 1, color: colors.ink, lineHeight: 19, fontSize: 13 },
  transaction: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  txInfo: { flex: 1 },
  merchant: { fontSize: 15, fontWeight: "700", color: colors.ink },
  meta: { fontSize: 12, color: colors.muted, marginTop: 2 },
  amount: { fontWeight: "800", fontSize: 14 },
});
