import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";

/* 🌿 GREEN THEME */
const PRIMARY = "#2E7D32";
const BG = "#F6FBF7";

export default function VendorBranchesScreen() {
  const insets = useSafeAreaInsets(); // ✅ KEY FIX

  const branches = [
    {
      id: 1,
      name: "Velachery Branch",
      address: "Velachery Main Road, Chennai",
      landmark: "Near Phoenix Mall",
      phone: "+91 98765 43210",
      manager: "Suresh Kumar",
      hours: "9:00 AM – 9:00 PM",
      rating: 4.6,
      isOpen: true,
    },
    {
      id: 2,
      name: "Tambaram Branch",
      address: "GST Road, Tambaram",
      landmark: "Opposite Railway Station",
      phone: "+91 91234 56789",
      manager: "Ravi Shankar",
      hours: "10:00 AM – 10:00 PM",
      rating: 4.3,
      isOpen: false,
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: BG }}>
      {/* ✅ STATUS BAR */}
      <StatusBar
        translucent
        barStyle="dark-content"
        backgroundColor="transparent"
      />

      {/* ✅ TOOLBAR (NO NOTCH GAP) */}
      <View
        style={[
          styles.toolbar,
          {
            paddingTop: insets.top,
            height: 56 + insets.top,
          },
        ]}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons
            name="arrow-left"
            size={24}
            color={"#FFFF"}
          />
        </TouchableOpacity>

        <Text style={styles.toolbarTitle}>Branches</Text>

        <TouchableOpacity onPress={() => alert("Add Branch")}>
          <MaterialCommunityIcons
            name="plus-circle"
            size={24}
            color={"#FFFF"}
          />
        </TouchableOpacity>
      </View>

      {/* CONTENT */}
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.pageSub}>
          Manage and view all your shop branches
        </Text>

        {branches.map((b) => (
          <View key={b.id} style={styles.card}>
            {/* TOP */}
            <View style={styles.topRow}>
              <Text style={styles.branchName}>{b.name}</Text>

              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: b.isOpen ? "#E8F5E9" : "#FDECEA" },
                ]}
              >
                <Text
                  style={{
                    color: b.isOpen ? "#2E7D32" : "#C62828",
                    fontWeight: "800",
                    fontSize: 12,
                  }}
                >
                  {b.isOpen ? "OPEN" : "CLOSED"}
                </Text>
              </View>
            </View>

            <Text style={styles.address}>📍 {b.address}</Text>
            <Text style={styles.landmark}>Landmark: {b.landmark}</Text>

            <View style={styles.infoRow}>
              <Info icon="account" label="Manager" value={b.manager} />
              <Info icon="phone" label="Contact" value={b.phone} />
            </View>

            <View style={styles.infoRow}>
              <Info icon="clock-outline" label="Hours" value={b.hours} />
              <Info icon="star" label="Rating" value={`${b.rating} ★`} />
            </View>

            <View style={styles.actionRow}>
              <ActionBtn icon="map-marker" label="Map" />
              <ActionBtn icon="phone" label="Call" />
              <ActionBtn icon="pencil" label="Edit" />
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

/* ---------------- COMPONENTS ---------------- */

const Info = ({ icon, label, value }: any) => (
  <View style={styles.infoBox}>
    <MaterialCommunityIcons name={icon} size={18} color={PRIMARY} />
    <View style={{ marginLeft: 6 }}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  </View>
);

const ActionBtn = ({ icon, label }: any) => (
  <TouchableOpacity style={styles.actionBtn}>
    <MaterialCommunityIcons name={icon} size={18} color={PRIMARY} />
    <Text style={styles.actionText}>{label}</Text>
  </TouchableOpacity>
);

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  toolbar: {
    backgroundColor:PRIMARY,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    elevation: 4,
  },

  toolbarTitle: {
    color: "#FFFF",
    fontSize: 18,
    fontWeight: "900",
  },

  container: {
    padding: 16,
    paddingBottom: 40,
  },

  pageSub: {
    color: "#777",
    marginBottom: 16,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  branchName: {
    fontSize: 17,
    fontWeight: "900",
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },

  address: {
    marginTop: 6,
    fontWeight: "600",
    color: "#444",
  },

  landmark: {
    fontSize: 12,
    color: "#777",
    marginBottom: 8,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },

  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    width: "48%",
  },

  infoLabel: {
    fontSize: 11,
    color: "#777",
  },

  infoValue: {
    fontWeight: "700",
    fontSize: 13,
  },

  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14,
  },

  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: PRIMARY,
  },

  actionText: {
    marginLeft: 6,
    color: PRIMARY,
    fontWeight: "800",
    fontSize: 13,
  },
});
