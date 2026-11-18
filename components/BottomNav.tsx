import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter, usePathname } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets(); // ⭐ IMPORTANT

  const go = (route: string) => {
    if (pathname !== route) {
      router.push(route);
    }
  };

  return (
    <View
      style={[
        styles.nav,
        {
          bottom: insets.bottom + 12, // ⭐ SAFE FLOATING
        },
      ]}
    >
      <NavItem
        icon="home-outline"
        label="Home"
        active={pathname === "/" || pathname === "/dashboard"}
        onPress={() => go("/")}
      />

      <NavItem
        icon="clipboard-list-outline"
        label="Orders"
        active={pathname === "/order/order"}
        onPress={() => go("/order/order")}
      />

      <NavItem
        icon="cart-outline"
        label="Cart"
        active={pathname === "/cart/cart"}
        onPress={() => go("/cart/cart")}
      />

      <NavItem
        icon="account-outline"
        label="Profile"
        active={pathname === "/profile/profile"}
        onPress={() => go("/profile/profile")}
      />
    </View>
  );
}

function NavItem({
  icon,
  label,
  active,
  onPress,
}: {
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <MaterialCommunityIcons
        name={icon}
        size={26}
        color={active ? "#ff4d6d" : "#9E9E9E"}
      />
      <Text style={[styles.label, active && styles.activeLabel]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  nav: {
    position: "absolute",
    left: 16,
    right: 16,
    height: 64,

    backgroundColor: "#FFFFFF",
    borderRadius: 22,

    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",

    elevation: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },

  item: {
    alignItems: "center",
    justifyContent: "center",
  },

  label: {
    fontSize: 11,
    color: "#9E9E9E",
    marginTop: 2,
  },

  activeLabel: {
    color: "#ff4d6d",
    fontWeight: "700",
  },
});
