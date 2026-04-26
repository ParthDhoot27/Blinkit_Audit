import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import all application screens
import HomeScreen from '../screens/HomeScreen';
import ProductScreen from '../screens/ProductScreen';
import CartScreen from '../screens/CartScreen';
import LoginScreen from '../screens/LoginScreen';
import ProfileScreen from '../screens/ProfileScreen';
import TrackingScreen from '../screens/TrackingScreen';
import ReviewScreen from '../screens/ReviewScreen';
import AllItemsScreen from '../screens/AllItemsScreen';
import ReviewSubmittedScreen from '../screens/ReviewSubmittedScreen';
import RefundProcessingScreen from '../screens/RefundProcessingScreen';
import WalletScreen from '../screens/WalletScreen';

import GlobalNotification from '../GlobalNotification';

// Initialize the Native Stack Navigator
const Stack = createNativeStackNavigator();

/**
 * AppNavigator: Defines the navigation structure of the app.
 * Uses a Stack Navigator to manage transitions between screens.
 * Centralizes the global header styling (Blinkit Yellow theme).
 */
export default function AppNavigator() {
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="Home"
          screenOptions={{
            // Global styling for headers across all screens
            headerStyle: { backgroundColor: '#F8CB46' }, // Signature Blinkit yellow
            headerTintColor: '#000', // Black text/icons for readability on yellow
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        >
          {/* Home Screen: Custom header managed inside the component */}
          <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
          
          {/* Product Details Screen */}
          <Stack.Screen name="Product" component={ProductScreen} />
          
          {/* Cart/Checkout Screen */}
          <Stack.Screen name="Cart" component={CartScreen} />
          
          {/* Authentication Screen */}
          <Stack.Screen name="Login" component={LoginScreen} />
          
          {/* User Profile and Settings */}
          <Stack.Screen name="Profile" component={ProfileScreen} />
          
          {/* Order Tracking and Delivery Progress */}
          <Stack.Screen name="Tracking" component={TrackingScreen} options={{ title: 'Track Orders' }} />
          
          {/* Item Review and Rating Screen */}
          <Stack.Screen name="Review" component={ReviewScreen} options={{ title: 'Review Items' }} />
          
          {/* Post-Review Confirmation Screen */}
          <Stack.Screen name="ReviewSubmitted" component={ReviewSubmittedScreen} options={{ headerShown: false }} />
          
          {/* Specialized screen for out-of-stock refund processing */}
          <Stack.Screen name="RefundProcessing" component={RefundProcessingScreen} options={{ headerShown: false }} />
          
          {/* Category Browser / Search Results Screen */}
          <Stack.Screen name="AllItems" component={AllItemsScreen} options={{ headerShown: false }} />
          
          {/* Wallet Balance and Transactions Screen */}
          <Stack.Screen name="Wallet" component={WalletScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
      <GlobalNotification />
    </>
  );
}
