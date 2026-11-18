import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Text,
  Image,
} from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { router } from "expo-router";

const VendorIllustration = require("../../assets/images/vendor.jpg");

/* 🌿 GREEN THEME */
const COLORS = {
  primary: "#2E7D32",
  background: "#E8F5E9",
  card: "#FFFFFF",
  inputBg: "#F1F8F4",
  textPrimary: "#1B5E20",
  muted: "#777",
};

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
            style={{ width: 110, height: 110 }}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Login to continue</Text>
      </View>

      {/* CARD */}
      <View style={styles.card}>
        {/* EMAIL */}
        <View style={styles.inputBox}>
          <MaterialCommunityIcons
            name="email-outline"
            size={22}
            color={COLORS.muted}
          />
          <TextInput
            placeholder="Email"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
        </View>

        {/* PASSWORD */}
        <View style={styles.inputBox}>
          <MaterialCommunityIcons
            name="lock-outline"
            size={22}
            color={COLORS.muted}
          />
          <TextInput
            placeholder="Password"
            secureTextEntry
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          />
        </View>

        {/* FORGOT PASSWORD */}
        <TouchableOpacity
          style={styles.forgot}
          onPress={() => router.push("/common/forgotpage")}
        >
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </TouchableOpacity>

        {/* LOGIN */}
        <TouchableOpacity
          style={styles.loginBtn}
          onPress={() => router.push("/common/dashboard2")}
        >
          <Text style={styles.loginText}>LOGIN</Text>
        </TouchableOpacity>

        {/* SIGN UP */}
        <View style={styles.signupRow}>
          <Text style={styles.signupText}>Don’t have an account?</Text>
          <TouchableOpacity
            onPress={() => router.push("/common/signup")}
          >
            <Text style={styles.signupLink}> Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.primary },
  header: { paddingTop: 40, paddingBottom: 30, alignItems: "center" },
  avatarCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: COLORS.card,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  title: { fontSize: 26, fontWeight: "700", color: "#fff" },
  subtitle: { fontSize: 14, color: "#C8E6C9" },

 card: {
  flex: 1,
  backgroundColor: COLORS.card,
  borderTopLeftRadius: 40,
  borderTopRightRadius: 40,
  padding: 24,
  marginTop: -20,
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
  input: { flex: 1, marginLeft: 10, fontSize: 15 },

  forgot: {
    alignSelf: "flex-end",
    marginBottom: 18,
  },
  forgotText: {
    color: COLORS.primary,
    fontSize: 13,
  },

  loginBtn: {
    backgroundColor: COLORS.primary,
    height: 52,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  loginText: { color: "#fff", fontSize: 16, fontWeight: "700" },

  signupRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  signupText: { color: COLORS.muted },
  signupLink: { color: COLORS.primary, fontWeight: "600" },
});
