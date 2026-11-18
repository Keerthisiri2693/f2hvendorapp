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

/* ---------------- THEME ---------------- */

const PRIMARY = "#2E7D32";
const BG = "#F6F7FB";

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
  const [filter, setFilter] =
    useState<"MEAT_SHOP" | "PURE_VEG" | "VEG_NON_VEG">("MEAT_SHOP");
  const [items, setItems] = useState(PRODUCTS);

  const toggleEnable = (id: string) => {
    setItems(prev =>
      prev.map(p => (p.id === id ? { ...p, enabled: !p.enabled } : p))
    );
  };

  const filtered = items.filter(
    p =>
      p.businessType === filter &&
      p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={PRIMARY} />

      {/* TOOLBAR */}
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.title}>Manage Products</Text>

        <TouchableOpacity onPress={() => router.push("/vendor/addproducts")}>
          <MaterialCommunityIcons name="plus-circle" size={26} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* SEARCH */}
      <View style={styles.searchBox}>
        <MaterialCommunityIcons name="magnify" size={20} color="#777" />
        <TextInput
          placeholder="Search product..."
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
          color="#C62828"
          active={filter === "MEAT_SHOP"}
          onPress={() => setFilter("MEAT_SHOP")}
        />
        <FilterChip
          label="Pure Veg"
          icon="leaf"
          color={PRIMARY}
          active={filter === "PURE_VEG"}
          onPress={() => setFilter("PURE_VEG")}
        />
        <FilterChip
          label="Veg & Non-Veg"
          icon="silverware-fork-knife"
          color="#6A1B9A"
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
          <ProductCard item={item} onToggle={() => toggleEnable(item.id)} />
        )}
        ListEmptyComponent={<Text style={styles.empty}>No products found</Text>}
      />
    </SafeAreaView>
  );
}

/* ---------------- PRODUCT CARD ---------------- */

function ProductCard({ item, onToggle }: any) {
  const vegColor = PRIMARY;
  const meatColor = "#C62828";

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
              color={item.isVeg ? vegColor : meatColor}
            />
            <Text
              style={[
                styles.category,
                { color: item.isVeg ? vegColor : meatColor },
              ]}
            >
              {item.category}
            </Text>
          </View>

          <Text style={[styles.stock, item.stock === 0 && styles.outStock]}>
            {item.stock > 0 ? `${item.stock} ${item.unit}` : "Out of stock"}
          </Text>
        </View>

        {/* ACTIONS */}
        <View style={styles.actions}>
          <Switch
            value={item.enabled}
            onValueChange={onToggle}
            trackColor={{ true: PRIMARY }}
          />

          <TouchableOpacity>
            <MaterialCommunityIcons name="pencil-outline" size={20} />
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
      <Text style={[styles.filterText, active && { color, fontWeight: "700" }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },

  appBar: {
    height: 56,
    backgroundColor: PRIMARY,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  title: { fontSize: 18, fontWeight: "800", color: "#fff" },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F4F4F4",
    marginHorizontal: 16,
    borderRadius: 14,
    paddingHorizontal: 12,
    marginVertical: 12,
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
    borderColor: "#E0E0E0",
  },

  filterText: { fontSize: 13, color: "#777" },

  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 16,
    padding: 12,
    elevation: 3,
  },

  disabled: { opacity: 0.5 },

  image: { width: 72, height: 72, borderRadius: 12, marginRight: 12 },

  content: { flex: 1 },

  nameRow: { flexDirection: "row", alignItems: "center", gap: 6 },

  name: { fontSize: 15, fontWeight: "700", flex: 1 },

  price: { fontSize: 14, fontWeight: "800", marginTop: 2 },

  unit: { fontSize: 12, color: "#777" },

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
    marginTop: 6,
  },

  empty: {
    textAlign: "center",
    marginTop: 40,
    color: "#777",
    fontWeight: "600",
  },
});
