import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { CheckCircle, AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react-native';
import { useAppContext } from '../context/AppContext';

/**
 * RefundProcessingScreen: A specialized screen that displays a loading state 
 * followed by a success confirmation for an automatic refund.
 * This screen is typically triggered when an item goes out of stock after payment.
 */
export default function RefundProcessingScreen({ navigation, route }) {
  const insets = useSafeAreaInsets(); // Hook to get safe area padding (e.g., for notch)
  
  // Extract refund data passed via navigation params
  const { refundData } = route.params || {};
  
  // Access global theme from context
  const { theme } = useAppContext();
  const isDark = theme === 'dark';
  
  // step 1: Processing animation, step 2: Success summary
  const [step, setStep] = useState(1); 
  
  // Animated value for the spinning refresh icon
  const spinValue = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 1. Start the infinite spin animation for the loader
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // 2. Simulate a delay for "processing" before showing success
    const timer = setTimeout(() => {
      setStep(2); // Transition to success step
    }, 3000);

    // Cleanup: clear the timer if user navigates away before it finishes
    return () => clearTimeout(timer);
  }, []);

  // Interpolate spin value to actual degrees
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={[styles.container, isDark && styles.bgDark]}>
      <StatusBar style={isDark ? "light" : "dark"} />
      
      {/* Custom Header with Back Button */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft size={24} color={isDark ? '#fff' : '#000'} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, isDark && styles.textLight]}>Refund Status</Text>
      </View>

      <View style={styles.content}>
        {step === 1 ? (
          /* STEP 1: Processing View */
          <View style={styles.centerContent}>
            <Animated.View style={{ transform: [{ rotate: spin }] }}>
              <RefreshCw size={80} color="#1C8A3B" />
            </Animated.View>
            <Text style={[styles.statusTitle, isDark && styles.textLight]}>Processing Refund</Text>
            <Text style={styles.statusSub}>
              We are initiating a refund of ₹{refundData?.refundAmount} for {refundData?.itemName}.
            </Text>
            
            <View style={[styles.infoBox, isDark && styles.cardDark]}>
               <Text style={styles.infoText}>
                 Since the item went out of stock right after payment, we are returning the amount to your original payment method.
               </Text>
            </View>
          </View>
        ) : (
          /* STEP 2: Success View */
          <View style={styles.centerContent}>
            <CheckCircle size={80} color="#1C8A3B" />
            <Text style={[styles.statusTitle, isDark && styles.textLight]}>Refund Initiated</Text>
            <Text style={styles.statusSub}>
              ₹{refundData?.refundAmount} will be credited to your account within 3-5 business days.
            </Text>
            
            {/* Detailed Refund Summary Card */}
            <View style={[styles.summaryCard, isDark && styles.cardDark]}>
               <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Refund Amount</Text>
                  <Text style={[styles.summaryValue, { color: '#1C8A3B' }]}>₹{refundData?.refundAmount}</Text>
               </View>
               <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Item</Text>
                  <Text style={[styles.summaryValue, isDark && styles.textLight]}>{refundData?.itemName}</Text>
               </View>
               <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Payment Method</Text>
                  <Text style={[styles.summaryValue, isDark && styles.textLight]}>{refundData?.paymentMethod}</Text>
               </View>
               <View style={styles.divider} />
               <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Remaining Total</Text>
                  <Text style={[styles.summaryValue, isDark && styles.textLight]}>₹{refundData?.newTotal}</Text>
               </View>
            </View>

            {/* Back Action */}
            <TouchableOpacity 
              style={styles.doneBtn}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.doneBtnText}>Back to Tracking</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Persistent Help Footer */}
      <View style={[styles.footer, { paddingBottom: Math.max(24, insets.bottom + 10) }]}>
         <View style={styles.helpBox}>
            <AlertCircle size={16} color="#666" />
            <Text style={styles.helpText}>Need help? Contact our 24/7 support chat.</Text>
         </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  bgDark: {
    backgroundColor: '#121212',
  },
  cardDark: {
    backgroundColor: '#1e1e1e',
    borderColor: '#333',
  },
  textLight: {
    color: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 16,
    color: '#000',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  centerContent: {
    alignItems: 'center',
  },
  statusTitle: {
    fontSize: 24,
    fontWeight: '900',
    marginTop: 24,
    marginBottom: 8,
    color: '#000',
  },
  statusSub: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  infoBox: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 16,
    marginTop: 30,
    width: '100%',
  },
  infoText: {
    fontSize: 13,
    color: '#555',
    lineHeight: 18,
    textAlign: 'center',
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    marginTop: 30,
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000',
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 12,
  },
  doneBtn: {
    backgroundColor: '#1C8A3B',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 16,
    marginTop: 40,
    width: '100%',
    alignItems: 'center',
  },
  doneBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  footer: {
    padding: 24,
  },
  helpBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  helpText: {
    fontSize: 12,
    color: '#666',
  }
});
