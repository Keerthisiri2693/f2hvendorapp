import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useOffers } from "../context/offersContext";

export default function ViewOffers() {
  const { offers, deleteOffer } = useOffers();

  const handleDelete = (id: string) => {
    Alert.alert(
      "Delete Offer",
      "Are you sure you want to delete this offer?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteOffer(id),
        },
      ]
    );
  };

  const getStatus = (offer: any) => {
    const today = new Date();
    const end = new Date(offer.endDate);

    if (end < today) return "EXPIRED";
    return offer.isActive ? "ACTIVE" : "INACTIVE";
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={26} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>All Offers</Text>

        <TouchableOpacity onPress={() => router.push("/admin/create-offer")}>
          <MaterialCommunityIcons name="plus" size={28} />
        </TouchableOpacity>
      </View>

      {/* EMPTY STATE */}
      {offers.length === 0 ? (
        <View style={styles.empty}>
          <MaterialCommunityIcons
            name="tag-outline"
            size={60}
            color="#ccc"
          />
          <Text style={styles.emptyText}>No offers created yet</Text>

          <TouchableOpacity
            style={styles.createBtn}
            onPress={() => router.push("/admin/create-offer")}
          >
            <Text style={styles.createText}>Create Offer</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={offers}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => {
            const status = getStatus(item);

            return (
              <View style={styles.card}>
                <View style={styles.row}>
                  <Text style={styles.title}>{item.title}</Text>

                  <Text
                    style={[
                      styles.status,
                      status === "ACTIVE" && styles.active,
                      status === "EXPIRED" && styles.expired,
                    ]}
                  >
                    {status}
                  </Text>
                </View>

                <Text style={styles.code}>{item.code}</Text>
                <Text style={styles.type}>{item.offerType}</Text>

                <Text style={styles.date}>
                  {new Date(item.startDate).toDateString()} –{" "}
                  {new Date(item.endDate).toDateString()}
                </Text>

                <View style={styles.actions}>
                  <TouchableOpacity
                    onPress={() => handleDelete(item.id)}
                  >
                    <MaterialCommunityIcons
                      name="delete"
                      size={22}
                      color="#E53935"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
  },

  card: {
    backgroundColor: "#F9F9F9",
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
  },
  code: {
    marginTop: 6,
    fontWeight: "600",
    color: "#E53935",
  },
  type: {
    marginTop: 4,
    color: "#555",
    fontWeight: "600",
  },
  date: {
    marginTop: 6,
    color: "#777",
    fontSize: 12,
  },

  status: {
    fontSize: 12,
    fontWeight: "700",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  active: {
    backgroundColor: "#E8F5E9",
    color: "#2E7D32",
  },
  expired: {
    backgroundColor: "#FDECEA",
    color: "#C62828",
  },

  actions: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "flex-end",
  },

  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: "#777",
  },
  createBtn: {
    marginTop: 16,
    backgroundColor: "#E53935",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  createText: {
    color: "#fff",
    fontWeight: "700",
  },
});
