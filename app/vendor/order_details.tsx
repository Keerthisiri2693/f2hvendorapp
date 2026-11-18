import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Linking,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

/* 🌿 GREEN THEME */
const COLORS = {
  primary: "#2E7D32",
  accent: "#43A047",
  bg: "#E8F5E9",
  card: "#FFFFFF",
  border: "#C8E6C9",
  textDark: "#1B5E20",
  textMuted: "#558B2F",
};

/* ---------------- MOCK ORDER DATA ---------------- */

const ORDER_DATA: any = {
  ORD001: {
    id: "ORD001",
    status: "READY",
    placedAt: "10:05 AM",
    acceptedAt: "10:10 AM",
    readyAt: "10:35 AM",
    pickupAt: null,
    shopType: "MEAT",
    category: "Chicken",
    customer: {
      name: "Rahul Kumar",
      phone: "9876543210",
      address: "12, Anna Nagar, Chennai",
    },
    deliveryPartner: {
      name: "Suresh",
      phone: "9123456789",
      vehicle: "Bike",
    },
    items: [
      { name: "Chicken Curry Cut", qty: 2, price: 220 },
      { name: "Chicken Liver", qty: 1, price: 120 },
    ],
    gstPercent: 5,
  },
};

/* ---------------- SCREEN ---------------- */

export default function OrderDetails() {
  const { orderId } = useLocalSearchParams();
  const order = ORDER_DATA[orderId as string];

  if (!order) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={{ textAlign: "center", marginTop: 40 }}>
          Order not found
        </Text>
      </SafeAreaView>
    );
  }

  const subTotal = order.items.reduce(
    (sum: number, i: any) => sum + i.price * i.qty,
    0
  );
  const gstTotal = (subTotal * order.gstPercent) / 100;
  const cgst = gstTotal / 2;
  const sgst = gstTotal / 2;
  const total = subTotal + gstTotal;

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />

      {/* APP BAR */}
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons
            name="arrow-left"
            size={26}
            color={COLORS.primary}
          />
        </TouchableOpacity>

        <Text style={styles.appBarTitle}>Order Details</Text>

        <TouchableOpacity onPress={() => generateInvoicePDF(order)}>
          <MaterialCommunityIcons
            name="printer"
            size={22}
            color={COLORS.primary}
          />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* ORDER ID + STATUS */}
        <View style={styles.rowBetween}>
          <Text style={styles.orderId}>#{order.id}</Text>
          <StatusPill status={order.status} />
        </View>

        {/* ORDER TIMELINE */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Order Timeline</Text>
          <TimelineRow label="Placed" time={order.placedAt} active />
          <TimelineRow label="Accepted" time={order.acceptedAt} active />
          <TimelineRow label="Ready" time={order.readyAt} active />
          <TimelineRow label="Pickup" time={order.pickupAt} active={false} />
        </View>

        {/* CUSTOMER */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Customer</Text>
          <InfoRow icon="account" text={order.customer.name} />
          <InfoRow icon="map-marker" text={order.customer.address} />

          <View style={styles.actionInline}>
            <ActionIcon
              icon="phone"
              label="Call"
              onPress={() => Linking.openURL(`tel:${order.customer.phone}`)}
            />
            <ActionIcon
              icon="whatsapp"
              label="WhatsApp"
              onPress={() =>
                Linking.openURL(`https://wa.me/91${order.customer.phone}`)
              }
            />
          </View>
        </View>

        {/* DELIVERY PARTNER */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Delivery Partner</Text>
          <InfoRow
            icon="bike"
            text={`${order.deliveryPartner.name} (${order.deliveryPartner.vehicle})`}
          />
          <ActionIcon
            icon="phone"
            label="Call Rider"
            onPress={() =>
              Linking.openURL(`tel:${order.deliveryPartner.phone}`)
            }
          />
        </View>

        {/* ITEMS */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Items</Text>
          {order.items.map((i: any, idx: number) => (
            <View key={idx} style={styles.billRow}>
              <Text>{i.name} × {i.qty}</Text>
              <Text>₹{i.price * i.qty}</Text>
            </View>
          ))}
        </View>

        {/* BILL SUMMARY */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Bill Summary</Text>
          <BillRow label="Subtotal" value={`₹${subTotal}`} />
          <BillRow label="CGST (2.5%)" value={`₹${cgst}`} />
          <BillRow label="SGST (2.5%)" value={`₹${sgst}`} />
          <View style={styles.divider} />
          <BillRow label="Total Amount" value={`₹${total}`} bold />
        </View>

        {/* INVOICE */}
        <TouchableOpacity
          style={styles.invoiceBtn}
          onPress={() => generateInvoicePDF(order)}
        >
          <MaterialCommunityIcons
            name="file-pdf-box"
            size={20}
            color="#fff"
          />
          <Text style={styles.invoiceText}>Generate Invoice (PDF)</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ---------------- HELPERS ---------------- */

function TimelineRow({ label, time, active }: any) {
  return (
    <View style={styles.timelineRow}>
      <View
        style={[
          styles.timelineDot,
          { backgroundColor: active ? COLORS.primary : "#CCC" },
        ]}
      />
      <Text>{label} {time && `• ${time}`}</Text>
    </View>
  );
}

function InfoRow({ icon, text }: any) {
  return (
    <View style={styles.infoRow}>
      <MaterialCommunityIcons name={icon} size={18} color={COLORS.primary} />
      <Text>{text}</Text>
    </View>
  );
}

function ActionIcon({ icon, label, onPress }: any) {
  return (
    <TouchableOpacity style={styles.actionIcon} onPress={onPress}>
      <MaterialCommunityIcons name={icon} size={18} color={COLORS.primary} />
      <Text>{label}</Text>
    </TouchableOpacity>
  );
}

function BillRow({ label, value, bold }: any) {
  return (
    <View style={styles.billRow}>
      <Text style={bold && styles.bold}>{label}</Text>
      <Text style={bold && styles.bold}>{value}</Text>
    </View>
  );
}

function StatusPill({ status }: any) {
  const colors: any = {
    NEW: "#FFB300",
    ACCEPTED: "#42A5F5",
    PREPARING: "#AB47BC",
    READY: "#66BB6A",
    PICKUP: "#78909C",
  };

  return (
    <View style={[styles.statusPill, { backgroundColor: colors[status] }]}>
      <Text style={styles.statusText}>{status}</Text>
    </View>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },

  appBar: {
    height: 56,
    backgroundColor: COLORS.bg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  appBarTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.textDark,
  },

  container: { padding: 16 },

  rowBetween: { flexDirection: "row", justifyContent: "space-between" },
  orderId: { fontWeight: "800", color: COLORS.textDark },

  card: {
    backgroundColor: COLORS.card,
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  cardTitle: { fontWeight: "800", marginBottom: 10 },

  timelineRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  timelineDot: { width: 10, height: 10, borderRadius: 5, marginRight: 10 },

  infoRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 6 },
  actionInline: { flexDirection: "row", gap: 16, marginTop: 8 },
  actionIcon: { flexDirection: "row", gap: 6, alignItems: "center" },

  billRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: 8 },
  bold: { fontWeight: "800" },

  invoiceBtn: {
    backgroundColor: COLORS.primary,
    padding: 14,
    borderRadius: 14,
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },

  invoiceText: { color: "#fff", fontWeight: "800" },

  statusPill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusText: { color: "#fff", fontSize: 11, fontWeight: "700" },
});

/* ---------------- PDF GENERATION (UNCHANGED) ---------------- */

const generateInvoicePDF = async (order: any) => {
  /* same as your existing implementation */
};
