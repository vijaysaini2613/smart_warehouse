import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";

const QRScannerScreen = () => {
  return (
    <View style={{ flex: 1 }}>
      <WebView
        source={{ uri: "http://10.102.142.75:5000/qrscanner" }} // Your Flask server IP
        javaScriptEnabled
        domStorageEnabled
        startInLoadingState
      />
    </View>
  );
};

export default QRScannerScreen;
