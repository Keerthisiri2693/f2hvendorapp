import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  Switch,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";

/* 🌿 GREEN THEME */
const COLORS = {
  primary: "#2E7D32",
  accent: "#43A047",
  bg: "#E8F5E9",
  card: "#FFFFFF",
  border: "#C8E6C9",
  textDark: "#1B5E20",
  textMuted: "#558B2F",
  meat: "#C62828",
  white: "#FFFFFF",
};

/* ---------------- MOCK DATA ---------------- */

const PRODUCTS = [
  {
    id: "1",
    name: "Chicken Curry Cut",
    price: 280,
    unit: "kg",
    category: "Chicken",
    isVeg: false,
    businessType: "MEAT_SHOP",
    stock: 2,
    enabled: true,
    bestSeller: true,
    image: "https://images.unsplash.com/photo-1617196034183-421b4917c92d",
  },
  {
    id: "2",
    name: "Paneer Butter Masala",
    price: 220,
    unit: "plate",
    category: "Paneer",
    isVeg: true,
    businessType: "PURE_VEG",
    stock: 5,
    enabled: true,
    bestSeller: false,
    image: "https://images.unsplash.com/photo-1628294896516-344152572ee8",
  },
  {
    id: "3",
    name: "Fish Fry",
    price: 320,
    unit: "plate",
    category: "Fish",
    isVeg: false,
    businessType: "VEG_NON_VEG",
    stock: 0,
    enabled: false,
    bestSeller: false,
    image: "https://images.unsplash.com/photo-1617196034183-421b4917c92d",
  },
];

/* ---------------- SCREEN ---------------- */

export default function ManageProducts() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<
    "MEAT_SHOP" | "PURE_VEG" | "VEG_NON_VEG"
  >("MEAT_SHOP");
  const [items, setItems] = useState(PRODUCTS);

  const toggleEnable = (id: string) => {
    setItems(prev =>
      prev.map(p =>
        p.id === id ? { ...p, enabled: !p.enabled } : p
      )
    );
  };

  const filtered = items.filter(
    p =>
      p.businessType === filter &&
      p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      {/* ✅ NOTCH COLOR */}
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.primary}
      />

      {/* ✅ TOOLBAR */}
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons
            name="arrow-left"
            size={24}
            color={COLORS.white}
          />
        </TouchableOpacity>

        <Text style={styles.title}>Manage Products</Text>

        <TouchableOpacity onPress={() => router.push("/vendor/addproducts")}>
          <MaterialCommunityIcons
            name="plus-circle"
            size={26}
            color={COLORS.white}
          />
        </TouchableOpacity>
      </View>

      {/* ✅ CONTENT AREA */}
      <View style={styles.contentBg}>
        {/* SEARCH */}
        <View style={styles.searchBox}>
          <MaterialCommunityIcons name="magnify" size={20} color="#777" />
          <TextInput
            placeholder="Search product..."
            placeholderTextColor="#999"
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />
        </View>

        {/* FILTERS */}
        <View style={styles.filterRow}>
          <FilterChip
            label="Meat Shop"
            icon="food-drumstick"
            color={COLORS.meat}
            active={filter === "MEAT_SHOP"}
            onPress={() => setFilter("MEAT_SHOP")}
          />
          <FilterChip
            label="Pure Veg"
            icon="leaf"
            color={COLORS.primary}
            active={filter === "PURE_VEG"}
            onPress={() => setFilter("PURE_VEG")}
          />
          <FilterChip
            label="Veg & Non-Veg"
            icon="silverware-fork-knife"
            color={COLORS.accent}
            active={filter === "VEG_NON_VEG"}
            onPress={() => setFilter("VEG_NON_VEG")}
          />
        </View>

        {/* LIST */}
        <FlatList
          data={filtered}
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingBottom: 120 }}
          renderItem={({ item }) => (
            <ProductCard
              item={item}
              onToggle={() => toggleEnable(item.id)}
            />
          )}
          ListEmptyComponent={
            <Text style={styles.empty}>No products found</Text>
          }
        />
      </View>
    </SafeAreaView>
  );
}

