import React, { useMemo, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  TextInput,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";

/* 🟢 SHOP CATEGORIES */
const SHOP_CATEGORIES = [
  { key: "FRESH_MEAT", label: "Fresh Meat" },
  { key: "PURE_VEG", label: "Pure Veg" },
  { key: "VEG_NON_VEG", label: "Veg & Non-Veg" },
];

/* 🔹 SUB CATEGORIES */
const FRESH_MEAT_TYPES = ["Chicken", "Mutton", "Fish", "Beef", "Pork"];
const RESTAURANT_TYPES = ["Veg", "Non-Veg"];

/* 🔹 PRODUCTS */
const INITIAL_PRODUCTS = [
  // 🥩 MEAT SHOP
  {
    id: "1",
    name: "Chicken Curry Cut",
    productType: "MEAT",
    meatType: "Chicken",
    price: 220,
    unit: "kg",
    isVeg: false,
    image:
      "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d",
  },
  {
    id: "2",
    name: "Mutton Boneless",
    productType: "MEAT",
    meatType: "Mutton",
    price: 680,
    unit: "kg",
    isVeg: false,
    image:
      "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d",
  },

  // 🍽️ RESTAURANT
  {
    id: "3",
    name: "Fish Fry",
    productType: "RESTAURANT",
    price: 360,
    unit: "plate",
    isVeg: false,
    image:
      "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d",
  },
  {
    id: "4",
    name: "Paneer Butter Masala",
    productType: "RESTAURANT",
    price: 180,
    unit: "plate",
    isVeg: true,
    image:
      "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d",
  },
];

export default function ProductListPage() {
  const [shopCategory, setShopCategory] = useState("FRESH_MEAT");
  const [subCategory, setSubCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [products] = useState(INITIAL_PRODUCTS);

  /* 🔥 IMPORTANT FIX: RESET SUB CATEGORY */
  useEffect(() => {
    setSubCategory("All");
  }, [shopCategory]);

  /* ✅ FINAL FILTER LOGIC (CORRECTED) */
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // 🔍 Search
      if (!p.name.toLowerCase().includes(search.toLowerCase())) return false;

      // 🥩 FRESH MEAT SHOP
      if (shopCategory === "FRESH_MEAT") {
        if (p.productType !== "MEAT") return false;
        if (subCategory === "All") return true;
        return p.meatType === subCategory;
      }

      // 🥬 PURE VEG RESTAURANT
      if (shopCategory === "PURE_VEG") {
        return p.productType === "RESTAURANT" && p.isVeg;
      }

      // 🍽️ VEG & NON-VEG RESTAURANT
      if (shopCategory === "VEG_NON_VEG") {
        if (p.productType !== "RESTAURANT") return false;
        if (subCategory === "All") return true;
        if (subCategory === "Veg") return p.isVeg;
        if (subCategory === "Non-Veg") return !p.isVeg;
      }

      return false;
    });
  }, [products, shopCategory, subCategory, search]);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
                 <MaterialCommunityIcons
                  name="arrow-left"
                   size={24}
                    color="#ff4d6d" />
               </TouchableOpacity>
        <Text style={styles.title}>Products</Text>
        <TouchableOpacity
          style={styles.addBtn}
           onPress={() => router.push("/vendor/addproducts")}
        >
          <MaterialCommunityIcons name="plus" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* SHOP CATEGORY */}
      <View style={styles.row}>
        {SHOP_CATEGORIES.map((c) => (
          <Chip
            key={c.key}
            label={c.label}
            active={shopCategory === c.key}
            onPress={() => setShopCategory(c.key)}
          />
        ))}
      </View>

      {/* SUB CATEGORY */}
      {shopCategory === "FRESH_MEAT" && (
        <View style={styles.row}>
          <Chip label="All" active={subCategory === "All"} onPress={() => setSubCategory("All")} />
          {FRESH_MEAT_TYPES.map((m) => (
            <Chip
              key={m}
              label={m}
              active={subCategory === m}
              onPress={() => setSubCategory(m)}
            />
          ))}
        </View>
      )}

      {shopCategory === "VEG_NON_VEG" && (
        <View style={styles.row}>
          <Chip label="All" active={subCategory === "All"} onPress={() => setSubCategory("All")} />
          {RESTAURANT_TYPES.map((t) => (
            <Chip
              key={t}
              label={t}
              active={subCategory === t}
              onPress={() => setSubCategory(t)}
            />
          ))}
        </View>
      )}

      {/* SEARCH */}
      <View style={styles.searchBox}>
        <MaterialCommunityIcons name="magnify" size={20} color="#999" />
        <TextInput
          placeholder="Search products"
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
      </View>

      {/* PRODUCT LIST */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 40 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} />

            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.price}>
                ₹{item.price} / {item.unit}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => router.push("/vendor/manageproducts")}
            >
              <MaterialCommunityIcons
                name="pencil-outline"
                size={20}
                color="#ff4d6d"
              />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No products found</Text>
        }
      />
    </SafeAreaView>
  );
}

/* 🔹 CHIP */
function Chip({ label, active, onPress }: any) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.chip, active && styles.chipActive]}
    >
      <Text style={[styles.chipText, active && styles.chipTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },

 header: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  paddingHorizontal: 16,
  paddingVertical: 14,
  backgroundColor: "#fff",
},

navBtn: {
  width: 40,
  height: 40,
  alignItems: "center",
  justifyContent: "center",
},

title: {
  fontSize: 20,
  fontWeight: "800",
  color: "#ff4d6d",
},

addBtn: {
  backgroundColor: "#ff4d6d",
  width: 40,
  height: 40,
  borderRadius: 20,
  alignItems: "center",
  justifyContent: "center",
},


  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    paddingHorizontal: 16,
    marginBottom: 8,
  },

  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: "#F3F3F3",
  },

  chipActive: { backgroundColor: "#ff4d6d22" },

  chipText: { fontSize: 13, fontWeight: "600", color: "#555" },

  chipTextActive: { color: "#ff4d6d" },

  searchBox: {
    flexDirection: "row",
    marginHorizontal: 16,
    backgroundColor: "#FAFAFA",
    borderRadius: 14,
    paddingHorizontal: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EEE",
    marginBottom: 10,
  },

  searchInput: { flex: 1, paddingVertical: 10 },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: "#EEE",
    gap: 12,
  },

  image: {
    width: 56,
    height: 56,
    borderRadius: 10,
    backgroundColor: "#EEE",
  },

  name: { fontSize: 15, fontWeight: "700" },

  price: {
    marginTop: 4,
    fontWeight: "800",
    color: "#ff4d6d",
  },

  empty: {
    textAlign: "center",
    marginTop: 40,
    color: "#777",
    fontWeight: "600",
  },
});
