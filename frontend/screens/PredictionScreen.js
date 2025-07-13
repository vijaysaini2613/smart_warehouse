import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { Button } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import { predictDemand } from "../services/api";
import { useNavigation } from "@react-navigation/native";
import { BarChart } from "react-native-chart-kit";
import Slider from "@react-native-community/slider";

const cities = ["Delhi", "Mumbai", "Jaipur", "Lucknow"];
const months = Array.from({ length: 12 }, (_, i) => i + 1);

const PredictionScreen = () => {
  const [city, setCity] = useState("Delhi");
  const [month, setMonth] = useState(1);
  const [loading, setLoading] = useState(false);
  const [predictions, setPredictions] = useState(null);
  const [topN, setTopN] = useState(5);
  const navigation = useNavigation();

  const fetchPrediction = async () => {
    setLoading(true);
    try {
      const data = await predictDemand(city, month);
      // Accept both 'predicted_demand' and 'predictions' keys for flexibility
      setPredictions(data.predicted_demand || data.predictions || {});
    } catch (error) {
      setPredictions({});
    }
    setLoading(false);
  };

  // Sort top N predictions
  const topProducts = predictions
    ? Object.entries(predictions)
        .filter(([, value]) => typeof value === "number" && !isNaN(value))
        .sort((a, b) => b[1] - a[1])
        .slice(0, topN)
    : [];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>📊 Product Demand Prediction</Text>

      <Text style={styles.label}>City</Text>
      <Picker
        selectedValue={city}
        onValueChange={setCity}
        style={styles.picker}
      >
        {cities.map((c) => (
          <Picker.Item key={c} label={c} value={c} />
        ))}
      </Picker>

      <Text style={styles.label}>Month</Text>
      <Picker
        selectedValue={month}
        onValueChange={setMonth}
        style={styles.picker}
      >
        {months.map((m) => (
          <Picker.Item key={m} label={`Month ${m}`} value={m} />
        ))}
      </Picker>

      <Button mode="contained" onPress={fetchPrediction} style={styles.button}>
        Get Prediction
      </Button>

      <Button
        mode="outlined"
        onPress={() => navigation.navigate("Suggestions")}
        style={styles.button}
      >
        Go to Suggestions
      </Button>

      {loading && <ActivityIndicator size="large" style={{ marginTop: 20 }} />}

      {predictions && Object.keys(predictions).length > 0 && (
        <>
          <View style={styles.resultBox}>
            <Text style={styles.resultTitle}>📦 Predicted Units Sold</Text>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={[styles.cell, styles.headerCell]}>Product</Text>
                <Text style={[styles.cell, styles.headerCell]}>
                  Predicted Units
                </Text>
              </View>
              {Object.entries(predictions).map(([item, value]) => (
                <View key={item} style={styles.tableRow}>
                  <Text style={styles.cell}>{item}</Text>
                  <Text style={styles.cell}>{value}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Slider for Top N Products */}
          <View style={styles.sliderBox}>
            <Text style={styles.sliderLabel}>Top {topN} Products in Graph</Text>
            <Slider
              style={{ width: "100%", height: 40 }}
              minimumValue={1}
              maximumValue={20}
              step={1}
              value={topN}
              onValueChange={setTopN}
              minimumTrackTintColor="#007bff"
              maximumTrackTintColor="#999"
            />
          </View>

          <View style={styles.chartBox}>
            <Text style={styles.chartTitle}>
              🔝 Top {topN} Products (Graph)
            </Text>
            <BarChart
              data={{
                labels: topProducts.map(([item]) => item),
                datasets: [{ data: topProducts.map(([, value]) => value) }],
              }}
              width={Dimensions.get("window").width - 40}
              height={220}
              yAxisLabel=""
              chartConfig={{
                backgroundColor: "#fff",
                backgroundGradientFrom: "#f9f9f9",
                backgroundGradientTo: "#eee",
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              }}
              style={{ marginVertical: 16, borderRadius: 8 }}
            />
          </View>
        </>
      )}

      {predictions && Object.keys(predictions).length === 0 && !loading && (
        <Text style={{ textAlign: "center", marginTop: 30, color: "red" }}>
          No prediction data available for this city/month.
        </Text>
      )}
    </ScrollView>
  );
};

export default PredictionScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 100,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginTop: 10,
    fontWeight: "bold",
  },
  picker: {
    backgroundColor: "#eee",
    marginVertical: 10,
  },
  button: {
    marginTop: 20,
  },
  resultBox: {
    marginTop: 30,
    padding: 15,
    backgroundColor: "#f4f4f4",
    borderRadius: 8,
  },
  resultTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  item: {
    fontSize: 16,
    paddingVertical: 2,
  },
  chartBox: {
    marginTop: 20,
    alignItems: "center",
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  sliderBox: {
    marginTop: 20,
    marginBottom: 10,
  },
  sliderLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 6,
  },
  table: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#e0e0e0",
  },
  tableRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  cell: {
    flex: 1,
    padding: 10,
    fontSize: 14,
  },
  headerCell: {
    fontWeight: "bold",
    color: "#333",
  },
});
