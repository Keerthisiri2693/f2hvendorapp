import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";

const PARTNERS = [
  {
    id: "1",
    name: "Ramesh Kumar",
    vehicle: "Bike",
    online: true,
    rating: 4.6,
    deliveries: 120,
    todayOrders: 8,
    earnings: 420,
  },
  {
    id: "2",
    name: "Suresh",
    vehicle: "Cycle",
    online: false,
    rating: 4.2,
    deliveries: 88,
    todayOrders: 0,
    earnings: 0,
  },
];

export default function DeliveryPartners() {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>Delivery Partners</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => router.push("/vendor/adddeliverypartner")}
        >
          <MaterialCommunityIcons name="plus" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* LIST */}
      <FlatList
        data={PARTNERS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {/* TOP */}
            <View style={styles.rowBetween}>
              <View>
                <View style={styles.row}>
                  <View
                    style={[
                      styles.dot,
                      { backgroundColor: item.online ? "#2E7D32" : "#D32F2F" },
                    ]}
                  />
                  <Text style={styles.name}>{item.name}</Text>
                </View>
                <Text style={styles.sub}>
                  {item.vehicle} • {item.online ? "Online" : "Offline"}
                </Text>
              </View>

              <Text style={styles.rating}>
                ⭐ {item.rating}
              </Text>
            </View>

            {/* STATS */}
            <View style={styles.statsRow}>
              <Stat label="Deliveries" value={item.deliveries} />
              <Stat label="Today" value={item.todayOrders} />
              <Stat label="₹ Earned" value={item.earnings} />
            </View>

            {/* ACTIONS */}
           <View style={styles.actions}>
  <ActionBtn
    icon="truck-delivery"
    label="Assign"
    onPress={() => router.push("/vendor/adddeliverypartner")}
  />

  <ActionBtn
    icon="phone"
    label="Call"
    onPress={() => {
      // call logic
    }}
  />

  <ActionBtn
    icon="dots-vertical"
    label="More"
    onPress={() => {
      // open bottom sheet / menu
    }}
  />
</View>

          </View>
        )}
      />
    </SafeAreaView>
  );
}

/* SMALL COMPONENTS */

const Stat = ({ label, value }: any) => (
  <View style={styles.stat}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const ActionBtn = ({ icon, label }: any) => (
  <TouchableOpacity style={styles.actionBtn}>
    <MaterialCommunityIcons name={icon} size={18} />
    <Text style={styles.actionText}>{label}</Text>
  </TouchableOpacity>
);

/* STYLES */

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },

  title: { fontSize: 20, fontWeight: "800" },

  addBtn: {
    backgroundColor: "#C62828",
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  card: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 14,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#EEEEEE",
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  name: {
    fontSize: 16,
    fontWeight: "700",
  },

  sub: {
    fontSize: 12,
    color: "#777",
    marginTop: 2,
  },

  rating: {
    fontSize: 14,
    fontWeight: "700",
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },

  stat: {
    alignItems: "center",
    flex: 1,
  },

  statValue: {
    fontSize: 15,
    fontWeight: "800",
  },

  statLabel: {
    fontSize: 11,
    color: "#777",
  },

  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14,
  },

  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: "#F5F5F5",
  },

  actionText: {
    fontSize: 12,
    fontWeight: "600",
  },
});
