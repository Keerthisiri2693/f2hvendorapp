import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
  ScrollView,
  RefreshControl,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import BottomNav from "@/components/BottomNav";

/* 🌿 GREEN THEME */
const COLORS = {
  primary: "#2E7D32",
  primaryDark: "#1B5E20",
  background: "#E8F5E9",
  surface: "#FFFFFF",
  surfaceSoft: "#F1F8F4",
  textPrimary: "#1B5E20",
  textSecondary: "#777",
  accent: "#43A047",
  warning: "#FFD600",
};

export default function VendorDashboard() {
  const [shopOpen, setShopOpen] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* 🌿 HEADER */}
      <View style={styles.appBar}>
        <View>
          <Text style={styles.greeting}>Hello 👋</Text>
          <Text style={styles.appTitle}>Vendor Dashboard</Text>
        </View>

        <View style={{ flexDirection: "row", gap: 14 }}>
          <TouchableOpacity
            onPress={() =>
              router.push("/common/VendorNotificationPage")
            }
          >
            <MaterialCommunityIcons
              name="bell-outline"
              size={26}
              color="#fff"
            />
            <View style={styles.badge} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/profile/profile")}
          >
            <MaterialCommunityIcons
              name="account-circle"
              size={34}
              color="#fff"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* CONTENT */}
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
          />
        }
        contentContainerStyle={styles.container}
      >
        {/* STORE CARD */}
        <View style={styles.storeCard}>
          <View style={styles.storeIcon}>
            <MaterialCommunityIcons
              name="storefront"
              size={34}
              color={COLORS.primary}
            />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.storeName}>My Store</Text>
            <Text style={styles.storeEmail}>vendor@email.com</Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setShopOpen(!shopOpen)}
            style={[
              styles.toggleContainer,
              shopOpen ? styles.openBg : styles.closedBg,
            ]}
          >
            <View
              style={[
                styles.toggleDot,
                shopOpen ? styles.dotRight : styles.dotLeft,
              ]}
            />
            <Text
              style={[
                styles.toggleText,
                shopOpen ? styles.openText : styles.closedText,
              ]}
            >
              {shopOpen ? "OPEN" : "CLOSED"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* TODAY STATS */}
        <View style={styles.todayCard}>
          <Stat label="Today Orders" value="12" />
          <Stat label="Revenue" value="₹3,250" />
          <Stat label="Pending" value="2" />
        </View>

        {/* KPI */}
        <View style={styles.kpiRow}>
          <KpiCard title="Orders" value="120" icon="clipboard-list-outline" />
          <KpiCard title="Products" value="18" icon="package-variant" />
        </View>

        <View style={styles.kpiRow}>
          <KpiCard title="Earnings" value="₹45,000" icon="currency-inr" />
          <KpiCard title="Cancelled" value="3" icon="close-circle-outline" />
        </View>

        {/* RECENT ORDERS */}
        <Text style={styles.sectionTitle}>Recent Orders</Text>
        <RecentOrder id="#ORD1021" status="Preparing" amount="₹450" />
        <RecentOrder id="#ORD1020" status="Delivered" amount="₹320" />

        <TouchableOpacity
          style={styles.viewAllBtn}
          onPress={() => router.push("/vendor/manageorders")}
        >
          <Text style={styles.viewAllText}>View All Orders</Text>
        </TouchableOpacity>

        {/* QUICK ACTIONS */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <View style={styles.actionGrid}>
          <ActionCard icon="storefront-outline" label="Products" onPress={() => router.push("/vendor/manageproducts")} />
          <ActionCard icon="package-variant-closed" label="Manage Orders" onPress={() => router.push("/vendor/manageorders")} />
          <ActionCard icon="warehouse" label="Inventory / Stock" onPress={() => router.push("/vendor/inventory")} />
          <ActionCard icon="tag-outline" label="Offers" onPress={() => router.push("/vendor/createoffers")} />
          <ActionCard icon="currency-inr" label="Earnings" onPress={() => router.push("/vendor/earnings")} />
          <ActionCard icon="file-chart-outline" label="Reports" onPress={() => router.push("/vendor/reports")} />
          <ActionCard icon="account-circle-outline" label="Profile" onPress={() => router.push("/profile/profile")} />
          <ActionCard icon="cog-outline" label="Setting" onPress={() => router.push("/common/settings/settings")} />
        </View>
      </ScrollView>
    </View>
  );
}

