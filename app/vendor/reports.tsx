

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import React, { useMemo, useRef, useEffect, useState } from "react";
import { View, Text,StyleSheet, ScrollView, Animated, TouchableOpacity,Platform,StatusBar as RNStatusBar,} from "react-native";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

import Svg, { Rect, G, Text as SvgText,Polyline,Line,Circle,Path } from "react-native-svg";

/* ================= CONSTANTS ================= */

const PRIMARY = "#2E7D32";
const BG = "#F6F7FB";

/* ================= BRANCHES ================= */

const BRANCHES = [
  { id: "BR001", name: "Anna Nagar" },
  { id: "BR002", name: "Velachery" },
  { id: "BR003", name: "Tambaram" },
];

/* ================= DATA ================= */

const REPORT_DATA: any = {
  BR001: {
    salesTrend: [
      { label: "Mon", value: 800 },
      { label: "Tue", value: 1200 },
      { label: "Wed", value: 1100 },
      { label: "Thu", value: 1500 },
      { label: "Fri", value: 1800 },
      { label: "Sat", value: 400 },
      { label: "Sun", value: 1200 },
    ],
    summary: { gross: 7500, net: 6900, discount: 600, orders: 28, cancelled: 2 },
    payments: { UPI: 3600, CASH: 2100, CARD: 1200 },
    products: [
      { name: "Chicken Curry", amount: 2400 },
      { name: "Mutton Fry", amount: 1800 },
      { name: "Fish Fry", amount: 1200 },
    ],
  },
  BR002: {
    salesTrend: [
      { label: "Mon", value: 600 },
      { label: "Tue", value: 800 },
      { label: "Wed", value: 700 },
      { label: "Thu", value: 900 },
      { label: "Fri", value: 1100 },
      { label: "Sat", value: 150 },
      { label: "Sun", value: 850 },
    ],
    summary: { gross: 4800, net: 4500, discount: 300, orders: 16, cancelled: 1 },
    payments: { UPI: 2300, CASH: 1300, CARD: 900 },
    products: [
      { name: "Chicken Curry", amount: 1800 },
      { name: "Fish Fry", amount: 1200 },
      { name: "Mutton Fry", amount: 900 },
    ],
  },
  BR003: {
    salesTrend: [
      { label: "Mon", value: 400 },
      { label: "Tue", value: 400 },
      { label: "Wed", value: 300 },
      { label: "Thu", value: 400 },
      { label: "Fri", value: 400 },
      { label: "Sat", value: 50 },
      { label: "Sun", value: 450 },
    ],
    summary: { gross: 1200, net: 1050, discount: 150, orders: 6, cancelled: 0 },
    payments: { UPI: 1300, CASH: 700, CARD: 50 },
    products: [
      { name: "Chicken Curry", amount: 600 },
      { name: "Fish Fry", amount: 400 },
    ],
  },
};

const TABS = ["SALES", "ORDERS", "PAYMENTS", "PRODUCTS"] as const;

/* ================= MAIN ================= */

