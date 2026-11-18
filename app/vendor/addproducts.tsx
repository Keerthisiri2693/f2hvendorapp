import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Switch,
  Platform,
  StatusBar as RNStatusBar,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";

/* ---------------- DATA ---------------- */

const BUSINESS_TYPES = ["Fresh Meat", "Restaurant"];
const RESTAURANT_TYPES = ["Pure Veg", "Veg & Non-Veg"];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const VEG_CATEGORIES = [
  "Paneer",
  "Vegetable Curry",
  "Rice / Biryani",
  "Dal",
  "Roti / Bread",
  "Snacks",
  "Dessert",
];

const MEAT_CATEGORIES: Record<string, string[]> = {
  Chicken: ["Curry Cut", "Boneless", "Breast", "Wings", "Minced"],
  Mutton: ["Curry Cut", "Boneless", "Minced"],
  Beef: ["Curry Cut", "Boneless", "Minced"],
  Pork: ["Curry Cut", "Boneless", "Belly", "Ribs", "Minced"],
  Fish: ["Whole", "Curry Cut", "Fillet"],
};

const SPICE_LEVELS = ["Mild", "Medium", "Spicy"];
const AVAILABILITY = ["All Day", "Breakfast", "Lunch", "Dinner"];

/* ---------------- SCREEN ---------------- */

