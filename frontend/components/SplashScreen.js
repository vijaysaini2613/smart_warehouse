import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import LottieView from "lottie-react-native";

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <LottieView
        source={{ uri: "https://lottie.host/b402768b-5a9e-4fd5-bec2-cd1df3076c28/XHqb5LRb3B.lottie" }}
        autoPlay
        loop
        style={styles.lottie}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  lottie: {
    width: Dimensions.get("window").width * 0.7,
    height: Dimensions.get("window").width * 0.7,
  },
});