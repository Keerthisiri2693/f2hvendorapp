import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";

/* 🌿 GREEN THEME */
const PRIMARY = "#2E7D32";
const BG = "#F6FBF7";

export default function EditVendorProfileScreen() {
  const insets = useSafeAreaInsets(); // ✅ KEY FIX

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [shopName, setShopName] = useState("Fresh Meat Shop");
  const [owner, setOwner] = useState("Ramesh Kumar");
  const [phone, setPhone] = useState("9876543210");
  const [address, setAddress] = useState("Velachery, Chennai");
  const [openTime, setOpenTime] = useState("09:00 AM");
  const [closeTime, setCloseTime] = useState("09:00 PM");

  const saveProfile = () => {
    if (!shopName || !owner || !phone) {
      Alert.alert("Validation", "Required fields missing");
      return;
    }

    Alert.alert("Success", "Profile updated");
    router.back();
  };

  return (
    <View style={{ flex: 1, backgroundColor: BG }}>
      {/* ✅ STATUS BAR */}
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      {/* ✅ HEADER (NOTCH SAFE) */}
      <View
        style={[
          styles.header,
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
            color={PRIMARY}
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Edit Vendor Profile</Text>

        <View style={{ width: 24 }} />
      </View>

      {/* ✅ CONTENT */}
      <ScrollView contentContainerStyle={styles.container}>
        {/* PROFILE IMAGE */}
        <View style={styles.imageSection}>
          <Image
            source={
              profileImage
                ? { uri: profileImage }
                : require("../../assets/images/logo1.png")
            }
            style={styles.avatar}
          />
        </View>

        {/* BASIC INFO */}
        <Card title="Basic Information">
          <Input label="Shop Name" value={shopName} onChange={setShopName} />
          <Input label="Owner" value={owner} onChange={setOwner} />
          <Input label="Phone" value={phone} onChange={setPhone} />
          <Input label="Address" value={address} onChange={setAddress} />
          <Input label="Open Time" value={openTime} onChange={setOpenTime} />
          <Input label="Close Time" value={closeTime} onChange={setCloseTime} />
        </Card>

        {/* SAVE */}
        <TouchableOpacity style={styles.saveBtn} onPress={saveProfile}>
          <Text style={styles.saveText}>Save Profile</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

/* ================= SMALL COMPONENTS ================= */

const Card = ({ title, children }: any) => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>{title}</Text>
    {children}
  </View>
);

const Input = ({ label, value, onChange }: any) => (
  <View style={{ marginBottom: 12 }}>
    <Text style={styles.label}>{label}</Text>
    <TextInput value={value} onChangeText={onChange} style={styles.input} />
  </View>
);

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  header: {
    backgroundColor: PRIMARY,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    justifyContent: "space-between",
    elevation: 4,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#FFFF",
  },

  container: {
    padding: 16,
    paddingBottom: 40,
  },

  imageSection: {
    alignItems: "center",
    marginVertical: 20,
  },

  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#EEE",
  },

  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },

  cardTitle: {
    fontWeight: "800",
    marginBottom: 12,
    color: PRIMARY,
  },

  label: {
    fontWeight: "700",
    marginBottom: 6,
  },

  input: {
    backgroundColor: "#F4F6F4",
    padding: 12,
    borderRadius: 12,
  },

  saveBtn: {
    backgroundColor: PRIMARY,
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 20,
  },

  saveText: {
    color: "#fff",
    fontWeight: "900",
  },
});
