import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Switch,
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
};

/* ---------------- INVENTORY DATA ---------------- */

const INVENTORY = [
  {
    id: "1",
    name: "Chicken Curry Cut",
    category: "Chicken",
    businessType: "MEAT_SHOP",
    stock: 2,
    unit: "kg",
    isVeg: false,
    enabled: true,
    lowStockLimit: 3,
    updatedAt: "10 mins ago",
  },
  {
    id: "2",
    name: "Paneer Butter Masala",
    category: "Paneer",
    businessType: "PURE_VEG",
    stock: 10,
    unit: "plate",
    isVeg: true,
    enabled: true,
    lowStockLimit: 5,
    updatedAt: "1 hr ago",
  },
  {
    id: "3",
    name: "Fish Fry",
    category: "Fish",
    businessType: "VEG_NON_VEG",
    stock: 0,
    unit: "plate",
    isVeg: false,
    enabled: false,
    lowStockLimit: 2,
    updatedAt: "Yesterday",
  },
];

/* ---------------- SCREEN ---------------- */

export default function Inventory() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] =
    useState<"MEAT_SHOP" | "PURE_VEG" | "VEG_NON_VEG">("MEAT_SHOP");
  const [items, setItems] = useState(INVENTORY);

  const updateStock = (id: string, value: number) => {
    setItems(prev =>
      prev.map(p =>
        p.id === id
          ? {
              ...p,
              stock: Math.max(0, p.stock + value),
              updatedAt: "Just now",
            }
          : p
      )
    );
  };

  const toggleEnable = (id: string) => {
    setItems(prev =>
      prev.map(p =>
        p.id === id ? { ...p, enabled: !p.enabled } : p
      )
    );
  };

  const filtered = items.filter(
    i =>
      i.businessType === filter &&
      i.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      {/* STATUS BAR (ABOVE TOOLBAR) */}
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.primary}
      />

      {/* TOOLBAR */}
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
          <MaterialCommunityIcons
            name="arrow-left"
            size={24}
            color="#fff"
          />
        </TouchableOpacity>

        <Text style={styles.title}>Inventory</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* CONTENT AREA */}
      <View style={styles.content}>
        {/* SEARCH */}
        <View style={styles.searchBox}>
          <MaterialCommunityIcons name="magnify" size={20} color="#999" />
          <TextInput
            placeholder="Search inventory"
            placeholderTextColor="#999"
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />
        </View>

        {/* FILTER */}
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
          contentContainerStyle={{ paddingBottom: 32 }}
          renderItem={({ item }) => (
            <InventoryCard
              item={item}
              onAdd={() => updateStock(item.id, 1)}
              onRemove={() => updateStock(item.id, -1)}
              onToggle={() => toggleEnable(item.id)}
            />
          )}
          ListEmptyComponent={
            <Text style={styles.empty}>No inventory items</Text>
          }
        />
      </View>
    </SafeAreaView>
  );
}

/* ---------------- INVENTORY CARD ---------------- */

function InventoryCard({ item, onAdd, onRemove, onToggle }: any) {
  const isLow = item.stock > 0 && item.stock <= item.lowStockLimit;

  return (
    <View style={[styles.card, !item.enabled && styles.disabled]}>
      <View style={styles.headerRow}>
        <View style={styles.nameRow}>
          <Text style={styles.name}>{item.name}</Text>
          {isLow && (
            <View style={styles.lowBadge}>
              <Text style={styles.lowText}>LOW</Text>
            </View>
          )}
        </View>

        <Switch
          value={item.enabled}
          onValueChange={onToggle}
          thumbColor={item.enabled ? COLORS.primary : "#ccc"}
          trackColor={{ false: "#ddd", true: COLORS.primary + "66" }}
        />
      </View>

      <View style={styles.metaRow}>
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
          ? `${item.stock} ${item.unit} available`
          : "Out of stock"}
      </Text>

      <View style={styles.actionRow}>
        <View style={styles.counterRow}>
          <TouchableOpacity
            onPress={onRemove}
            style={styles.counterBtn}
            disabled={!item.enabled}
          >
            <MaterialCommunityIcons name="minus" size={18} />
          </TouchableOpacity>

          <Text style={styles.count}>{item.stock}</Text>

          <TouchableOpacity
            onPress={onAdd}
            style={styles.counterBtn}
            disabled={!item.enabled}
          >
            <MaterialCommunityIcons name="plus" size={18} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          disabled={!item.enabled}
          style={[styles.editBtn, !item.enabled && { opacity: 0.4 }]}
        >
          <MaterialCommunityIcons name="pencil-outline" size={20} />
        </TouchableOpacity>
      </View>

      <Text style={styles.updated}>Updated • {item.updatedAt}</Text>
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
        active && { backgroundColor: color + "22" },
      ]}
    >
      <MaterialCommunityIcons
        name={icon}
        size={14}
        color={active ? color : "#666"}
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
    backgroundColor: COLORS.primary, // ✅ ABOVE TOOLBAR
  },

  content: {
    flex: 1,
    backgroundColor: COLORS.bg, // body
  },

  appBar: {
    height: 56,
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },

  iconBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
    color: "#111",
  },

  filterRow: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 16,
    marginVertical: 14,
  },

  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
  },

  filterText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#555",
  },

  card: {
    backgroundColor: COLORS.card,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  disabled: { opacity: 0.5 },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },

  name: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111",
  },

  lowBadge: {
    backgroundColor: "#FFF3E0",
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },

  lowText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#E65100",
  },

  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },

  category: {
    fontSize: 12,
    fontWeight: "600",
  },

  stock: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: "500",
    color: "#333",
  },

  outStock: {
    color: "#D32F2F",
    fontWeight: "700",
  },

  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
  },

  counterRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  counterBtn: {
    backgroundColor: "#F2F2F2",
    padding: 8,
    borderRadius: 10,
  },

  count: {
    fontSize: 14,
    fontWeight: "700",
    minWidth: 18,
    textAlign: "center",
    color: "#111",
  },

  editBtn: { padding: 6 },

  updated: {
    fontSize: 11,
    color: "#777",
    marginTop: 10,
  },

  empty: {
    textAlign: "center",
    marginTop: 40,
    color: "#777",
    fontWeight: "600",
  },
});
