import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";

/* 🌿 GREEN THEME */
const PRIMARY = "#2E7D32";
const BG = "#F6FBF7";

/*
  STATUS VALUES:
  PENDING | UNDER_REVIEW | VERIFIED | REJECTED
*/

export default function VendorVerificationScreen() {
  const insets = useSafeAreaInsets(); // ✅ KEY FIX

  const status: "PENDING" | "UNDER_REVIEW" | "VERIFIED" | "REJECTED" =
    "UNDER_REVIEW";

  const STATUS_CONFIG = {
    VERIFIED: {
      icon: "check-decagram",
      color: "#2E7D32",
      bg: "#E8F5E9",
      title: "Verified Vendor",
      desc: "Your documents have been verified successfully.",
    },
    UNDER_REVIEW: {
      icon: "progress-clock",
      color: "#EF6C00",
      bg: "#FFF3E0",
      title: "Under Review",
      desc:
        "Our team is reviewing your documents. This may take up to 24 hours.",
    },
    PENDING: {
      icon: "file-document-outline",
      color: "#0277BD",
      bg: "#E1F5FE",
      title: "Verification Pending",
      desc:
        "Please upload the required documents to start verification.",
    },
    REJECTED: {
      icon: "close-octagon",
      color: "#C62828",
      bg: "#FDECEA",
      title: "Verification Rejected",
      desc:
        "Your documents were rejected. Please re-upload valid documents.",
    },
  };

  const cfg = STATUS_CONFIG[status];

  return (
    <View style={{ flex: 1, backgroundColor: BG }}>
      {/* ✅ STATUS BAR */}
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      {/* ✅ TOOLBAR (NOTCH SAFE) */}
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

        <Text style={styles.toolbarTitle}>Vendor Verification</Text>

        <View style={{ width: 24 }} />
      </View>

      {/* CONTENT */}
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.pageTitle}>🔐 Verification Status</Text>
        <Text style={styles.pageSub}>
          Complete verification to unlock all vendor features
        </Text>

        {/* STATUS CARD */}
        <View style={styles.card}>
          <View style={[styles.iconWrap, { backgroundColor: cfg.bg }]}>
            <MaterialCommunityIcons
              name={cfg.icon as any}
              size={48}
              color={cfg.color}
            />
          </View>

          <Text style={styles.title}>{cfg.title}</Text>
          <Text style={styles.desc}>{cfg.desc}</Text>

          <View style={[styles.badge, { backgroundColor: cfg.bg }]}>
            <Text style={[styles.badgeText, { color: cfg.color }]}>
              {status.replace("_", " ")}
            </Text>
          </View>
        </View>

        {/* STEPS */}
        <View style={styles.stepsCard}>
          <Step done={status !== "PENDING"} label="Upload KYC & FSSAI Documents" />
          <Step done={status === "VERIFIED"} label="Admin Verification" />
          <Step done={status === "VERIFIED"} label="Vendor Approved" />
        </View>

        {/* ACTION */}
        {status !== "VERIFIED" && (
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() =>
              router.push("/profile/EditVendorProfileScreen")
            }
          >
            <MaterialCommunityIcons
              name="file-upload"
              size={20}
              color="#fff"
            />
            <Text style={styles.primaryBtnText}>
              {status === "REJECTED"
                ? "Re-upload Documents"
                : "Upload Documents"}
            </Text>
          </TouchableOpacity>
        )}

        {status === "VERIFIED" && (
          <View style={styles.successBox}>
            <MaterialCommunityIcons
              name="shield-check"
              size={24}
              color="#2E7D32"
            />
            <Text style={styles.successText}>
              You are a verified vendor 🎉
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

/* ===== STEP COMPONENT ===== */

const Step = ({ done, label }: any) => (
  <View style={styles.stepRow}>
    <MaterialCommunityIcons
      name={done ? "check-circle" : "circle-outline"}
      size={20}
      color={done ? "#2E7D32" : "#BBB"}
    />
    <Text style={[styles.stepText, done && { color: "#2E7D32" }]}>
      {label}
    </Text>
  </View>
);

/* ===== STYLES ===== */

const styles = StyleSheet.create({
  toolbar: {
    backgroundColor: PRIMARY,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    justifyContent: "space-between",
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

  pageTitle: {
    fontSize: 22,
    fontWeight: "900",
  },

  pageSub: {
    color: "#777",
    marginBottom: 16,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    marginBottom: 16,
  },

  iconWrap: {
    padding: 16,
    borderRadius: 50,
    marginBottom: 10,
  },

  title: {
    fontSize: 18,
    fontWeight: "900",
  },

  desc: {
    textAlign: "center",
    color: "#666",
    marginTop: 6,
  },

  badge: {
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },

  badgeText: {
    fontSize: 12,
    fontWeight: "800",
  },

  stepsCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },

  stepRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  stepText: {
    marginLeft: 10,
    fontWeight: "700",
    color: "#777",
  },

  primaryBtn: {
    backgroundColor: PRIMARY,
    padding: 16,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },

  primaryBtnText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 15,
  },

  successBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E8F5E9",
    padding: 16,
    borderRadius: 16,
  },

  successText: {
    marginLeft: 8,
    fontWeight: "800",
    color: "#2E7D32",
  },
});