/* ---------------- PRODUCT CARD ---------------- */

function ProductCard({ item, onToggle }: any) {
  return (
    <View style={[styles.card, !item.enabled && styles.disabled]}>
      <Image source={{ uri: item.image }} style={styles.image} />

      <View style={styles.content}>
        <View style={styles.nameRow}>
          <Text style={styles.name} numberOfLines={1}>
            {item.name}
          </Text>

          {item.bestSeller && (
            <View style={styles.bestBadge}>
              <Text style={styles.bestText}>BEST</Text>
            </View>
          )}
        </View>

        <Text style={styles.price}>
          ₹{item.price}
          <Text style={styles.unit}> / {item.unit}</Text>
        </Text>

        <View style={styles.metaRow}>
          <View style={styles.iconRow}>
            <MaterialCommunityIcons
              name={item.isVeg ? "leaf" : "food-drumstick"}
              size={14}
              color={item.isVeg ? COLORS.primary : COLORS.meat}
            />
            <Text
              style={[
                styles.category,
                { color: item.isVeg ? COLORS.primary : COLORS.meat },
              ]}
            >
              {item.category}
            </Text>
          </View>

          <Text
            style={[
              styles.stock,
              item.stock === 0 && styles.outStock,
            ]}
          >
            {item.stock > 0
              ? `${item.stock} ${item.unit}`
              : "Out of stock"}
          </Text>
        </View>

        <View style={styles.actions}>
          <Switch
            value={item.enabled}
            onValueChange={onToggle}
            thumbColor={item.enabled ? COLORS.primary : "#ccc"}
            trackColor={{ false: "#ddd", true: COLORS.primary + "66" }}
          />
          <TouchableOpacity>
            <MaterialCommunityIcons
              name="pencil-outline"
              size={20}
              color={COLORS.textDark}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <MaterialCommunityIcons
              name="delete-outline"
              size={20}
              color="#D32F2F"
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

/* ---------------- FILTER CHIP ---------------- */

function FilterChip({ label, icon, color, active, onPress }: any) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.filterChip,
        active && { backgroundColor: color + "22", borderColor: color },
      ]}
    >
      <MaterialCommunityIcons
        name={icon}
        size={14}
        color={active ? color : "#777"}
      />
      <Text
        style={[
          styles.filterText,
          active && { color, fontWeight: "700" },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.primary, // ✅ notch color
  },

  appBar: {
    height: 56,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.primary,
  },

  title: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.white,
  },

  contentBg: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    margin: 16,
    borderRadius: 14,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  searchInput: { flex: 1, paddingVertical: 10 },

  filterRow: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 16,
    marginBottom: 12,
  },

  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.card,
  },

  filterText: { fontSize: 13, color: COLORS.textMuted },

  card: {
    flexDirection: "row",
    backgroundColor: COLORS.card,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  disabled: { opacity: 0.5 },

  image: {
    width: 72,
    height: 72,
    borderRadius: 12,
    marginRight: 12,
  },

  content: { flex: 1 },

  nameRow: { flexDirection: "row", alignItems: "center", gap: 6 },

  name: { fontSize: 15, fontWeight: "700", flex: 1 },

  price: { fontSize: 14, fontWeight: "800", marginTop: 2 },

  unit: { fontSize: 12, color: COLORS.textMuted },

  bestBadge: {
    backgroundColor: "#FFD600",
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },

  bestText: { fontSize: 10, fontWeight: "800" },

  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },

  iconRow: { flexDirection: "row", alignItems: "center", gap: 4 },

  category: { fontSize: 12, fontWeight: "700" },

  stock: { fontSize: 12, color: "#555" },

  outStock: { color: "#D32F2F", fontWeight: "700" },

  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    justifyContent: "flex-end",
    marginTop: 8,
  },

  empty: {
    textAlign: "center",
    marginTop: 40,
    color: "#777",
    fontWeight: "600",
  },
});
