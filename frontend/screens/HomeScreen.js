import React from "react";
import { View, Text, StyleSheet, Image, Dimensions } from "react-native";
import { Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

const screenWidth = Dimensions.get("window").width;

const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Image source={require("../assets/delivery.png")} style={styles.logo} />
      <Text style={styles.name}>SmartShelf</Text>
      <Text style={styles.subtitle}>Welcome! Smart Warehouse Dashboard</Text>

      <Button
        mode="contained"
        style={styles.button}
        onPress={() => navigation.navigate("Prediction")}
      >
        💹 Predict Product Demand
      </Button>

      <Button
        mode="contained"
        style={styles.button}
        onPress={() => navigation.navigate("Suggestions")}
      >
        🧺 Cabinet Suggestions
      </Button>

      <Button
        mode="contained"
        style={styles.button}
        onPress={() => navigation.navigate("QRScanner")}
      >
        📸 Scan QR Code
      </Button>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    justifyContent: "center",
    backgroundColor: "#4c8479",
  },
  logo: {
    width: screenWidth,
    height: 160,
    alignSelf: "center",
    marginBottom: 10,
    resizeMode: "contain",
  },
  name: {
    fontFamily: "montserrat",
    fontSize: 48,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#edb232",
  },
  subtitle: {
    fontSize: 16,
    marginTop: 0,
    marginBottom: 30,
    textAlign: "center",
    color: "#fff",
  },
  button: {
    marginVertical: 10,
    paddingVertical: 5,
  },
});
