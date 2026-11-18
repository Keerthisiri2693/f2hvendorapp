import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Platform,
  StatusBar as RNStatusBar,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";

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

export default function AddDeliveryPartner() {
  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      {/* STATUS BAR */}
      <StatusBar style="dark" backgroundColor={COLORS.bg} />

      {/* TOOLBAR */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons
            name="arrow-left"
            size={24}
            color={COLORS.primary}
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Add Delivery Partner</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* PROFILE IMAGE */}
        <View style={styles.profileSection}>
          <Image
            source={{ uri: "https://i.pravatar.cc/150?img=15" }}
            style={styles.avatar}
          />

          <View style={styles.cameraRow}>
            <TouchableOpacity style={styles.cameraBtn}>
              <MaterialCommunityIcons
                name="camera"
                size={18}
                color="#fff"
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.profileHint}>
            Upload partner photo
          </Text>
        </View>

        {/* FORM */}
        <Input label="Full Name" placeholder="Enter full name" />
        <Input
          label="Phone Number"
          placeholder="Enter mobile number"
          keyboardType="phone-pad"
        />
        <Input label="Vehicle Type" placeholder="Bike / Cycle / Car" />
        <Input label="Vehicle Number" placeholder="TN 10 AB 2345" />
        <Input
          label="Driving License Number"
          placeholder="Enter license number"
        />

        {/* UPLOAD LICENSE */}
        <View style={styles.uploadBox}>
          <View style={styles.uploadRow}>
            <MaterialCommunityIcons
              name="file-upload-outline"
              size={22}
              color={COLORS.primary}
            />

            <View style={{ flex: 1 }}>
              <Text style={styles.uploadTitle}>
                Upload Driving License
              </Text>
              <Text style={styles.uploadSub}>
                JPG / PNG / PDF
              </Text>
            </View>

            <TouchableOpacity style={styles.uploadBtn}>
              <Text style={styles.uploadBtnText}>Upload</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* SAVE BUTTON */}
        <TouchableOpacity style={styles.saveBtn}>
          <Text style={styles.saveText}>Save Partner</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

/* ---------------- INPUT COMPONENT ---------------- */

const Input = ({ label, ...props }: any) => (
  <View style={styles.inputWrap}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={styles.input}
      placeholderTextColor="#78909C"
      {...props}
    />
  </View>
);

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  /* TOOLBAR */
  header: {
    backgroundColor: COLORS.bg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop:
      Platform.OS === "android"
        ? RNStatusBar.currentHeight
        : 44,
    height:
      Platform.OS === "android"
        ? 56 + (RNStatusBar.currentHeight || 0)
        : 100,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textDark,
  },

  container: {
    padding: 16,
    paddingBottom: 40,
  },

  /* PROFILE */
  profileSection: {
    alignItems: "center",
    marginVertical: 24,
  },

  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },

  cameraRow: {
    width: 96,
    alignItems: "flex-end",
    marginTop: -12,
  },

  cameraBtn: {
    backgroundColor: COLORS.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
  },

  profileHint: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 8,
  },

  /* INPUTS */
  inputWrap: {
    marginBottom: 14,
  },

  label: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 6,
    color: COLORS.textDark,
  },

  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: "#111",
    backgroundColor: COLORS.card,
  },

  /* LICENSE UPLOAD */
  uploadBox: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    padding: 14,
    marginTop: 10,
    backgroundColor: COLORS.card,
  },

  uploadRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  uploadTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textDark,
  },

  uploadSub: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },

  uploadBtn: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 10,
  },

  uploadBtnText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },

  /* SAVE BUTTON */
  saveBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 24,
  },

  saveText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
});
