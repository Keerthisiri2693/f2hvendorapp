import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  StatusBar as RNStatusBar,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router } from "expo-router";
import Svg, { G, Path,Circle } from "react-native-svg";
import { StatusBar } from "expo-status-bar";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

/* ---------------- MOCK DATA ---------------- */

const ORDERS = [
  { id: "ORD1001", branchId: "BR001", branchName: "Anna Nagar", netAmount: 1000, date: "2025-12-31" },
  { id: "ORD1002", branchId: "BR002", branchName: "Velachery", netAmount: 800, date: "2025-12-30" },
  { id: "ORD1003", branchId: "BR001", branchName: "Anna Nagar", netAmount: 1200, date: "2025-12-31" },
  { id: "ORD1004", branchId: "BR003", branchName: "Tambaram", netAmount: 600, date: "2025-12-29" },
];

/* ---------------- CONSTANTS ---------------- */

const FILTERS = ["TODAY", "WEEK", "MONTH", "CUSTOM"] as const;
const PRIMARY = "#2E7D32";
const BG = "#F6F7FB";

const BRANCH_COLORS: Record<string, string> = {
  BR001: "#4CAF50",
  BR002: "#2196F3",
  BR003: "#9C27B0",
};

const startOfDay = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate());

/* ================================================== */

