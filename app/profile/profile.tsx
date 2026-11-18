import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Switch,
  StatusBar,
  Platform,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";

/* 🌿 GREEN THEME */
const PRIMARY = "#2E7D32";
const BG = "#F6FBF7";

export default function VendorProfileScreen() {
  const insets = useSafeAreaInsets(); // 🔑 KEY FIX
  const [isOpen, setIsOpen] = useState(true);
  const [imageError, setImageError] = useState(false);

  const verificationStatus: "VERIFIED" | "PENDING" | "REJECTED" = "PENDING";

  const statusColor =
    verificationStatus === "VERIFIED"
      ? "#2E7D32"
      : verificationStatus === "PENDING"
      ? "#FB8C00"
      : "#D32F2F";

  return (
    <View style={{ flex: 1, backgroundColor: BG }}>
      {/* ✅ STATUS BAR */}
      <StatusBar
        barStyle="light-content"
        backgroundColor={PRIMARY}
        translucent
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {/* ✅ COVER (EXTENDS INTO NOTCH) */}
        <View
          style={[
            styles.cover,
            {
              height: 120 + insets.top,
              paddingTop: insets.top,
            },
          ]}
        />

        {/* PROFILE HEADER */}
        <View style={styles.profileHeader}>
          <Image
            source={
              imageError
                ? require("../../assets/images/logo1.png")
                : {
                    uri: "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png",
                  }
            }
            style={styles.logo}
            onError={() => setImageError(true)}
          />

          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={styles.shopName}>Fresh Meat Shop</Text>

              {verificationStatus === "VERIFIED" && (
                <MaterialCommunityIcons
                  name="check-decagram"
                  size={18}
                  color="#2E7D32"
                  style={{ marginLeft: 6 }}
                />
              )}
              {verificationStatus === "PENDING" && (
                <MaterialCommunityIcons
                  name="clock-outline"
                  size={18}
                  color="#FB8C00"
                  style={{ marginLeft: 6 }}
                />
              )}
              {verificationStatus === "REJECTED" && (
                <MaterialCommunityIcons
                  name="close-circle"
                  size={18}
                  color="#D32F2F"
                  style={{ marginLeft: 6 }}
                />
              )}
            </View>

            <Text style={[styles.verifyText, { color: statusColor }]}>
              {verificationStatus === "VERIFIED"
                ? "Verified Vendor"
                : verificationStatus === "PENDING"
                ? "Verification Pending"
                : "Verification Rejected"}
            </Text>

            <Text style={styles.category}>Chicken · Mutton · Fish</Text>
            <Text style={styles.rating}>⭐ 4.6 (320 reviews)</Text>
          </View>
        </View>

        {/* VERIFY BUTTON */}
        {verificationStatus !== "VERIFIED" && (
          <TouchableOpacity
            style={styles.verifyBtn}
            onPress={() =>
              router.push("/profile/VendorVerificationScreen")
            }
          >
            <MaterialCommunityIcons
              name="shield-check"
              size={20}
              color="#fff"
            />
            <Text style={styles.verifyBtnText}>
              Complete Verification
            </Text>
          </TouchableOpacity>
        )}

        {/* SHOP STATUS */}
      <View style={styles.statusCard}>
  <Text style={styles.statusTitle}>Shop Status</Text>

  <View style={styles.statusRight}>
    <Text style={styles.statusText}>
      {isOpen ? "Open" : "Closed"}
    </Text>

    <Switch
      value={isOpen}
      onValueChange={setIsOpen}
      thumbColor="#fff"
      trackColor={{ false: "#CCC", true: PRIMARY }}
    />
  </View>
</View>


        {/* INFO */}
        <InfoCard icon="account" title="Owner" value="Ramesh Kumar" />
        <InfoCard icon="phone" title="Contact" value="+91 98765 43210" />
        <InfoCard icon="email" title="Email" value="vendor@gmail.com" />
        <InfoCard icon="map-marker" title="Address" value="Velachery, Chennai" />

        {/* BRANCH BUTTON */}
        <TouchableOpacity
          style={styles.branchBtn}
          onPress={() =>
            router.push("/profile/VendorBranchesScreen")
          }
        >
          <MaterialCommunityIcons
            name="storefront"
            size={20}
            color={PRIMARY}
          />
          <Text style={styles.branchBtnText}>View Branches</Text>
        </TouchableOpacity>

        {/* EDIT */}
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() =>
            router.push("/profile/EditVendorProfileScreen")
          }
        >
          <MaterialCommunityIcons
            name="pencil"
            size={18}
            color="#fff"
          />
          <Text style={styles.editText}>Edit Profile</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

/* INFO CARD */
const InfoCard = ({ icon, title, value }: any) => (
  <View style={styles.card}>
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <MaterialCommunityIcons name={icon} size={22} color={PRIMARY} />
      <Text style={styles.cardTitle}>{title}</Text>
    </View>
    <Text style={styles.cardValue}>{value}</Text>
  </View>
);

/* STYLES */
const styles = StyleSheet.create({
  cover: {
    backgroundColor: PRIMARY,
  },

  profileHeader: {
    flexDirection: "row",
    backgroundColor: "#fff",
    margin: 16,
    marginTop: -40,
    padding: 16,
    borderRadius: 18,
    elevation: 4,
  },

  logo: {
    width: 72,
    height: 72,
    borderRadius: 36,
    marginRight: 14,
    backgroundColor: "#EEE",
  },

  shopName: { fontSize: 18, fontWeight: "900" },
  verifyText: { fontSize: 12, fontWeight: "700", marginTop: 2 },
  category: { color: "#777", marginTop: 2 },
  rating: { marginTop: 4, fontWeight: "600" },

  verifyBtn: {
    marginHorizontal: 16,
    backgroundColor: "#FB8C00",
    padding: 14,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },

  verifyBtnText: { color: "#fff", fontWeight: "800" },

 statusCard: {
  flexDirection: "row",           // ✅ SAME LINE
  alignItems: "center",
  justifyContent: "space-between",
  padding: 14,
  backgroundColor: "#fff",
  borderRadius: 14,
  marginBottom: 12,
},

statusTitle: {
  fontWeight: "700",
  fontSize: 15,
},

statusRight: {
  flexDirection: "row",          
  alignItems: "center",
},

statusText: {
  marginRight: 8,
  fontWeight: "600",
},


  card: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 16,
  },

  cardTitle: { marginLeft: 8, fontWeight: "700" },
  cardValue: { marginTop: 6, color: "#555" },

  branchBtn: {
    marginHorizontal: 16,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: PRIMARY,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },

  branchBtnText: { color: PRIMARY, fontWeight: "800" },

  editBtn: {
    margin: 20,
    backgroundColor: PRIMARY,
    padding: 14,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },

  editText: { color: "#fff", fontWeight: "800" },
});