export default function AddProduct() {
  const [businessType, setBusinessType] = useState("Fresh Meat");
  const [restaurantType, setRestaurantType] = useState("Pure Veg");
  const [isVeg, setIsVeg] = useState(false);

  const [vegCategory, setVegCategory] = useState("Paneer");
  const [meatCategory, setMeatCategory] = useState("Chicken");
  const [cutType, setCutType] = useState("Curry Cut");

  const [spiceLevel, setSpiceLevel] = useState("Medium");
  const [availability, setAvailability] = useState("All Day");
  const [activeDays, setActiveDays] = useState<string[]>(DAYS);

  const [freshToday, setFreshToday] = useState(true);
  const [bestSeller, setBestSeller] = useState(false);
  const [enabled, setEnabled] = useState(true);
  const [allowNotes, setAllowNotes] = useState(true);
  const [autoHide, setAutoHide] = useState(true);
  const [lowStockAlert, setLowStockAlert] = useState(true);

  /* 🔥 COLOR LOGIC */
  const ACTIVE_COLOR =
    businessType === "Restaurant" && restaurantType === "Pure Veg"
      ? "#2E7D32"
      : "#C62828";

  useEffect(() => {
    if (businessType === "Fresh Meat") {
      setRestaurantType("Pure Veg");
      setIsVeg(false);
    }
  }, [businessType]);

  const toggleDay = (day: string) => {
    setActiveDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  return (
    <View style={styles.safe}>
      {/* STATUS BAR */}
      <StatusBar style="dark" backgroundColor="#2E7D32" />

      {/* TOOLBAR (MERGED WITH STATUS BAR) */}
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons
            name="arrow-left"
            size={24}
            color="#2E7D32"
          />
        </TouchableOpacity>

        <Text style={styles.title}>Add Product</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* CONTENT */}
      <ScrollView contentContainerStyle={styles.container}>
        {/* IMAGE */}
        <TouchableOpacity style={styles.imageBox}>
          <MaterialCommunityIcons
            name="camera-plus-outline"
            size={36}
            color={ACTIVE_COLOR}
          />
          <Text style={[styles.imageText, { color: ACTIVE_COLOR }]}>
            Add Product Image
          </Text>
        </TouchableOpacity>

        {/* BUSINESS TYPE */}
        <Section title="Business Type">
          {BUSINESS_TYPES.map((i) => (
            <Chip
              key={i}
              label={i}
              icon="store"
              active={businessType === i}
              activeColor={ACTIVE_COLOR}
              onPress={() => setBusinessType(i)}
            />
          ))}
        </Section>

        {/* RESTAURANT TYPE */}
        {businessType === "Restaurant" && (
          <Section title="Restaurant Type">
            {RESTAURANT_TYPES.map((i) => (
              <Chip
                key={i}
                label={i}
                icon={i === "Pure Veg" ? "leaf" : "food-drumstick"}
                active={restaurantType === i}
                activeColor={ACTIVE_COLOR}
                onPress={() => {
                  setRestaurantType(i);
                  setIsVeg(i === "Pure Veg");
                }}
              />
            ))}
          </Section>
        )}

        {/* VEG CATEGORY */}
        {businessType === "Restaurant" && isVeg && (
          <Section title="Veg Category">
            {VEG_CATEGORIES.map((i) => (
              <Chip
                key={i}
                label={i}
                icon="leaf"
                active={vegCategory === i}
                activeColor={ACTIVE_COLOR}
                onPress={() => setVegCategory(i)}
              />
            ))}
          </Section>
        )}

        {/* MEAT CATEGORY */}
        {(businessType === "Fresh Meat" ||
          (businessType === "Restaurant" && !isVeg)) && (
          <Section title="Meat Category">
            {Object.keys(MEAT_CATEGORIES).map((i) => (
              <Chip
                key={i}
                label={i}
                icon="food-drumstick"
                active={meatCategory === i}
                activeColor={ACTIVE_COLOR}
                onPress={() => {
                  setMeatCategory(i);
                  setCutType(MEAT_CATEGORIES[i][0]);
                }}
              />
            ))}
          </Section>
        )}

        {/* CUT TYPE */}
        {businessType === "Fresh Meat" && (
          <Section title="Cut Type">
            {MEAT_CATEGORIES[meatCategory].map((c) => (
              <Chip
                key={c}
                label={c}
                icon="knife"
                active={cutType === c}
                activeColor={ACTIVE_COLOR}
                onPress={() => setCutType(c)}
              />
            ))}
          </Section>
        )}

        {/* BASIC INFO */}
        <Input label="Product Name" />
        <Text style={styles.label}>Product Description</Text>
        <TextInput style={styles.textArea} multiline />
        <Input label="Price (₹)" keyboardType="numeric" />
        <Input label="Stock / Quantity" keyboardType="numeric" />

        {/* SPICE */}
        {businessType === "Restaurant" && (
          <Section title="Spice Level">
            {SPICE_LEVELS.map((i) => (
              <Chip
                key={i}
                label={i}
                icon="chili-hot"
                active={spiceLevel === i}
                activeColor={ACTIVE_COLOR}
                onPress={() => setSpiceLevel(i)}
              />
            ))}
          </Section>
        )}

        {/* AVAILABILITY */}
        <Section title="Availability">
          {AVAILABILITY.map((i) => (
            <Chip
              key={i}
              label={i}
              icon="clock-outline"
              active={availability === i}
              activeColor={ACTIVE_COLOR}
              onPress={() => setAvailability(i)}
            />
          ))}
        </Section>

        {/* DAYS */}
        <Section title="Available Days">
          {DAYS.map((d) => (
            <Chip
              key={d}
              label={d}
              icon="calendar-week"
              active={activeDays.includes(d)}
              activeColor={ACTIVE_COLOR}
              onPress={() => toggleDay(d)}
            />
          ))}
        </Section>

        <Input label="Minimum Order Quantity" />
        <Input label="GST / Tax %" />
        {businessType === "Fresh Meat" && <Input label="Shelf Life" />}

        {/* TOGGLES */}
        <ToggleRow label="Fresh Today" value={freshToday} onChange={setFreshToday} />
        <ToggleRow label="Best Seller" value={bestSeller} onChange={setBestSeller} />
        <ToggleRow label="Allow Customer Instructions" value={allowNotes} onChange={setAllowNotes} />
        <ToggleRow label="Auto Hide When Out of Stock" value={autoHide} onChange={setAutoHide} />
        <ToggleRow label="Low Stock Alert" value={lowStockAlert} onChange={setLowStockAlert} />
        <ToggleRow label="Enable Product" value={enabled} onChange={setEnabled} />

        {/* SAVE */}
        <TouchableOpacity style={[styles.saveBtn, { backgroundColor: "#2E7D32" }]}>
          <Text style={styles.saveText}>Save Product</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

/* ---------------- COMPONENTS ---------------- */

const Section = ({ title, children }: any) => (
  <>
    <Text style={styles.label}>{title}</Text>
    <View style={styles.rowWrap}>{children}</View>
  </>
);

const Input = ({ label, ...props }: any) => (
  <>
    <Text style={styles.label}>{label}</Text>
    <TextInput style={styles.input} {...props} />
  </>
);

const Chip = ({ label, active, onPress, icon, activeColor }: any) => (
  <TouchableOpacity
    onPress={onPress}
    style={[
      styles.chip,
      active && {
        backgroundColor: activeColor + "22",
        borderColor: activeColor,
      },
    ]}
  >
    <MaterialCommunityIcons
      name={icon}
      size={16}
      color={active ? activeColor : "#777"}
    />
    <Text
      style={[
        styles.chipText,
        active && { color: activeColor, fontWeight: "700" },
      ]}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

const ToggleRow = ({ label, value, onChange }: any) => (
  <View style={styles.switchRow}>
    <Text style={styles.switchText}>{label}</Text>
    <Switch value={value} onValueChange={onChange} />
  </View>
);

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#ffffff" },

  appBar: {
    backgroundColor: "#ffffff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,

    /* 🔑 STATUS BAR + TOOLBAR MERGED */
    paddingTop:
      Platform.OS === "android"
        ? RNStatusBar.currentHeight
        : 44,

    height:
      Platform.OS === "android"
        ? 56 + (RNStatusBar.currentHeight || 0)
        : 100,

    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },

  title: { fontSize: 18, fontWeight: "800", color: "#2E7D32" },

  container: { padding: 16, paddingBottom: 120 },

  imageBox: {
    height: 160,
    backgroundColor: "#FAFAFA",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },

  imageText: { marginTop: 8, fontWeight: "600" },

  label: { fontSize: 13, fontWeight: "700", marginTop: 16, marginBottom: 6 },

  input: { backgroundColor: "#FAFAFA", borderRadius: 14, padding: 14 },

  rowWrap: { flexDirection: "row", flexWrap: "wrap", gap: 10 },

  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
  },

  chipText: { fontSize: 13, color: "#777" },

  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },

  switchText: { fontWeight: "700" },

  textArea: {
    backgroundColor: "#FAFAFA",
    borderRadius: 14,
    padding: 14,
    height: 100,
  },

  saveBtn: {
    paddingVertical: 16,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 30,
  },

  saveText: { color: "#fff", fontSize: 16, fontWeight: "800" },
});
