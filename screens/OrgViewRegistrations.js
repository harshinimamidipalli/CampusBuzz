import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  Dimensions,
} from "react-native";
import { supabase } from "../lib/supabase";
import { PieChart } from "react-native-chart-kit";

export default function OrgViewRegistrations({ route }) {
  const { event } = route.params;
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [yearStats, setYearStats] = useState([]);
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const { data, error } = await supabase
        .from("registrations")
        .select(`
          id,
          year,
          branch,
          expectations,
          profiles (
            full_name
          )
        `)
        .eq("event_id", event.id);

      if (error) throw error;

      setRegistrations(data || []);

      // Count per year safely
      const counts = [0, 0, 0, 0];
      data?.forEach((reg) => {
        const yr = parseInt(reg.year);
        if (yr >= 1 && yr <= 4) counts[yr - 1]++;
      });

      const yearData = [
        { name: "1st Year", count: counts[0], color: "#FF9999" },
        { name: "2nd Year", count: counts[1], color: "#FF7043" },
        { name: "3rd Year", count: counts[2], color: "#FFB74D" },
        { name: "4th Year", count: counts[3], color: "#FFCC80" },
      ].filter((item) => item.count > 0);

      setYearStats(yearData);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="tomato" />
      </View>
    );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>
        Registered Participants –{" "}
        <Text style={styles.count}>{registrations.length}</Text>
      </Text>

      {registrations.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.noDataText}>No participants have registered yet.</Text>
        </View>
      ) : (
        <FlatList
          data={registrations}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.name}>
                👤 {item.profiles?.full_name || "Unnamed Participant"}
              </Text>
              <Text style={styles.detail}>🏫 Branch: {item.branch || "N/A"}</Text>
              <Text style={styles.detail}>🎓 Year: {item.year || "N/A"}</Text>
              {item.expectations ? (
                <Text style={styles.expectation}>💬 “{item.expectations.trim()}”</Text>
              ) : (
                <Text style={styles.expectationNone}>💬 No expectations shared.</Text>
              )}
            </View>
          )}
        />
      )}

      {/* Show Stats Button (Always Visible) */}
      <TouchableOpacity style={styles.statsButton} onPress={() => setShowStats(true)}>
        <Text style={styles.statsButtonText}>Show Stats</Text>
      </TouchableOpacity>

      {/* Stats Modal */}
      <Modal
        visible={showStats}
        transparent
        animationType="fade"
        onRequestClose={() => setShowStats(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.statsCard}>
            <Text style={styles.chartTitle}>📊 Year-wise Registration Stats</Text>

            {yearStats.length > 0 ? (
              <>
                {/* Centered Pie Chart */}
                <View style={styles.chartWrapper}>
                  <PieChart
                    data={yearStats.map((item) => ({
                      name: item.name,
                      population: item.count,
                      color: item.color,
                      legendFontColor: "#333",
                      legendFontSize: 13,
                    }))}
                    width={Dimensions.get("window").width * 0.6}
                    height={220}
                    chartConfig={{
                      backgroundColor: "white",
                      backgroundGradientFrom: "white",
                      backgroundGradientTo: "white",
                      color: () => "tomato",
                      labelColor: () => "#333",
                    }}
                    accessor="population"
                    backgroundColor="transparent"
                    hasLegend={false}
                    paddingLeft="35"
                    center={[0, 0]}
                    absolute
                  />
                </View>

                {/* Custom Legend */}
                <View style={styles.legendContainer}>
                  {yearStats.map((item) => (
                    <View key={item.name} style={styles.legendItem}>
                      <View style={[styles.colorBox, { backgroundColor: item.color }]} />
                      <Text style={styles.legendText}>
                        {item.name} ({item.count})
                      </Text>
                    </View>
                  ))}
                </View>
              </>
            ) : (
              <View style={styles.noDataBox}>
                <Text style={styles.noDataTextInModal}>
                  📭 No registration data available yet.
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowStats(false)}
            >
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ✅ Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
    paddingTop: 70,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "tomato",
    textAlign: "center",
    marginBottom: 15,
  },
  count: {
    color: "tomato",
  },
  card: {
    backgroundColor: "#fff6f4",
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ffd6c9",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  detail: {
    fontSize: 15,
    color: "#555",
    marginVertical: 2,
  },
  expectation: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#444",
    marginTop: 8,
  },
  expectationNone: {
    fontSize: 14,
    color: "#999",
    marginTop: 8,
    fontStyle: "italic",
  },
  statsButton: {
    backgroundColor: "tomato",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 15,
  },
  statsButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  statsCard: {
    backgroundColor: "white",
    borderRadius: 20,
    paddingVertical: 25,
    paddingHorizontal: 20,
    width: "85%",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 6,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "tomato",
    marginBottom: 15,
  },
  chartWrapper: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 15,
  },
  legendContainer: {
    marginTop: 10,
    width: "100%",
    alignItems: "flex-start",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  colorBox: {
    width: 16,
    height: 16,
    borderRadius: 4,
    marginRight: 8,
  },
  legendText: {
    fontSize: 15,
    color: "#333",
  },
  noDataBox: {
    alignItems: "center",
    justifyContent: "center",
    height: 220,
  },
  noDataTextInModal: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    fontStyle: "italic",
  },
  closeButton: {
    backgroundColor: "tomato",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 30,
    marginTop: 15,
  },
  closeText: {
    color: "white",
    fontWeight: "bold",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noDataText: {
    fontSize: 16,
    color: "#666",
  },
});
