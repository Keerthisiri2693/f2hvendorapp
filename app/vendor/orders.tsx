import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
  StatusBar,
  Switch,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";

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
  Chicken: ["Curry Cut", "Boneless", "Breast", "Wings"],
  Mutton: ["Curry Cut", "Boneless"],
  Fish: ["Whole", "Fillet"],
};

const SPICE_LEVELS = ["Mild", "Medium", "Spicy"];
const AVAILABILITY = ["All Day", "Breakfast", "Lunch", "Dinner"];

/* ---------------- SCREEN ---------------- */

export default function AddProduct() {
  const [businessType, setBusinessType] = useState("Fresh Meat");
  const [restaurantType, setRestaurantType] = useState("Pure Veg");
  const [isVeg, setIsVeg] = useState(true);

  const [vegCategory, setVegCategory] = useState("Paneer");
  const [meatCategory, setMeatCategory] = useState("Chicken");
  const [cutType, setCutType] = useState("Curry Cut");

  const [spiceLevel, setSpiceLevel] = useState("Medium");
  const [availability, setAvailability] = useState("All Day");

  const [freshToday, setFreshToday] = useState(true);
  const [bestSeller, setBestSeller] = useState(false);
  const [enabled, setEnabled] = useState(true);

  const [allowNotes, setAllowNotes] = useState(true);
  const [autoHide, setAutoHide] = useState(true);
  const [lowStockAlert, setLowStockAlert] = useState(true);

  const [activeDays, setActiveDays] = useState<string[]>(DAYS);

  const toggleDay = (day: string) => {
    setActiveDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#ff4d6d" />

      {/* HEADER */}
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Add Product</Text>
        <View style={{ width: 26 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>

        {/* IMAGE */}
        <TouchableOpacity style={styles.imageBox}>
          <MaterialCommunityIcons name="camera-plus-outline" size={36} color="#ff4d6d" />
          <Text style={styles.imageText}>Add Product Image</Text>
        </TouchableOpacity>

     

        {/* BUSINESS TYPE */}
        <Section title="Business Type">
          {BUSINESS_TYPES.map((i) => (
            <Chip key={i} label={i} active={businessType === i} onPress={() => setBusinessType(i)} />
          ))}
        </Section>

        {/* RESTAURANT TYPE */}
        {businessType === "Restaurant" && (
          <Section title="Restaurant Type">
            {RESTAURANT_TYPES.map((i) => (
              <Chip
                key={i}
                label={i}
                active={restaurantType === i}
                onPress={() => {
                  setRestaurantType(i);
                  setIsVeg(i === "Pure Veg");
                }}
              />
            ))}
          </Section>
        )}

        {/* FOOD TYPE */}
        {restaurantType === "Veg & Non-Veg" && (
          <Section title="Food Type">
            <Chip label="Veg" active={isVeg} onPress={() => setIsVeg(true)} />
            <Chip label="Non-Veg" active={!isVeg} onPress={() => setIsVeg(false)} />
          </Section>
        )}

        {/* VEG CATEGORY */}
        {businessType === "Restaurant" && isVeg && (
          <Section title="Veg Category">
            {VEG_CATEGORIES.map((i) => (
              <Chip key={i} label={i} active={vegCategory === i} onPress={() => setVegCategory(i)} />
            ))}
          </Section>
        )}

        {/* MEAT CATEGORY */}
        {(businessType === "Fresh Meat" || !isVeg) && (
          <>
            <Section title="Meat Category">
              {Object.keys(MEAT_CATEGORIES).map((i) => (
                <Chip key={i} label={i} active={meatCategory === i} onPress={() => {
                  setMeatCategory(i);
                  setCutType(MEAT_CATEGORIES[i][0]);
                }} />
              ))}
            </Section>

            <Section title="Cut Type">
              {MEAT_CATEGORIES[meatCategory].map((c) => (
                <Chip key={c} label={c} active={cutType === c} onPress={() => setCutType(c)} />
              ))}
            </Section>
          </>
        )}

        {/* SPICE */}
        {businessType === "Restaurant" && (
          <Section title="Spice Level">
            {SPICE_LEVELS.map((i) => (
              <Chip key={i} label={i} active={spiceLevel === i} onPress={() => setSpiceLevel(i)} />
            ))}
          </Section>
        )}

           {/* BASIC INFO */}
        <Input label="Product Name" />
        <Input label="Base Price (₹)" keyboardType="numeric" />
        <Input label="Stock / Quantity" keyboardType="numeric" />
        <Input label="Weight / Portion" placeholder="250g / Half Plate" />

        {/* AVAILABILITY */}
        <Section title="Availability">
          {AVAILABILITY.map((i) => (
            <Chip key={i} label={i} active={availability === i} onPress={() => setAvailability(i)} />
          ))}
        </Section>

        {/* AVAILABLE DAYS */}
        <Section title="Available Days">
          {DAYS.map((d) => (
            <Chip key={d} label={d} active={activeDays.includes(d)} onPress={() => toggleDay(d)} />
          ))}
        </Section>

        {/* CHARGES */}
        <Input label="GST / Tax %" placeholder="0 / 5 / 18" />
        <Input label="Packing Charge (₹)" keyboardType="numeric" />
        {businessType === "Fresh Meat" && (
          <Input label="Cutting Charge (₹)" keyboardType="numeric" />
        )}

        {/* DESCRIPTION */}
        <Text style={styles.label}>Product Description</Text>
        <TextInput style={styles.textArea} multiline />

        <Text style={styles.label}>Internal Notes (Vendor Only)</Text>
        <TextInput style={styles.textArea} multiline />

        {/* TOGGLES */}
        <ToggleRow label="Fresh Today" value={freshToday} onChange={setFreshToday} />
        <ToggleRow label="Best Seller" value={bestSeller} onChange={setBestSeller} />
        <ToggleRow label="Allow Customer Instructions" value={allowNotes} onChange={setAllowNotes} />
        <ToggleRow label="Auto Hide When Out of Stock" value={autoHide} onChange={setAutoHide} />
        <ToggleRow label="Low Stock Alert" value={lowStockAlert} onChange={setLowStockAlert} />
        <ToggleRow label="Enable Product" value={enabled} onChange={setEnabled} />

        {/* SAVE */}
        <TouchableOpacity style={styles.saveBtn}>
          <Text style={styles.saveText}>Save Product</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

/* ---------------- HELPERS ---------------- */

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

const Chip = ({ label, active, onPress }: any) => (
  <TouchableOpacity onPress={onPress} style={[styles.chip, active && styles.chipActive]}>
    <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
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
  root: { flex: 1, backgroundColor: "#fff" },
  appBar: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight ?? 24 : 44,
    padding: 16,
    backgroundColor: "#ff4d6d",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: { fontSize: 18, fontWeight: "800", color: "#fff" },
  container: { padding: 16, paddingBottom: 100 },
  imageBox: {
    height: 160,
    backgroundColor: "#FFF3F3",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  imageText: { marginTop: 8, fontWeight: "600", color: "#ff4d6d" },
  label: { fontSize: 13, fontWeight: "700", marginTop: 16, marginBottom: 6 },
  input: { backgroundColor: "#FAFAFA", borderRadius: 14, padding: 14 },
  textArea: { backgroundColor: "#FAFAFA", borderRadius: 14, padding: 14, height: 100 },
  rowWrap: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  chipActive: { backgroundColor: "#ff4d6d22", borderColor: "#ff4d6d" },
  chipText: { fontSize: 13, color: "#777" },
  chipTextActive: { color: "#ff4d6d", fontWeight: "700" },
  switchRow: { flexDirection: "row", justifyContent: "space-between", marginVertical: 10 },
  switchText: { fontWeight: "700" },
  saveBtn: {
    backgroundColor: "#ff4d6d",
    paddingVertical: 16,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 30,
  },
  saveText: { color: "#fff", fontSize: 16, fontWeight: "800" },
});
