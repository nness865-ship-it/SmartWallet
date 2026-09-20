import React, { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { categories, colors } from "../constants/theme";
import { today } from "../utils/formatters";
export default function TransactionForm({
  visible,
  transaction,
  onClose,
  onSave,
}) {
  const [form, setForm] = useState({
    amount: "",
    type: "expense",
    category: "Food",
    merchant: "",
    date: today(),
  });
  const [picker, setPicker] = useState(false);
  useEffect(() => {
    setForm(
      transaction
        ? { ...transaction, amount: String(transaction.amount) }
        : {
            amount: "",
            type: "expense",
            category: "Food",
            merchant: "",
            date: today(),
          },
    );
  }, [transaction, visible]);
  const save = () => {
    if (!form.amount || !form.merchant) return;
    onSave({
      ...form,
      amount: Number(form.amount),
      source: form.source || "manual",
    });
  };
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={s.backdrop}>
        <View style={s.sheet}>
          <View style={s.top}>
            <Text style={s.title}>
              {transaction ? "Edit transaction" : "Add transaction"}
            </Text>
            <Pressable onPress={onClose}>
              <Text style={s.cancel}>Close</Text>
            </Pressable>
          </View>
          <Text style={s.label}>Amount</Text>
          <TextInput
            value={form.amount}
            onChangeText={(amount) => setForm({ ...form, amount })}
            placeholder="0"
            keyboardType="decimal-pad"
            style={s.input}
          />
          <View style={s.types}>
            {["expense", "income"].map((type) => (
              <Pressable
                key={type}
                onPress={() =>
                  setForm({
                    ...form,
                    type,
                    category: type === "income" ? "Income" : form.category === "Income" ? "Food" : form.category,
                  })
                }
                style={[s.chip, form.type === type && s.chipActive]}
              >
                <Text style={[s.chipText, form.type === type && s.activeText]}>
                  {type[0].toUpperCase() + type.slice(1)}
                </Text>
              </Pressable>
            ))}
          </View>
          {form.type === "expense" && (
            <>
              <Text style={s.label}>Category</Text>
              <View style={s.categories}>
                {categories.map((category) => (
                  <Pressable
                    key={category}
                    onPress={() => setForm({ ...form, category })}
                    style={[
                      s.category,
                      form.category === category && s.categoryActive,
                    ]}
                  >
                    <Text
                      style={[
                        s.categoryText,
                        form.category === category && s.activeText,
                      ]}
                    >
                      {category}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </>
          )}
          <Text style={s.label}>Merchant or description</Text>
          <TextInput
            value={form.merchant}
            onChangeText={(merchant) => setForm({ ...form, merchant })}
            placeholder="e.g. Swiggy"
            style={s.input}
          />
          <Text style={s.label}>Date</Text>
          <Pressable onPress={() => setPicker(true)} style={s.input}>
            <Text>{form.date}</Text>
          </Pressable>
          {picker && (
            <DateTimePicker
              value={new Date(`${form.date}T12:00:00`)}
              mode="date"
              onChange={(e, d) => {
                setPicker(false);
                if (d) setForm({ ...form, date: d.toISOString().slice(0, 10) });
              }}
            />
          )}
          <Pressable onPress={save} style={s.button}>
            <Text style={s.buttonText}>Save transaction</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
const s = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(20,30,50,.35)",
  },
  sheet: {
    backgroundColor: "#fff",
    padding: 22,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: "90%",
  },
  top: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },
  title: { fontSize: 20, fontWeight: "800", color: colors.ink },
  cancel: { color: colors.primary, fontWeight: "700" },
  label: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.muted,
    marginTop: 13,
    marginBottom: 6,
    textTransform: "uppercase",
  },
  input: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 12,
    padding: 13,
    fontSize: 15,
    color: colors.ink,
    minHeight: 48,
    justifyContent: "center",
  },
  types: { flexDirection: "row", gap: 10, marginTop: 10 },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
    backgroundColor: "#F1F3F8",
  },
  chipActive: { backgroundColor: colors.primary },
  chipText: { color: colors.muted, fontWeight: "700" },
  activeText: { color: "#fff" },
  categories: { flexDirection: "row", flexWrap: "wrap", gap: 7 },
  category: {
    backgroundColor: "#F1F3F8",
    paddingVertical: 8,
    paddingHorizontal: 11,
    borderRadius: 14,
  },
  categoryActive: { backgroundColor: colors.primary },
  categoryText: { fontSize: 12, color: colors.ink },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 13,
    alignItems: "center",
    padding: 15,
    marginTop: 22,
  },
  buttonText: { color: "#fff", fontWeight: "800", fontSize: 15 },
});
