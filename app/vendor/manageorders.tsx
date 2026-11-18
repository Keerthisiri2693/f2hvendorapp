import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  Pressable,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";

/* 🌿 GREEN THEME */
const COLORS = {
  primary: "#2E7D32",
  accent: "#43A047",
  bg: "#E8F5E9",
  card: "#FFFFFF",
  border: "#C8E6C9",
  textDark: "#1B5E20",
  textMuted: "#558B2F",
  white: "#FFFFFF",
};

/* ---------------- ORDER DATA ---------------- */

const INITIAL_ORDERS = [
  { id: "ORD001", shopType: "MEAT", status: "NEW", category: "Chicken", items: [{ name: "Chicken Curry Cut", qty: 2 }] },
  { id: "ORD002", shopType: "MEAT", status: "ACCEPTED", category: "Mutton", items: [{ name: "Mutton Boneless", qty: 1 }] },
  { id: "ORD003", shopType: "RESTAURANT", restaurantType: "PURE_VEG", status: "PREPARING", category: "Veg", items: [{ name: "Paneer Butter Masala", qty: 1 }] },
  { id: "ORD004", shopType: "RESTAURANT", restaurantType: "VEG_NON_VEG", status: "PICKUP", category: "Non-Veg", items: [{ name: "Fish Fry", qty: 2 }] },
  { id: "ORD005", shopType: "MEAT", status: "CANCELLED", category: "Chicken", items: [{ name: "Chicken Wings", qty: 1 }] },
];

/* ---------------- MAIN SCREEN ---------------- */

export default function ManageOrders() {
  const [orders] = useState(INITIAL_ORDERS);

  const [statusFilter, setStatusFilter] =
    useState<"ALL" | "NEW" | "ONGOING" | "DELIVERED" | "CANCELLED">("ALL");

  const [typeFilter, setTypeFilter] =
    useState<"ALL" | "MEAT" | "PURE_VEG" | "VEG_NON_VEG">("MEAT");

  const [filterVisible, setFilterVisible] = useState(false);

  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      if (statusFilter === "NEW" && o.status !== "NEW") return false;
      if (
        statusFilter === "ONGOING" &&
        !["ACCEPTED", "PREPARING", "READY"].includes(o.status)
      )
        return false;
      if (statusFilter === "DELIVERED" && o.status !== "PICKUP") return false;
      if (statusFilter === "CANCELLED" && o.status !== "CANCELLED") return false;

      if (typeFilter === "MEAT") return o.shopType === "MEAT";
      if (typeFilter === "PURE_VEG") return o.restaurantType === "PURE_VEG";
      if (typeFilter === "VEG_NON_VEG") return o.restaurantType === "VEG_NON_VEG";

      return true;
    });
  }, [orders, statusFilter, typeFilter]);

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      {/* STATUS BAR */}
      <StatusBar style="light" backgroundColor={COLORS.primary} />

      {/* TOOLBAR */}
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={26} color={COLORS.white} />
        </TouchableOpacity>

        <Text style={styles.appBarTitle}>Manage Orders</Text>

        <TouchableOpacity onPress={() => setFilterVisible(true)}>
          <MaterialCommunityIcons name="filter-variant" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      {/* CONTENT */}
      <View style={styles.content}>
        <FlatList
          data={filteredOrders}
          keyExtractor={i => i.id}
          contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
          ListEmptyComponent={<Text style={styles.empty}>No orders found</Text>}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.rowBetween}>
                <Text style={styles.orderId}>#{item.id}</Text>
                <StatusPill status={item.status} />
              </View>

              <Text style={styles.category}>
                {item.shopType === "MEAT" && "🥩 Fresh Meat"}
                {item.restaurantType === "PURE_VEG" && " 🥬 Pure Veg"}
                {item.restaurantType === "VEG_NON_VEG" && " 🍽 Veg & Non-Veg"} •{" "}
                {item.category}
              </Text>

              {item.items.map((i, idx) => (
                <Text key={idx} style={styles.item}>
                  • {i.name} × {i.qty}
                </Text>
              ))}
            </View>
          )}
        />
      </View>

      {/* FILTER MODAL */}
      <Modal visible={filterVisible} transparent animationType="fade">
        <Pressable style={styles.overlay} onPress={() => setFilterVisible(false)}>
          <View style={styles.filterBox}>
            <Text style={styles.filterTitle}>Order Status</Text>
            {["ALL", "NEW", "ONGOING", "DELIVERED", "CANCELLED"].map(s => (
              <TouchableOpacity
                key={s}
                style={styles.filterItem}
                onPress={() => setStatusFilter(s as any)}
              >
                <Text style={styles.filterText}>{s}</Text>
              </TouchableOpacity>
            ))}

            <View style={styles.divider} />

            <Text style={styles.filterTitle}>Shop Type</Text>
            {["ALL", "MEAT", "PURE_VEG", "VEG_NON_VEG"].map(t => (
              <TouchableOpacity
                key={t}
                style={styles.filterItem}
                onPress={() => {
                  setTypeFilter(t as any);
                  setFilterVisible(false);
                }}
              >
                <Text style={styles.filterText}>{t.replace("_", " ")}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

/* ---------------- STATUS PILL ---------------- */

function StatusPill({ status }: any) {
  const colors: any = {
    NEW: "#FFB300",
    ACCEPTED: "#42A5F5",
    PREPARING: "#AB47BC",
    READY: "#66BB6A",
    PICKUP: "#78909C",
    CANCELLED: "#9E9E9E",
  };

  return (
    <View style={[styles.statusPill, { backgroundColor: colors[status] }]}>
      <Text style={styles.statusText}>{status}</Text>
    </View>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.primary, // TOP / NOTCH
  },

  appBar: {
    height: 56,
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },

  appBarTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.white,
  },

  content: {
    flex: 1,
    backgroundColor: COLORS.bg, // CONTENT AREA
  },

  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  rowBetween: { flexDirection: "row", justifyContent: "space-between" },
  orderId: { fontWeight: "800", color: COLORS.textDark },
  category: { marginTop: 8, fontWeight: "700" },
  item: { marginTop: 4, color: "#555" },

  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },

  statusText: { color: "#fff", fontSize: 11, fontWeight: "700" },

  empty: { textAlign: "center", marginTop: 40, color: "#777" },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },

  filterBox: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    width: "75%",
    padding: 16,
  },

  filterTitle: {
    fontWeight: "800",
    marginBottom: 8,
    color: COLORS.textDark,
  },

  filterItem: { paddingVertical: 10 },
  filterText: { fontWeight: "600", color: COLORS.textMuted },

  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 12,
  },
});