export default function EarningsPage() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("WEEK");
  const [showPicker, setShowPicker] = useState(false);
  const [customDate, setCustomDate] = useState<Date | null>(null);

  const [branchMenu, setBranchMenu] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<"ALL" | string>("ALL");
  const [activeSlice, setActiveSlice] = useState<string | null>(null);

  /* --------- BRANCH LIST --------- */

  const branches = useMemo(() => {
    const map = new Map<string, string>();
    ORDERS.forEach(o => map.set(o.branchId, o.branchName));
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, []);

  /* --------- FILTER ORDERS --------- */

  const filteredOrders = useMemo(() => {
    const today = startOfDay(new Date());
    const weekAgo = new Date(today);
    weekAgo.setDate(today.getDate() - 6);

    return ORDERS.filter(o => {
      if (selectedBranch !== "ALL" && o.branchId !== selectedBranch) return false;

      const d = startOfDay(new Date(o.date));
      if (filter === "TODAY") return d.getTime() === today.getTime();
      if (filter === "WEEK") return d >= weekAgo && d <= today;
      if (filter === "MONTH") return d.getMonth() === today.getMonth();
      if (filter === "CUSTOM")
        return customDate && d.getTime() === startOfDay(customDate).getTime();
      return true;
    });
  }, [filter, customDate, selectedBranch]);

  /* --------- SUMMARY --------- */

  const summary = useMemo(() => {
    return filteredOrders.reduce(
      (a, o) => {
        a.orders++;
        a.net += o.netAmount;
        return a;
      },
      { orders: 0, net: 0 }
    );
  }, [filteredOrders]);

  /* --------- PIE DATA --------- */

  const pieData = useMemo(() => {
    // ALL branches → branch-wise
    if (selectedBranch === "ALL") {
      const map: any = {};
      filteredOrders.forEach(o => {
        if (!map[o.branchId]) {
          map[o.branchId] = {
            id: o.branchId,
            label: o.branchName,
            value: 0,
          };
        }
        map[o.branchId].value += o.netAmount;
      });
      return Object.values(map);
    }

    // Single branch → 100%
    const total = filteredOrders.reduce((s, o) => s + o.netAmount, 0);
    return total > 0
      ? [{
          id: selectedBranch,
          label: branches.find(b => b.id === selectedBranch)?.name ?? "Branch",
          value: total,
        }]
      : [];
  }, [filteredOrders, selectedBranch, branches]);

  const totalValue = pieData.reduce((s: number, p: any) => s + p.value, 0);

  /* --------- PDF EXPORT --------- */

  const downloadPdf = async () => {
    const rows = filteredOrders
      .map(
        o => `
        <tr>
          <td>${o.id}</td>
          <td>${o.branchName}</td>
          <td>${o.date}</td>
          <td>₹${o.netAmount}</td>
        </tr>`
      )
      .join("");

    const html = `
      <html>
        <body style="font-family: Arial; padding: 16px">
          <h2>Earnings Report</h2>
          <p><b>Branch:</b> ${selectedBranch === "ALL" ? "All Branches" : branches.find(b => b.id === selectedBranch)?.name}</p>
          <p><b>Filter:</b> ${filter}</p>
          <h3>Total: ₹${summary.net}</h3>
          <table border="1" cellspacing="0" cellpadding="6" width="100%">
            <tr>
              <th>Order</th>
              <th>Branch</th>
              <th>Date</th>
              <th>Amount</th>
            </tr>
            ${rows}
          </table>
        </body>
      </html>
    `;

    const { uri } = await Print.printToFileAsync({ html });
    await Sharing.shareAsync(uri);
  };

  /* --------- PIE GEOMETRY --------- */

  let startAngle = 0;
  const radius = 90;
  const center = 110;

  return (
    <View style={styles.safe}>
      <StatusBar style="dark" backgroundColor="#fff" />

      {/* TOOLBAR */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={26} color={"#FFFF"} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Earnings</Text>
        <TouchableOpacity onPress={downloadPdf}>
          <MaterialCommunityIcons name="download" size={24} color={"#FFFF"} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* BRANCH DROPDOWN */}
        <View style={styles.dropdownWrap}>
          <TouchableOpacity style={styles.dropdownBtn} onPress={() => setBranchMenu(!branchMenu)}>
            <MaterialCommunityIcons name="store" size={18} />
            <Text style={styles.dropdownText}>
              {selectedBranch === "ALL" ? "All Branches" : branches.find(b => b.id === selectedBranch)?.name}
            </Text>
            <MaterialCommunityIcons name="chevron-down" size={20} />
          </TouchableOpacity>

          {branchMenu && (
            <View style={styles.dropdownMenu}>
              <DropdownItem label="All Branches" onPress={() => { setSelectedBranch("ALL"); setBranchMenu(false); }} />
              {branches.map(b => (
                <DropdownItem key={b.id} label={b.name} onPress={() => { setSelectedBranch(b.id); setBranchMenu(false); }} />
              ))}
            </View>
          )}
        </View>

        {/* FILTERS */}
        <View style={styles.filterRow}>
          {FILTERS.map(f => (
            <TouchableOpacity key={f} style={[styles.filterChip, filter === f && styles.filterChipActive]}
              onPress={() => { setFilter(f); if (f === "CUSTOM") setShowPicker(true); }}>
              <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {showPicker && (
          <DateTimePicker
            value={customDate || new Date()}
            mode="date"
            onChange={(e, d) => { setShowPicker(false); if (d) setCustomDate(d); }}
          />
        )}

        {/* SUMMARY */}
        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>Net Earnings</Text>
          <Text style={styles.totalAmount}>₹{summary.net}</Text>
          <Text style={styles.totalSub}>{summary.orders} orders</Text>
        </View>

        {/* PIE CHART */}
  {/* PIE CHART */}
{pieData.length > 0 && (
  <View style={styles.chartCard}>
    <Svg width={220} height={220}>
      <G x={center} y={center}>

        {/* ✅ SINGLE BRANCH → FULL CIRCLE */}
        {pieData.length === 1 && (
          <Circle
            cx={0}
            cy={0}
            r={radius}
            fill={BRANCH_COLORS[pieData[0].id] || PRIMARY}
            onPress={() => setActiveSlice(pieData[0].id)}
          />
        )}

        {/* ✅ MULTI BRANCH → NORMAL PIE */}
        {pieData.length > 1 &&
          (() => {
            let startAngle = 0;

            return pieData.map(slice => {
              const angle = (slice.value / totalValue) * Math.PI * 2;
              const endAngle = startAngle + angle;

              const x1 = Math.cos(startAngle) * radius;
              const y1 = Math.sin(startAngle) * radius;
              const x2 = Math.cos(endAngle) * radius;
              const y2 = Math.sin(endAngle) * radius;

              const largeArc = angle > Math.PI ? 1 : 0;

              const path = `
                M 0 0
                L ${x1} ${y1}
                A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}
                Z
              `;

              startAngle = endAngle;

              return (
                <Path
                  key={slice.id}
                  d={path}
                  fill={BRANCH_COLORS[slice.id] || PRIMARY}
                  opacity={
                    activeSlice && activeSlice !== slice.id ? 0.4 : 1
                  }
                  onPress={() => setActiveSlice(slice.id)}
                />
              );
            });
          })()}
      </G>
    </Svg>

    {/* LEGEND */}
    {pieData.map(p => (
      <View key={p.id} style={styles.legendRow}>
        <View
          style={[
            styles.legendDot,
            { backgroundColor: BRANCH_COLORS[p.id] || PRIMARY },
          ]}
        />
        <Text style={styles.legendText}>
          {p.label} — ₹{p.value}
        </Text>
      </View>
    ))}
  </View>
)}

      </ScrollView>
    </View>
  );
}

/* ---------------- COMPONENTS ---------------- */

const DropdownItem = ({ label, onPress }: any) => (
  <TouchableOpacity style={styles.dropdownItem} onPress={onPress}>
    <Text style={styles.dropdownItemText}>{label}</Text>
  </TouchableOpacity>
);

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },

  header: {
    backgroundColor: "#2E7D32",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "android" ? RNStatusBar.currentHeight : 44,
    height: Platform.OS === "android" ? 56 + (RNStatusBar.currentHeight || 0) : 100,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },

  headerTitle: { fontSize: 20, fontWeight: "800",color:"#FFFF" },
  container: { padding: 16 },

  dropdownWrap: { marginBottom: 16 },
  dropdownBtn: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    backgroundColor: "#fff",
    borderRadius: 14,
    justifyContent: "space-between",
  },

  dropdownText: { fontWeight: "700" },
  dropdownMenu: { backgroundColor: "#fff", borderRadius: 14, marginTop: 6 },
  dropdownItem: { padding: 14 },
  dropdownItemText: { fontWeight: "600" },

  filterRow: { flexDirection: "row", justifyContent: "center", marginBottom: 18 },
  filterChip: { paddingHorizontal: 18, paddingVertical: 8, borderRadius: 24, backgroundColor: "#F2F2F2", marginHorizontal: 6 },
  filterChipActive: { backgroundColor: PRIMARY },
  filterText: { color: "#555", fontWeight: "600" },
  filterTextActive: { color: "#fff" },

  totalCard: { backgroundColor: PRIMARY, borderRadius: 18, padding: 22, marginBottom: 20 },
  totalLabel: { color: "#FFECEC" },
  totalAmount: { color: "#fff", fontSize: 36, fontWeight: "900" },
  totalSub: { color: "#FFECEC", fontSize: 13 },

  chartCard: { backgroundColor: "#fff", borderRadius: 16, padding: 16, alignItems: "center" },
  legendRow: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5, marginRight: 8 },
  legendText: { fontWeight: "600", fontSize: 13 },
});