/* SMALL COMPONENTS */

const Stat = ({ label, value }: any) => (
  <View style={styles.statItem}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const RecentOrder = ({ id, status, amount }: any) => (
  <View style={styles.orderRow}>
    <Text style={styles.orderId}>{id}</Text>
    <Text style={styles.orderStatus}>{status}</Text>
    <Text style={styles.orderAmount}>{amount}</Text>
  </View>
);

function KpiCard({ title, value, icon }: any) {
  return (
    <View style={styles.kpiCard}>
      <MaterialCommunityIcons name={icon} size={26} color={COLORS.primary} />
      <Text style={styles.kpiValue}>{value}</Text>
      <Text style={styles.kpiTitle}>{title}</Text>
    </View>
  );
}

function ActionCard({ icon, label, onPress }: any) {
  return (
    <TouchableOpacity style={styles.actionCard} onPress={onPress}>
      <MaterialCommunityIcons name={icon} size={26} color={COLORS.primary} />
      <Text style={styles.actionLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

/* STYLES */

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },

  appBar: {
    paddingTop:
      Platform.OS === "android" ? StatusBar.currentHeight ?? 24 : 44,
    paddingHorizontal: 20,
    paddingBottom: 28,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },

  greeting: { fontSize: 13, color: "#C8E6C9" },
  appTitle: { fontSize: 22, fontWeight: "800", color: "#fff" },

  badge: {
    position: "absolute",
    right: -2,
    top: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.warning,
  },

  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -10,
    paddingBottom: 120,
  },

  storeCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 18,
    marginBottom: 22,
    elevation: 6,
  },

  storeIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.surfaceSoft,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  storeName: { fontSize: 16, fontWeight: "700" },
  storeEmail: { fontSize: 13, color: COLORS.textSecondary },

  toggleContainer: {
    width: 92,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    marginLeft: 8,
  },

  toggleDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
    position: "absolute",
  },

  dotLeft: { left: 6 },
  dotRight: { right: 6 },

  openBg: { backgroundColor: COLORS.primary },
  closedBg: { backgroundColor: "#B71C1C" },

  toggleText: { fontSize: 11, fontWeight: "800", alignSelf: "center" },
  openText: { color: "#E8F5E9" },
  closedText: { color: "#FFEBEE" },

  todayCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: COLORS.surfaceSoft,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },

  statItem: { alignItems: "center" },
  statValue: { fontSize: 18, fontWeight: "800" },
  statLabel: { fontSize: 12, color: COLORS.textSecondary },

  kpiRow: { flexDirection: "row", marginBottom: 12 },

  kpiCard: {
    flex: 1,
    backgroundColor: "#FAFAFA",
    borderRadius: 18,
    paddingVertical: 22,
    marginHorizontal: 6,
    alignItems: "center",
    elevation: 3,
  },

  kpiValue: { fontSize: 18, fontWeight: "800", marginTop: 8 },
  kpiTitle: { fontSize: 12, color: COLORS.textSecondary },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginVertical: 14,
  },

  orderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: COLORS.surface,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#EEE",
  },

  orderId: { fontWeight: "600" },
  orderStatus: { color: COLORS.primary },
  orderAmount: { fontWeight: "700" },

  viewAllBtn: { alignSelf: "center", marginVertical: 10 },
  viewAllText: { color: COLORS.primary, fontWeight: "700" },

  actionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  actionCard: {
    width: "48%",
    backgroundColor: "#F9F9F9",
    borderRadius: 18,
    paddingVertical: 24,
    alignItems: "center",
    marginBottom: 14,
  },

  actionLabel: { fontSize: 13, fontWeight: "600", marginTop: 8 },
});
