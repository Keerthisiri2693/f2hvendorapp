import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
  StatusBar as RNStatusBar,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";

/* 🌿 GREEN THEME */
const PRIMARY = "#2E7D32";
const PRIMARY_DARK = "#1B5E20";
const BG = "#E8F5E9";
const BORDER = "#C8E6C9";

export default function ChangePasswordScreen() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Error", "All fields are required");
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      await new Promise((res) => setTimeout(res, 1500));

      Alert.alert("Success", "Password changed successfully", [
        { text: "OK", onPress: () => router.back() },
      ]);

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      Alert.alert("Error", "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: BG }}>
      {/* STATUS BAR */}
      <StatusBar style="light" backgroundColor={PRIMARY} />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons
            name="arrow-left"
            size={24}
            color="#fff"
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Change Password</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* CONTENT */}
      <View style={styles.container}>
        <Input
          label="Current Password"
          value={currentPassword}
          onChangeText={setCurrentPassword}
          secure
        />

        <Input
          label="New Password"
          value={newPassword}
          onChangeText={setNewPassword}
          secure
        />

        <Input
          label="Confirm New Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secure
        />

        <TouchableOpacity
          style={styles.btn}
          onPress={handleChangePassword}
          disabled={loading}
        >
          <Text style={styles.btnText}>
            {loading ? "Updating..." : "Update Password"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* ================= INPUT ================= */

const Input = ({ label, value, onChangeText, secure }: any) => (
  <View style={styles.inputBox}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secure}
      style={styles.input}
      placeholder={`Enter ${label.toLowerCase()}`}
      placeholderTextColor="#78909C"
    />
  </View>
);

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  header: {
    backgroundColor: PRIMARY,
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
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#fff",
  },

  container: {
    flex: 1,
    padding: 16,
    backgroundColor: BG,
  },

  inputBox: {
    marginBottom: 16,
  },

  label: {
    fontWeight: "700",
    marginBottom: 6,
    color: PRIMARY_DARK,
  },

  input: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    borderWidth: 1,
    borderColor: BORDER,
    color: "#263238",
  },

  btn: {
    backgroundColor: PRIMARY,
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 10,
    elevation: 3,
  },

  btnText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 15,
    letterSpacing: 0.4,
  },
});
