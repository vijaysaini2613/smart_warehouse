import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TextInput,
  Dimensions,
} from "react-native";
import { Button } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import { suggestCabinetItems } from "../services/api";
import { useNavigation } from "@react-navigation/native";
import { BarChart } from "react-native-chart-kit";
import axios from "axios";

const BASE_URL = "http://10.102.142.75:8000"; // or your backend IP

const SuggestionScreen = () => {
  const [product, setProduct] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [search, setSearch] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    axios.get(`${BASE_URL}/suggest/products`).then((res) => {
      setAllProducts(res.data);
      setProduct(res.data[0] || "");
      console.log("Loaded products:", res.data.length, res.data); // Debug: see how many products are loaded
    });
  }, []);

  const fetchSuggestions = async () => {
    setLoading(true);
    const data = await suggestCabinetItems(product);
    setSuggestions(data.suggestions || []);
    setLoading(false);
  };

  // Show all products if search is empty, otherwise filter
  const filteredProducts = search.trim()
    ? allProducts.filter((p) => p.toLowerCase().includes(search.toLowerCase()))
    : allProducts;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🧺 Product Bundling Suggestions</Text>

      <View style={styles.section}>
        <Text style={styles.label}>Search Product</Text>
        <TextInput
          style={styles.input}
          placeholder="Type to search..."
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Select Product</Text>
        <Picker
          selectedValue={product}
          onValueChange={setProduct}
          style={styles.picker}
        >
          {filteredProducts.map((p) => (
            <Picker.Item key={p} label={p} value={p} />
          ))}
        </Picker>
      </View>

      <Button
        mode="contained"
        onPress={fetchSuggestions}
        style={styles.button}
        disabled={!product}
      >
        Get Suggestions
      </Button>

      <Button
        mode="outlined"
        onPress={() => navigation.navigate("Prediction")}
        style={styles.button}
      >
        Go to Prediction
      </Button>

      {loading && <ActivityIndicator size="large" style={{ marginTop: 20 }} />}

      {suggestions.length > 0 && (
        <View style={styles.resultBox}>
          <Text style={styles.resultTitle}>
            🧠 Recommended Bundles for: {product}
          </Text>

          {suggestions.map((s, idx) => (
            <View key={idx} style={styles.card}>
              <Text style={styles.cardTitle}>📦 {s.consequents}</Text>

              {/* Chart */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <BarChart
                  data={{
                    labels: ["Confidence", "Lift", "Support"],
                    datasets: [
                      {
                        data: [
                          parseFloat((s.confidence * 100).toFixed(1)),
                          parseFloat(s.lift.toFixed(2)),
                          parseFloat(
                            s.support ? (s.support * 100).toFixed(1) : 0
                          ),
                        ],
                      },
                    ],
                  }}
                  width={400}
                  height={180}
                  fromZero
                  yAxisSuffix="%"
                  chartConfig={{
                    backgroundGradientFrom: "#fff",
                    backgroundGradientTo: "#fff",
                    decimalPlaces: 1,
                    color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
                    labelColor: () => "#000",
                  }}
                  style={{ marginVertical: 8, borderRadius: 8 }}
                />
              </ScrollView>

              {/* Lift Badge */}
              {s.lift > 2 && (
                <Text style={styles.badge}>
                  🔥 Strong Match (Lift: {s.lift.toFixed(2)})
                </Text>
              )}

              {/* Reason */}
              <Text style={styles.reasonText}>
                Customers who buy{" "}
                <Text style={{ fontWeight: "bold" }}>{product}</Text> also buy{" "}
                <Text style={{ fontWeight: "bold" }}>{s.consequents}</Text>.
                Confidence: {(s.confidence * 100).toFixed(1)}%, Lift:{" "}
                {s.lift.toFixed(2)}
              </Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

export default SuggestionScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 100,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  section: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 6,
    padding: 8,
    marginBottom: 4,
  },
  picker: {
    backgroundColor: "#eee",
    borderRadius: 6,
    marginBottom: 4,
  },
  button: {
    marginTop: 10,
    marginBottom: 4,
  },
  resultBox: {
    marginTop: 30,
  },
  resultTitle: {
    fontSize: 18,
    marginBottom: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  card: {
    backgroundColor: "#eef4ff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  reasonText: {
    marginTop: 10,
    fontSize: 14,
    color: "#333",
  },
  badge: {
    backgroundColor: "#d1f5d3",
    color: "#2b7a0b",
    fontWeight: "600",
    fontSize: 13,
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 6,
  },
});
