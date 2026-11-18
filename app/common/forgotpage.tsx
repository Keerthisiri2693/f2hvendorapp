import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
} from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { router } from "expo-router";

/* 🌿 IMAGE (PNG/JPG MUST USE Image) */
const VendorIllustration = require("../../assets/images/vendor.jpg");

/* 🌿 GREEN THEME */
const COLORS = {
  primary: "#2E7D32",
  primaryDark: "#1B5E20",
  background: "#E8F5E9",
  card: "#FFFFFF",
  inputBg: "#F1F8F4",
  textPrimary: "#1B5E20",
  textSecondary: "#4CAF50",
  muted: "#777",
};

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleReset = () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email");
      return;
    }

    Alert.alert(
      "Success",
      "Password reset link has been sent to your email"
    );
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.avatarCircle}>
          <Image
            source={VendorIllustration}
            style={{ width: 100, height: 100 }}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.title}>Forgot Password</Text>
        <Text style={styles.subtitle}>
          Reset your password securely
        </Text>
      </View>

      {/* CARD */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Reset Password</Text>
        <Text style={styles.cardSubtitle}>
          Enter your registered email address
        </Text>

        {/* EMAIL */}
        <View style={styles.inputBox}>
          <MaterialCommunityIcons
            name="email-outline"
            size={22}
            color={COLORS.muted}
          />
          <TextInput
            placeholder="Email"
            placeholderTextColor={COLORS.muted}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        {/* RESET BUTTON */}
        <TouchableOpacity
          style={styles.loginBtn}
          onPress={handleReset}
        >
          <Text style={styles.loginText}>SEND RESET LINK</Text>
        </TouchableOpacity>

        {/* BACK TO LOGIN */}
        <View style={styles.signupRow}>
          <Text style={styles.signupText}>
            Remember your password?
          </Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.signupLink}> Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },

  header: {
    paddingTop:
      Platform.OS === "android"
        ? StatusBar.currentHeight ?? 24
        : 44,
    paddingBottom: 30,
    alignItems: "center",
  },

  avatarCircle: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: COLORS.card,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#fff",
    marginTop: 6,
  },

  subtitle: {
    fontSize: 14,
    color: "#C8E6C9",
    marginTop: 4,
  },

  card: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 24,
    marginTop: -20,
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.textPrimary,
    textAlign: "center",
  },

  cardSubtitle: {
    fontSize: 14,
    color: COLORS.muted,
    textAlign: "center",
    marginBottom: 20,
  },

  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.inputBg,
    borderRadius: 14,
    paddingHorizontal: 14,
    marginBottom: 16,
    height: 52,
  },

  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: COLORS.textPrimary,
  },

  loginBtn: {
    backgroundColor: COLORS.primary,
    height: 52,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 6,
  },

  loginText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  signupRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 22,
  },

  signupText: {
    color: COLORS.muted,
  },

  signupLink: {
    color: COLORS.primary,
    fontWeight: "600",
  },
});
