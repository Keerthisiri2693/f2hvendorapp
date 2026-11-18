import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Platform,
  StatusBar as RNStatusBar,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";

/* 🌿 GREEN THEME */
const PRIMARY = "#2E7D32";
const PRIMARY_DARK = "#1B5E20";
const BG = "#E8F5E9";
const BORDER = "#C8E6C9";
const TEXT_MUTED = "#607D8B";
const LOGOUT_BG = "#E8F5E9";

const THEME_KEY = "APP_THEME";

export default function VendorSettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [orderAlerts, setOrderAlerts] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  /* ================= THEME ================= */

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    const savedTheme = await AsyncStorage.getItem(THEME_KEY);
    if (savedTheme) {
      setDarkMode(savedTheme === "dark");
    }
  };

  const toggleDarkMode = async (value: boolean) => {
    setDarkMode(value);
    await AsyncStorage.setItem(THEME_KEY, value ? "dark" : "light");
  };

  /* ================= LOGOUT ================= */

  const logout = async () => {
    await AsyncStorage.clear();
    router.replace("/common/login1");
  };

  return (
    <View style={{ flex: 1, backgroundColor: BG }}>
      {/* STATUS BAR */}
      <StatusBar style="light" backgroundColor={PRIMARY} />

      {/* HEADER */}
      <View style={styles.toolbar}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.toolbarTitle}>Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>

        {/* BUSINESS */}
        <Section title="Business Settings">
          <SettingItem
            icon="store"
            label="Business Profile"
            onPress={() => router.push("/profile/EditVendorProfileScreen")}
          />
          <SettingItem
            icon="storefront"
            label="Manage Branches"
            onPress={() => router.push("/profile/VendorBranchesScreen")}
          />
          <SettingItem
            icon="shield-check"
            label="Vendor Verification"
            onPress={() => router.push("/profile/VendorVerificationScreen")}
          />
        </Section>

        {/* NOTIFICATIONS */}
        <Section title="Notifications">
          <ToggleItem
            icon="bell"
            label="Enable Notifications"
            value={notifications}
            onChange={setNotifications}
          />
          <ToggleItem
            icon="clipboard-text"
            label="New Order Alerts"
            value={orderAlerts}
            onChange={setOrderAlerts}
          />
        </Section>

        {/* ACCOUNT */}
        <Section title="Account">
          <SettingItem
            icon="lock-reset"
            label="Change Password"
            onPress={() => router.push("/common/settings/changepassword")}
          />

          <SettingItem
            icon="shield-account-outline"
            label="Privacy & Security"
            onPress={() =>
              router.push("/common/settings/privacysecurity")
            }
          />

          <ToggleItem
            icon="theme-light-dark"
            label="Dark Mode"
            value={darkMode}
            onChange={toggleDarkMode}
          />
        </Section>

        {/* SUPPORT */}
        <Section title="Support">
          <SettingItem icon="help-circle" label="Help Center" />
          <SettingItem icon="file-document-outline" label="Terms & Conditions" />
          <SettingItem icon="information-outline" label="About App" />
        </Section>

        {/* LOGOUT */}
        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <MaterialCommunityIcons name="logout" size={20} color={PRIMARY} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

/* ================= COMPONENTS ================= */

const Section = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.card}>{children}</View>
  </View>
);

const SettingItem = ({ icon, label, onPress }) => (
  <TouchableOpacity style={styles.item} onPress={onPress}>
    <View style={styles.itemLeft}>
      <MaterialCommunityIcons name={icon} size={20} color={PRIMARY} />
      <Text style={styles.itemText}>{label}</Text>
    </View>
    <MaterialCommunityIcons name="chevron-right" size={22} color="#999" />
  </TouchableOpacity>
);

const ToggleItem = ({ icon, label, value, onChange }) => (
  <View style={styles.item}>
    <View style={styles.itemLeft}>
      <MaterialCommunityIcons name={icon} size={20} color={PRIMARY} />
      <Text style={styles.itemText}>{label}</Text>
    </View>
    <Switch
      value={value}
      onValueChange={onChange}
      thumbColor={value ? PRIMARY : "#ccc"}
      trackColor={{ true: BORDER, false: "#ddd" }}
    />
  </View>
);

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  toolbar: {
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

  toolbarTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "900",
  },

  container: {
    padding: 16,
    paddingBottom: 40,
  },

  section: {
    marginBottom: 20,
  },

  sectionTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: TEXT_MUTED,
    marginBottom: 8,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: BORDER,
  },

  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },

  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  itemText: {
    marginLeft: 12,
    fontWeight: "700",
    fontSize: 14,
    color: PRIMARY_DARK,
  },

  logoutBtn: {
    marginTop: 20,
    backgroundColor: LOGOUT_BG,
    padding: 16,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: BORDER,
  },

  logoutText: {
    fontWeight: "900",
    color: PRIMARY,
    fontSize: 15,
  },
});
