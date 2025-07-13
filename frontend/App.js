import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Provider as PaperProvider } from "react-native-paper";

import HomeScreen from "./screens/HomeScreen";
import PredictionScreen from "./screens/PredictionScreen";
import SuggestionScreen from "./screens/SuggestionScreen";
import QRScannerScreen from "./screens/QRScannerScreen"; // ✅ Added
import SplashScreen from "./components/SplashScreen";

const Stack = createNativeStackNavigator();

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Prediction" component={PredictionScreen} />
          <Stack.Screen name="Suggestions" component={SuggestionScreen} />
          {/* ✅ Added QRScanner */}
          <Stack.Screen name="QRScanner" component={QRScannerScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
};

export default App;