export default function VendorReportsPage() {
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>("SALES");
  const [selectedBranch, setSelectedBranch] = useState<"ALL" | string>("ALL");
  const [showBranch, setShowBranch] = useState(false);

  /* ================= NORMALIZED DATA ================= */

  const report = useMemo(() => {
    if (selectedBranch !== "ALL") {
      const b = REPORT_DATA[selectedBranch];
      return {
        salesLines: [{ id: selectedBranch, color: PRIMARY, data: b.salesTrend }],
        summary: b.summary,
        payments: b.payments,
        products: b.products,
      };
    }

    return {
      salesLines: Object.entries(REPORT_DATA).map(
        ([id, b]: any, i) => ({
          id,
          color: ["#E53935", "#1E88E5", "#43A047"][i],
          data: b.salesTrend,
        })
      ),
      summary: Object.values(REPORT_DATA).reduce(
        (a: any, b: any) => ({
          gross: a.gross + b.summary.gross,
          net: a.net + b.summary.net,
          discount: a.discount + b.summary.discount,
          orders: a.orders + b.summary.orders,
          cancelled: a.cancelled + b.summary.cancelled,
        }),
        { gross: 0, net: 0, discount: 0, orders: 0, cancelled: 0 }
      ),
      payments: Object.values(REPORT_DATA).reduce((a: any, b: any) => {
        Object.entries(b.payments).forEach(([k, v]: any) => {
          a[k] = (a[k] || 0) + v;
        });
        return a;
      }, {}),
      products: Object.values(REPORT_DATA).flatMap((b: any) => b.products),
    };
  }, [selectedBranch]);

  /* ================= FORECAST ================= */

  const forecast = useMemo(() => {
    const dailyAvg = report.summary.net / 7;
    return Math.round(dailyAvg * 30);
  }, [report]);

  

const generatePdf = async () => {
  try {
    const branchName =
      selectedBranch === "ALL"
        ? "All Branches"
        : BRANCHES.find(b => b.id === selectedBranch)?.name ?? "Branch";

    const html = `
      <html>
        <head>
          <meta charset="UTF-8" />
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              color: #222;
            }

            h1 {
              text-align: center;
              color: #E53935;
              margin-bottom: 4px;
            }

            h2 {
              margin-top: 28px;
              color: #333;
            }

            .branch {
              text-align: center;
              color: #666;
              font-size: 14px;
            }

            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 12px;
            }

            th, td {
              border: 1px solid #ddd;
              padding: 10px;
              text-align: left;
              font-size: 14px;
            }

            th {
              background-color: #f5f5f5;
            }

            .right {
              text-align: right;
            }
          </style>
        </head>

        <body>
          <h1>Business Report</h1>
          <div class="branch">${branchName}</div>

          <!-- ================= SALES ================= -->
          <h2>Sales Summary</h2>
          <table>
            <tr><th>Gross Sales</th><td class="right">₹${report.summary.gross}</td></tr>
            <tr><th>Net Sales</th><td class="right">₹${report.summary.net}</td></tr>
            <tr><th>Discount</th><td class="right">₹${report.summary.discount}</td></tr>
          </table>

          <!-- ================= ORDERS ================= -->
          <h2>Orders</h2>
          <table>
            <tr>
              <th>Completed</th>
              <td class="right">${report.summary.orders - report.summary.cancelled}</td>
            </tr>
            <tr>
              <th>Cancelled</th>
              <td class="right">${report.summary.cancelled}</td>
            </tr>
            <tr>
              <th>Total Orders</th>
              <td class="right">${report.summary.orders}</td>
            </tr>
          </table>

          <!-- ================= PAYMENTS ================= -->
          <h2>Payments</h2>
          <table>
            ${Object.entries(report.payments)
              .map(
                ([mode, amount]: any) =>
                  `<tr>
                    <th>${mode}</th>
                    <td class="right">₹${amount}</td>
                  </tr>`
              )
              .join("")}
          </table>

          <!-- ================= PRODUCTS ================= -->
          <h2>Products</h2>
          <table>
            <tr>
              <th>Product</th>
              <th class="right">Revenue</th>
            </tr>
            ${report.products
              .sort((a: any, b: any) => b.amount - a.amount)
              .map(
                (p: any) =>
                  `<tr>
                    <td>${p.name}</td>
                    <td class="right">₹${p.amount}</td>
                  </tr>`
              )
              .join("")}
          </table>

        </body>
      </html>
    `;

    const { uri } = await Print.printToFileAsync({
      html,
      base64: false,
    });

    await Sharing.shareAsync(uri);
  } catch (err) {
    console.error("PDF generation failed", err);
  }
};

  /* ================= UI ================= */

  return (
    <View style={styles.safe}>
        {/* STATUS BAR */}
<StatusBar style="light" backgroundColor={PRIMARY} />

{/* TOOLBAR */}
<View style={styles.appBar}>
  <TouchableOpacity onPress={() => router.back()}>
    <MaterialCommunityIcons
      name="arrow-left"
      size={26}
      color="#FFFFFF"
    />
  </TouchableOpacity>

  <Text style={styles.appBarTitle}>Reports</Text>

  <TouchableOpacity
    onPress={generatePdf}
    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
  >
    <MaterialCommunityIcons
      name="download"
      size={24}
      color="#FFFFFF"
    />
  </TouchableOpacity>

          
          </View>

      <ScrollView contentContainerStyle={styles.container}>

        
        {/* BRANCH DROPDOWN */}
        <View style={styles.branchWrap}>
          <TouchableOpacity
            style={styles.branchSelector}
            onPress={() => setShowBranch(!showBranch)}
          >
            <Text style={styles.branchText}>
              {selectedBranch === "ALL"
                ? "All Branches"
                : BRANCHES.find(b => b.id === selectedBranch)?.name}
            </Text>
            <MaterialCommunityIcons
              name={showBranch ? "chevron-up" : "chevron-down"}
              size={22}
            />
          </TouchableOpacity>

          {showBranch && (
            <View style={styles.branchDropdown}>
              <TouchableOpacity
                style={styles.branchItem}
                onPress={() => {
                  setSelectedBranch("ALL");
                  setShowBranch(false);
                }}
              >
                <Text>All Branches</Text>
              </TouchableOpacity>

              {BRANCHES.map(b => (
                <TouchableOpacity
                  key={b.id}
                  style={styles.branchItem}
                  onPress={() => {
                    setSelectedBranch(b.id);
                    setShowBranch(false);
                  }}
                >
                  <Text>{b.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* TABS */}
        <View style={styles.tabContainer}>
          {TABS.map(tab => {
            const active = activeTab === tab;
            return (
              <TouchableOpacity
                key={tab}
                style={[styles.tabPill, active && styles.tabPillActive]}
                onPress={() => setActiveTab(tab)}
              >
                <Text style={[styles.tabText, active && styles.tabTextActive]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* CONTENT */}
        {activeTab === "SALES" && <SalesDonutChart lines={report.salesLines} />}
        {activeTab === "ORDERS" && <KeyValueCard title="Orders" data={{
          Completed: report.summary.orders - report.summary.cancelled,
          Cancelled: report.summary.cancelled,
        }} />}
        {activeTab === "PAYMENTS" && <PaymentLineChart title="Payments" data={report.payments} />}
        {activeTab === "PRODUCTS" && <ProductsCard data={report.products} />}

        {/* FORECAST */}
        <View style={styles.forecastCard}>
          <Text style={styles.forecastTitle}>Monthly Forecast</Text>
          <Text style={styles.forecastAmount}>₹{forecast}</Text>
          <Text style={styles.forecastSub}>Based on last 7 days average</Text>
        </View>
      </ScrollView>
  </View>
  );
}

/* ================= COMPONENTS ================= */
const SalesDonutChart = ({ lines }: any) => {
  const totals = lines.map((l: any) => ({
    id: l.id,
    color: l.color,
    value: l.data.reduce((s: number, d: any) => s + d.value, 0),
  }));

  const totalValue = totals.reduce((s: number, t: any) => s + t.value, 0);
  const isSingle = totals.length === 1;

  if (totalValue === 0) {
    return (
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Weekly Sales</Text>
        <Text style={{ textAlign: "center", color: "#777" }}>
          No data available
        </Text>
      </View>
    );
  }

  const size = 220;
  const strokeWidth = 28;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;

  let startAngle = 0;

  const polar = (angle: number) => {
    const rad = ((angle - 90) * Math.PI) / 180;
    return {
      x: center + radius * Math.cos(rad),
      y: center + radius * Math.sin(rad),
    };
  };

  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Weekly Sales</Text>

      <View style={{ alignItems: "center" }}>
        <Svg width={size} height={size}>
          {/* ✅ SINGLE BRANCH → FULL RING */}
          {isSingle ? (
            <Circle
              cx={center}
              cy={center}
              r={radius}
              stroke={totals[0].color}
              strokeWidth={strokeWidth}
              fill="none"
            />
          ) : (
            /* ✅ MULTI BRANCH → DONUT */
            totals.map(t => {
              const angle = (t.value / totalValue) * 360;
              const start = polar(startAngle);
              startAngle += angle;
              const end = polar(startAngle);
              const largeArc = angle > 180 ? 1 : 0;

              return (
                <Path
                  key={t.id}
                  d={`
                    M ${start.x} ${start.y}
                    A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y}
                  `}
                  stroke={t.color}
                  strokeWidth={strokeWidth}
                  fill="none"
                  strokeLinecap="round"
                />
              );
            })
          )}

          {/* CENTER VALUE */}
          <SvgText
            x={center-12}
            y={center - 4}
            fontSize="16"
            fontWeight="900"
            textAnchor="middle"
          >
            ₹   {totalValue}
          </SvgText>

          <SvgText
            x={center}
            y={center + 18}
            fontSize="12"
            fill="#777"
            textAnchor="middle"
          >
            {isSingle ? "Branch Sales" : "Total Sales"}
          </SvgText>
        </Svg>

        {/* ✅ LEGEND (only for ALL branches) */}
        {!isSingle && (
          <View style={{ marginTop: 12 }}>
            {totals.map(t => (
              <View
                key={t.id}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 6,
                }}
              >
                <View
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: t.color,
                    marginRight: 8,
                  }}
                />
                <Text style={{ fontSize: 13 }}>
                  {t.id} — ₹{t.value} (
                  {Math.round((t.value / totalValue) * 100)}%)
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
};



const KeyValueCard = ({ title, data }: any) => {
  const entries = Object.entries(data);

  const barWidth = 36;
  const barHeight = 22; // 👈 change this value

  const gap = 30;
  const chartHeight = 180;
  const bottomSpace = 40;
  const max = Math.max(...entries.map(([, v]: any) => v), 1);

  const COLORS = [
    "#E53935",
    "#1E88E5",
    "#43A047",
    "#FB8C00",
    "#8E24AA",
    "#00897B",
  ];

  const svgWidth = entries.length * (barWidth + gap) + 40;

  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>{title}</Text>

      {/* Horizontal + Vertical scroll */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <Svg width={svgWidth} height={chartHeight + bottomSpace}>
          {entries.map(([label, value]: any, i: number) => {
            const barHeight = (value / max) * chartHeight;
            const x = 30 + i * (barWidth + gap);
            const y = chartHeight - barHeight;

            return (
              <G key={label}>
                {/* VALUE */}
              <SvgText
                x={x + barWidth + 8}
                y={y + barHeight / 2 + 4} // 👈 vertical center
                fontSize="12"
                fontWeight="800"
                fill="#333"
                textAnchor="start"
              >
               {value}
              </SvgText>
  

                {/* BAR */}
                <Rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  rx={10}
                  fill={COLORS[i % COLORS.length]}
                />

                {/* LABEL */}
                <SvgText
                  x={x + barWidth / 2}
                  y={chartHeight + 18}
                  fontSize="11"
                  fill="#555"
                  textAnchor="middle"
                >
                  {label}
                </SvgText>
              </G>
            );
          })}
        </Svg>
      </ScrollView>
    </View>
  );
};


const PaymentLineChart = ({ data }: any) => {
  const payments = Object.entries(data).map(([label, value]) => ({
    label,
    value,
  }));

  const CHART_HEIGHT = 160;
  const TOP = 30;
  const BOTTOM = 40;
  const STEP = 90;
  const LEFT = 40;

  const max = Math.max(...payments.map(p => p.value), 1);
  const width = payments.length * STEP + LEFT * 2;
  const height = CHART_HEIGHT + TOP + BOTTOM;

  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Payment Trend</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <Svg width={width} height={height}>
          {/* X Axis */}
          <Line
            x1={LEFT - 10}
            y1={TOP + CHART_HEIGHT}
            x2={width}
            y2={TOP + CHART_HEIGHT}
            stroke="#DDD"
          />

          {/* Line */}
          <Polyline
            stroke={PRIMARY}
            strokeWidth={3}
            fill="none"
            points={payments
              .map((p, i) => {
                const x = LEFT + i * STEP;
                const y =
                  TOP +
                  CHART_HEIGHT -
                  (p.value / max) * CHART_HEIGHT;
                return `${x},${y}`;
              })
              .join(" ")}
          />

          {/* Points + Labels */}
          {payments.map((p, i) => {
            const x = LEFT + i * STEP;
            const y =
              TOP +
              CHART_HEIGHT -
              (p.value / max) * CHART_HEIGHT;

            return (
              <G key={p.label}>
                {/* Dot */}
                <Circle cx={x} cy={y} r={5} fill={PRIMARY} />

                {/* Value */}
                <SvgText
                  x={x}
                  y={y - 12}
                  fontSize="12"
                  fontWeight="800"
                  textAnchor="middle"
                >
                  ₹   {p.value}
                </SvgText>

                {/* Label */}
                <SvgText
                  x={x}
                  y={TOP + CHART_HEIGHT + 22}
                  fontSize="12"
                  fill="#666"
                  textAnchor="middle"
                >
                  {p.label}
                </SvgText>
              </G>
            );
          })}
        </Svg>
      </ScrollView>
    </View>
  );
};


const AnimatedRect = Animated.createAnimatedComponent(Rect);

const ProductsCard = ({ data }: any) => {
  /* ---------- SORT (TOP FIRST) ---------- */
  const sorted = useMemo(
    () => [...data].sort((a, b) => b.amount - a.amount),
    [data]
  );

  /* ---------- CHART CONFIG ---------- */
  const BAR_HEIGHT = 16;
  const GAP = 26;
  const MAX_BAR_WIDTH = 260;
  const ROW_HEIGHT = BAR_HEIGHT + GAP;
  const SVG_HEIGHT = sorted.length * ROW_HEIGHT + 20;
  const SVG_WIDTH = 420;

  const max = Math.max(...sorted.map((p: any) => p.amount), 1);

  /* ---------- ANIMATION ---------- */
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    anim.setValue(0);
    Animated.timing(anim, {
      toValue: 1,
      duration: 700,
      useNativeDriver: false,
    }).start();
  }, [sorted]);

  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Top Products</Text>

      {/* 🔽 Vertical scroll */}
      <ScrollView style={{ maxHeight: 260 }}>
        {/* 👉 Horizontal scroll */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <Svg width={SVG_WIDTH} height={SVG_HEIGHT}>
            {sorted.map((p: any, i: number) => {
              const animatedWidth = anim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, (p.amount / max) * MAX_BAR_WIDTH],
              });

              const y = i * ROW_HEIGHT;

              return (
                <G key={p.name} y={y}>
                  {/* PRODUCT NAME */}
                  <SvgText
                    x={0}
                    y={14}
                    fontSize="12"
                    fontWeight="700"
                    fill="#333"
                  >
                    {p.name}
                  </SvgText>

                  {/* BAR BACKGROUND */}
                  <Rect
                    x={0}
                    y={22}
                    width={MAX_BAR_WIDTH}
                    height={BAR_HEIGHT}
                    rx={8}
                    fill="#EEE"
                  />

                  {/* ANIMATED BAR */}
                  <AnimatedRect
                    x={0}
                    y={22}
                    height={BAR_HEIGHT}
                    rx={8}
                    fill={PRIMARY}
                    width={animatedWidth}
                  />

                  {/* VALUE */}
                  <SvgText
                    x={MAX_BAR_WIDTH + 8}
                    y={36}
                    fontSize="12"
                    fontWeight="800"
                    fill="#333"
                  >
                    ₹{p.amount}
                  </SvgText>
                </G>
              );
            })}
          </Svg>
        </ScrollView>
      </ScrollView>
    </View>
  );
};


/* ================= STYLES ================= */

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },

 appBar: {
  backgroundColor: PRIMARY,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  paddingHorizontal: 16,

  paddingTop: Platform.OS === "android"
    ? RNStatusBar.currentHeight
    : 44,

  height: Platform.OS === "android"
    ? 56 + (RNStatusBar.currentHeight || 0)
    : 100,
},

appBarTitle: {
  fontSize: 18,
  fontWeight: "800",
  color: "#FFFFFF",
},


  header: { padding: 16, backgroundColor: "#2E7D32" },
  headerTitle: { fontSize: 22, fontWeight: "900",color:"#FFFF" },
  container: { padding: 16 },

  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },

  sectionTitle: { fontWeight: "800", marginBottom: 8 },

  branchWrap: { marginBottom: 16 },
  branchSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 14,
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#EEE",
  },
  branchText: { fontWeight: "700" },
  branchDropdown: {
    backgroundColor: "#fff",
    borderRadius: 14,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#EEE",
  },
  branchItem: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },

  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#F1F2F6",
    padding: 6,
    borderRadius: 16,
    marginBottom: 16,
  },
  tabPill: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 12,
  },
  tabPillActive: {
    backgroundColor: "#fff",
    elevation: 3,
  },
  tabText: { fontWeight: "700", color: "#999" },
  tabTextActive: { color: PRIMARY },

  forecastCard: {
    backgroundColor: "#E8F5E9",
    padding: 20,
    borderRadius: 20,
  },
  forecastTitle: { fontWeight: "800", color: "#2E7D32" },
  forecastAmount: { fontSize: 32, fontWeight: "900", color: "#2E7D32" },
  forecastSub: { color: "#558B2F", marginTop: 4 },
});
