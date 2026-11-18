import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Platform,
  StatusBar as RNStatusBar,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Swipeable } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";

/* ================= GREEN THEME ================= */

const PRIMARY = "#2E7D32";
const PRIMARY_DARK = "#1B5E20";
const BG = "#E8F5E9";
const CARD = "#FFFFFF";
const SOFT = "#F1F8F4";

/* ================= DUMMY DATA ================= */

const INITIAL_NOTIFICATIONS = [
  {
    id: "1",
    title: "New Order Received",
    message: "Order #ORD245 has been placed successfully.",
    time: "Today",
    isRead: false,
    icon: "shopping",
  },
  {
    id: "2",
    title: "Payment Successful",
    message: "₹1,540 credited via UPI.",
    time: "Today",
    isRead: true,
    icon: "credit-card-check",
  },
  {
    id: "3",
    title: "Order Cancelled",
    message: "Order #ORD232 was cancelled by customer.",
    time: "Yesterday",
    isRead: false,
    icon: "close-circle",
  },
  {
    id: "4",
    title: "Low Stock Alert",
    message: "Chicken Curry stock is running low.",
    time: "Older",
    isRead: true,
    icon: "alert",
  },
];

/* ================= MAIN ================= */

export default function VendorNotifications() {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [tab, setTab] = useState<"ALL" | "UNREAD" | "READ">("ALL");

  /* ================= FILTER ================= */

  const filteredNotifications = useMemo(() => {
    if (tab === "UNREAD") return notifications.filter(n => !n.isRead);
    if (tab === "READ") return notifications.filter(n => n.isRead);
    return notifications;
  }, [notifications, tab]);

  /* ================= ACTIONS ================= */

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  /* ================= UI ================= */

  return (
    <View style={styles.safe}>
      <StatusBar style="dark" backgroundColor={CARD} />

      {/* 🌿 APP BAR */}
      <View style={styles.appBar}>
        <MaterialCommunityIcons
          name="arrow-left"
          size={24}
          color={PRIMARY}
        />
        <Text style={styles.appBarTitle}>Notifications</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* 🌿 TABS */}
      <View style={styles.tabs}>
        {["ALL", "UNREAD", "READ"].map(t => (
          <TouchableOpacity
            key={t}
            style={[styles.tab, tab === t && styles.tabActive]}
            onPress={() => setTab(t as any)}
          >
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
              {t}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 🌿 LIST */}
      <FlatList
        data={filteredNotifications}
        keyExtractor={i => i.id}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.empty}>No notifications found</Text>
        }
        renderItem={({ item }) => (
          <Swipeable
            renderRightActions={() => (
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => deleteNotification(item.id)}
              >
                <MaterialCommunityIcons
                  name="trash-can"
                  size={22}
                  color="#fff"
                />
              </TouchableOpacity>
            )}
          >
            <TouchableOpacity
              style={[
                styles.card,
                !item.isRead && styles.unreadCard,
              ]}
              activeOpacity={0.85}
              onPress={() => markAsRead(item.id)}
            >
              {/* ICON */}
              <View style={styles.iconWrap}>
                <MaterialCommunityIcons
                  name={item.icon}
                  size={22}
                  color={PRIMARY}
                />
              </View>

              {/* TEXT */}
              <View style={{ flex: 1 }}>
                <View style={styles.rowBetween}>
                  <Text
                    style={[
                      styles.title,
                      !item.isRead && styles.unreadText,
                    ]}
                  >
                    {item.title}
                  </Text>
                  {!item.isRead && <View style={styles.dot} />}
                </View>

                <Text style={styles.message}>{item.message}</Text>
                <Text style={styles.time}>{item.time}</Text>
              </View>
            </TouchableOpacity>
          </Swipeable>
        )}
      />
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BG,
  },

  /* APP BAR */
  appBar: {
    backgroundColor: CARD,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,

    paddingTop: Platform.OS === "android" ? RNStatusBar.currentHeight : 44,
    height:
      Platform.OS === "android"
        ? 56 + (RNStatusBar.currentHeight || 0)
        : 100,

    borderBottomWidth: 1,
    borderColor: "#E0E0E0",
  },

  appBarTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: PRIMARY,
  },

  /* TABS */
  tabs: {
    flexDirection: "row",
    backgroundColor: CARD,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  tabActive: {
    borderBottomWidth: 3,
    borderColor: PRIMARY,
  },
  tabText: {
    fontWeight: "600",
    color: "#777",
  },
  tabTextActive: {
    color: PRIMARY,
  },

  /* CARD */
  card: {
    flexDirection: "row",
    backgroundColor: CARD,
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    elevation: 2,
  },
  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: PRIMARY,
  },

  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: SOFT,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    fontSize: 15,
    fontWeight: "800",
    color: "#111",
  },
  unreadText: {
    color: PRIMARY,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: PRIMARY,
  },

  message: {
    marginTop: 2,
    fontSize: 13,
    color: "#555",
  },

  time: {
    marginTop: 4,
    fontSize: 11,
    color: "#999",
  },

  deleteBtn: {
    width: 64,
    backgroundColor: "#D32F2F",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
    marginVertical: 6,
    marginRight: 16,
  },

  empty: {
    textAlign: "center",
    marginTop: 40,
    color: "#777",
  },
});
