import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Platform,
  StatusBar,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useOffers } from "../context/offersContext";

/* 🌿 GREEN THEME */
const COLORS = {
  primary: "#2E7D32",
  accent: "#43A047",
  bg: "#E8F5E9",
  card: "#FFFFFF",
  border: "#C8E6C9",
  textDark: "#1B5E20",
  textMuted: "#558B2F",
};

const OFFER_TYPES = ["WEEKEND", "FESTIVAL", "MEGA", "BOGO"] as const;

export default function CreateOffer() {
  const { addOffer } = useOffers();

  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [offerType, setOfferType] =
    useState<(typeof OFFER_TYPES)[number]>("WEEKEND");

  const [price, setPrice] = useState("");
  const [discountPercent, setDiscountPercent] = useState("");

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [pickerType, setPickerType] = useState<"START" | "END" | null>(null);

  const calculatedFinalPrice = useMemo(() => {
    const p = Number(price);
    const d = Number(discountPercent);
    if (!p || !d || d <= 0 || d > 100) return null;
    return Number((p - (p * d) / 100).toFixed(2));
  }, [price, discountPercent]);

  const saveOffer = () => {
    if (!title.trim() || !code.trim()) {
      Alert.alert("Validation", "Please enter title and coupon code");
      return;
    }
    if (!price || !discountPercent) {
      Alert.alert("Validation", "Enter price and discount percentage");
      return;
    }
    if (!startDate || !endDate) {
      Alert.alert("Validation", "Please select start and end dates");
      return;
    }
    if (startDate > endDate) {
      Alert.alert("Validation", "Start date cannot be after end date");
      return;
    }
    if (!calculatedFinalPrice) {
      Alert.alert("Validation", "Invalid price or discount percentage");
      return;
    }

    addOffer({
      id: Date.now().toString(),
      title: title.trim(),
      code: code.trim().toUpperCase(),
      offerType,
      price: Number(price),
      discountPercent: Number(discountPercent),
      finalPrice: calculatedFinalPrice,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      isActive: true,
      createdAt: new Date().toISOString(),
    });

    router.replace("/vendor/viewoffer");
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      {/* STATUS BAR (ABOVE TOOLBAR) */}
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.primary}
      />

      {/* TOOLBAR */}
      <View style={styles.toolbar}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons
            name="arrow-left"
            size={26}
            color="#fff"
          />
        </TouchableOpacity>

        <Text style={styles.toolbarTitle}>Create Offer</Text>
        <View style={{ width: 26 }} />
      </View>

      {/* CONTENT */}
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.label}>Offer Title</Text>
        <TextInput
          placeholder="Eg: Weekend Special Discount"
          value={title}
          onChangeText={setTitle}
          style={styles.input}
        />

        <Text style={styles.label}>Coupon Code</Text>
        <TextInput
          placeholder="Eg: WEEKEND50"
          value={code}
          onChangeText={setCode}
          autoCapitalize="characters"
          style={styles.input}
        />

        <Text style={styles.label}>Original Price (₹)</Text>
        <TextInput
          placeholder="Eg: 500"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
          style={styles.input}
        />

        <Text style={styles.label}>Discount Percentage (%)</Text>
        <TextInput
          placeholder="Eg: 20"
          value={discountPercent}
          onChangeText={setDiscountPercent}
          keyboardType="numeric"
          style={styles.input}
        />

        {calculatedFinalPrice !== null && (
          <View style={styles.previewBox}>
            <Text style={styles.previewText}>
              Final Price: ₹{calculatedFinalPrice}
            </Text>
          </View>
        )}

        <Text style={styles.label}>Offer Type</Text>
        <View style={styles.row}>
          {OFFER_TYPES.map((t) => (
            <TouchableOpacity
              key={t}
              style={[
                styles.chip,
                offerType === t && styles.activeChip,
              ]}
              onPress={() => setOfferType(t)}
            >
              <Text
                style={[
                  styles.chipText,
                  offerType === t && styles.activeChipText,
                ]}
              >
                {t}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Offer Validity</Text>

        <TouchableOpacity
          style={styles.dateBtn}
          onPress={() => setPickerType("START")}
        >
          <MaterialCommunityIcons
            name="calendar"
            size={20}
            color={COLORS.primary}
          />
          <Text style={styles.dateText}>
            {startDate ? startDate.toDateString() : "Select Start Date"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.dateBtn}
          onPress={() => setPickerType("END")}
        >
          <MaterialCommunityIcons
            name="calendar"
            size={20}
            color={COLORS.primary}
          />
          <Text style={styles.dateText}>
            {endDate ? endDate.toDateString() : "Select End Date"}
          </Text>
        </TouchableOpacity>

        {pickerType && (
          <DateTimePicker
            value={new Date()}
            mode="date"
            display={Platform.OS === "android" ? "default" : "inline"}
            onChange={(e, date) => {
              setPickerType(null);
              if (!date) return;
              pickerType === "START"
                ? setStartDate(date)
                : setEndDate(date);
            }}
          />
        )}

        <TouchableOpacity style={styles.saveBtn} onPress={saveOffer}>
          <Text style={styles.saveText}>SAVE OFFER</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.primary, // ✅ ABOVE TOOLBAR
  },

  toolbar: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    backgroundColor: COLORS.primary, // ✅ GREEN TOOLBAR
  },

  toolbarTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#fff",
  },

  container: {
    padding: 16,
    paddingBottom: 40,
    backgroundColor: COLORS.bg, // CONTENT BG
  },

  label: {
    fontWeight: "700",
    marginBottom: 6,
    color: COLORS.textDark,
  },

  input: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
  },

  previewBox: {
    backgroundColor: COLORS.bg,
    padding: 12,
    borderRadius: 10,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  previewText: {
    fontWeight: "800",
    color: COLORS.primary,
  },

  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
  },

  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 8,
    marginBottom: 8,
  },

  activeChip: { backgroundColor: COLORS.primary },

  chipText: { fontWeight: "600", color: COLORS.textMuted },

  activeChipText: { color: "#fff" },

  dateBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  dateText: {
    marginLeft: 8,
    fontWeight: "600",
    color: COLORS.textDark,
  },

  saveBtn: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 30,
  },

  saveText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 16,
  },
});
