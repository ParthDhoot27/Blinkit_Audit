import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator, Animated, Easing, Dimensions, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppContext } from '../context/AppContext';
import { Image, ScrollView } from 'react-native';
import { Phone, MessageSquare, Info } from 'lucide-react-native';

const { width } = Dimensions.get('window');

/**
 * TrackingScreen: Provides real-time visual tracking of orders.
 * Includes a simulated delivery map, delivery partner information, 
 * tipping functionality, and order status management.
 */
export default function TrackingScreen({ navigation }) {
  // --- Context & State ---
  const { currentUser, simulatePostPaymentOOC, markOrderDelivered, buyAgain, addTipToOrder, theme } = useAppContext();
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const isDark = theme === 'dark';

  // Animation reference for the delivery "scooty" (scooter)
  const scootyAnim = useRef(new Animated.Value(0)).current;

  // 1. Initial Selection: Default to the most recent order on mount
  useEffect(() => {
    if (currentUser?.orders?.length > 0 && !selectedOrderId) {
      setSelectedOrderId(currentUser.orders[0].id);
    }
  }, [currentUser]);

  // Derived state for the currently selected order
  const selectedOrder = currentUser?.orders?.find(o => o.id === selectedOrderId);

  // 2. Delivery Animation Logic:
  // Calculates the scooty's position based on elapsed time since the order was placed.
  // The simulation duration is fixed at 15 seconds.
  useEffect(() => {
    if (selectedOrderId && selectedOrder) {
      const deliveryDuration = 30000; // 15 seconds total delivery time for demo
      const orderTime = new Date(selectedOrder.date).getTime();
      const elapsed = Date.now() - orderTime;
      const progress = Math.min(1, Math.max(0, elapsed / deliveryDuration));

      if (selectedOrder.status === 'Delivered') {
        scootyAnim.setValue(1); // Set to final destination
      } else {
        scootyAnim.setValue(progress);
        if (progress < 1) {
          // Resume animation from current progress to 1 (Home)
          Animated.timing(scootyAnim, {
            toValue: 1,
            duration: deliveryDuration * (1 - progress),
            easing: Easing.linear,
            useNativeDriver: true,
          }).start();
        }
      }
    }
  }, [selectedOrderId, selectedOrder?.status]);

  // Empty state handling
  if (!currentUser || !currentUser.orders || currentUser.orders.length === 0) {
    return (
      <SafeAreaView style={[styles.centerContainer, isDark && styles.bgDark]}>
        <Text style={[styles.emptyText, isDark && styles.textLight]}>You have no active orders to track.</Text>
        <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.btnText}>Start Shopping</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  /**
   * Manual trigger for the Out-of-Stock simulation.
   * Redirects to the Refund screen for Online/Wallet payments.
   */
  const handleSimulateOOC = () => {
    const result = simulatePostPaymentOOC(selectedOrderId);
    if (!result) {
      Alert.alert("Notice", "Could not simulate. Maybe order is already delivered or empty.");
      return;
    }

    if (result.paymentMethod === 'Online') {
      navigation.navigate('RefundProcessing', { refundData: result });
    } else {
      // For COD, we just notify the user about the price adjustment
      Alert.alert(
        "We apologize",
        `Unfortunately, ${result.itemName} went out of stock while processing.\n\nSince this is a Cash on Delivery order, please pay the revised amount of ₹${result.newTotal} to the delivery agent.`,
        [{ text: "Okay" }]
      );
    }
  };

  /**
   * Finalizes the delivery and prompts the user for a review.
   */
  const handleConfirmDelivery = () => {
    markOrderDelivered(selectedOrderId);
    Alert.alert("Delivered!", "Your order has been delivered successfully.", [
      { text: "Review Items", onPress: () => navigation.navigate('Review', { orderId: selectedOrderId }) },
      { text: "Dismiss", style: "cancel" }
    ]);
  };

  /**
   * Re-adds all items from the selected order back to the cart.
   */
  const handleBuyAgain = (orderId) => {
    const success = buyAgain(orderId);
    if (success) {
      Alert.alert("Added to Cart", "Items from this order have been added to your cart.");
      navigation.navigate('Cart');
    }
  };

  return (
    <SafeAreaView style={[styles.container, isDark && styles.bgDark]}>

      {/* Horizontal Order Selection Tabs */}
      <View style={[styles.dropdownSection, isDark && styles.cardDark]}>
        <Text style={[styles.sectionTitle, isDark && styles.textLight]}>Select Order to Track</Text>
        <FlatList
          horizontal
          data={currentUser.orders}
          keyExtractor={item => item.id}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.orderTab, selectedOrderId === item.id && styles.orderTabActive, isDark && styles.bgDarkLine]}
              onPress={() => setSelectedOrderId(item.id)}
            >
              <Text style={[styles.orderTabText, selectedOrderId === item.id && styles.orderTabTextActive, isDark && styles.textLight]}>
                {item.id.substring(0, 8)}...
              </Text>
              <Text style={styles.orderTabStatus}>{item.status}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {selectedOrder && (
          <View style={styles.detailsSection}>

            {/* 1. Animated Delivery Map Section */}
            {!selectedOrder.delivered && (
              <View style={[styles.mapContainer, isDark && styles.cardDark]}>
                <Image 
                  source={require('../../assets/map.png')} 
                  style={styles.mapBg} 
                  resizeMode="cover"
                />
                
                {/* Store Icon */}
                <View style={[styles.locationMarker, { right: 40, top: 50 }]}>
                  <View style={styles.markerCircle}><Text style={styles.locationIcon}>🏪</Text></View>
                  <Text style={styles.locationLabel}>Store</Text>
                </View>

                {/* Home Icon */}
                <View style={[styles.locationMarker, { left: 40, bottom: 50 }]}>
                  <View style={styles.markerCircle}><Text style={styles.locationIcon}>🏠</Text></View>
                  <Text style={styles.locationLabel}>Home</Text>
                </View>

                {/* Animated Scooty */}
                <Animated.View style={[
                  styles.scootyContainer,
                  {
                    transform: [
                      {
                        translateX: scootyAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [width - 100, 50],
                        })
                      },
                      {
                        translateY: scootyAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [60, 180],
                        })
                      },
                      {
                        scaleX: -1 // Facing left (towards home)
                      }
                    ]
                  }
                ]}>
                  <View style={styles.scootyWrapper}>
                    <Text style={styles.scootyIcon}>🛵</Text>
                    <View style={styles.scootyTail} />
                  </View>
                </Animated.View>

                <View style={styles.mapOverlay}>
                  <Text style={styles.etaText}>Scooty reaching in 15 seconds...</Text>
                </View>
              </View>
            )}

            {/* 2. Success Banner (Delivered State) */}
            {selectedOrder.delivered && (
              <View style={styles.deliveredSuccessContainer}>
                <Text style={styles.deliveredIcon}>✅</Text>
                <Text style={[styles.deliveredText, isDark && styles.textLight]}>Order Delivered Successfully!</Text>

                <View style={styles.deliveredActions}>
                  <TouchableOpacity
                    style={styles.rateBtn}
                    onPress={() => navigation.navigate('Review', { orderId: selectedOrderId })}
                  >
                    <Text style={styles.rateBtnText}>Rate Products</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.buyAgainBtn}
                    onPress={() => handleBuyAgain(selectedOrder.id)}
                  >
                    <Text style={styles.buyAgainBtnText}>Buy Again</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* 3. Delivery Partner Info Card */}
            {!selectedOrder.delivered && (
              <View style={[styles.partnerCard, isDark && styles.bgDarkLine]}>
                <View style={styles.partnerInfo}>
                  <View style={styles.partnerAvatar}>
                    <Text style={{ fontSize: 20 }}>👤</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.partnerName, isDark && styles.textLight]}>Rameshwar</Text>
                    <Text style={styles.partnerRating}>⭐ 4.9 (500+ orders)</Text>
                  </View>
                  <View style={styles.partnerActions}>
                    <TouchableOpacity style={styles.actionCircle}><Phone size={20} color="#1C8A3B" /></TouchableOpacity>
                    <TouchableOpacity style={styles.actionCircle}><MessageSquare size={20} color="#1C8A3B" /></TouchableOpacity>
                  </View>
                </View>
                <Text style={styles.partnerStatus}>I'm picking up your order from the store</Text>
              </View>
            )}

            {/* 4. Tipping Interaction Section */}
            {!selectedOrder.delivered && (
              <View style={styles.tipCard}>
                <Text style={[styles.tipTitle, isDark && styles.textLight]}>Delivering happiness at your doorstep!</Text>
                <Text style={styles.tipSub}>Thank them by leaving a tip</Text>
                <View style={styles.tipRow}>
                  {[20, 30, 50].map(amt => (
                    <TouchableOpacity
                      key={amt}
                      style={[styles.tipBtn, selectedOrder.tipAmount === amt && styles.tipBtnActive]}
                      onPress={() => addTipToOrder(selectedOrderId, amt)}>
                      <Text style={[styles.tipBtnText, selectedOrder.tipAmount === amt && styles.tipBtnTextActive]}>🤩 ₹{amt}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* 5. Detailed Bill / Item List Card */}
            <View style={[styles.card, isDark && styles.cardDark]}>
              <View style={styles.cardHeader}>
                <Text style={[styles.cardTitle, isDark && styles.textLight]}>Order Details</Text>
                <Text style={styles.orderIdText}>ID: {selectedOrder.id.substring(0, 12)}</Text>
              </View>

              <View style={styles.infoRow}>
                <Info size={16} color="#666" />
                <Text style={[styles.infoText, isDark && styles.textDim]}>Payment via {selectedOrder.paymentMethod}</Text>
              </View>

              <View style={styles.divider} />

              {selectedOrder.items.map((item, index) => (
                <View key={index} style={styles.itemRow}>
                  <Text style={[
                    styles.itemName,
                    item.isOOCAfterPayment && styles.strikethrough, // Strike through items that were refunded post-payment
                    isDark && styles.textLight
                  ]}>
                    {item.cartQuantity} x {item.name}
                  </Text>
                  <Text style={[styles.itemPrice, isDark && styles.textLight]}>₹{item.price * item.cartQuantity}</Text>
                </View>
              ))}

              <View style={styles.divider} />

              <View style={styles.totalRow}>
                <Text style={[styles.totalLabel, isDark && styles.textLight]}>Grand Total</Text>
                <Text style={[styles.totalValue, isDark && styles.textLight]}>₹{selectedOrder.revisedTotal || selectedOrder.originalTotal}</Text>
              </View>
            </View>

            {/* 6. Interaction Area (Confirm Delivery or Simulation) */}
            {!selectedOrder.delivered && (
              <View style={styles.actionsSection}>
                {/* 
                   Wait Logic: Only allow manual confirmation if 15 seconds have passed,
                   simulating the arrival of the delivery person.
                */}
                {(Date.now() - new Date(selectedOrder.date).getTime() >= 20000) ? (
                  <TouchableOpacity style={styles.confirmDelBtn} onPress={handleConfirmDelivery}>
                    <Text style={styles.confirmDelText}>CONFIRM DELIVERY</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.waitingContainer}>
                    <ActivityIndicator color="#1C8A3B" />
                    <Text style={styles.waitingText}>Waiting for arrival...</Text>
                  </View>
                )}
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
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
  bgDarkLine: {
    backgroundColor: '#2a2a2a',
    borderColor: '#444',
  },
  textLight: {
    color: '#fff',
  },
  textDim: {
    color: '#aaa',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 25,
    textAlign: 'center',
  },
  btn: {
    backgroundColor: '#1C8A3B',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 16,
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  dropdownSection: {
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#000',
  },
  orderTab: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 12,
    padding: 12,
    marginRight: 10,
    minWidth: 130,
  },
  orderTabActive: {
    borderColor: '#1C8A3B',
    backgroundColor: '#e8f5e9',
  },
  orderTabText: {
    fontWeight: '700',
    color: '#333',
    fontSize: 14,
  },
  orderTabTextActive: {
    color: '#1C8A3B',
  },
  orderTabStatus: {
    fontSize: 11,
    color: '#888',
    marginTop: 6,
    fontWeight: '600',
  },
  detailsSection: {
    padding: 15,
  },
  mapContainer: {
    backgroundColor: '#e0e0e0',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
    height: 300,
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  mapBg: {
    width: '100%',
    height: '100%',
    opacity: 0.8,
  },
  locationMarker: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 10,
  },
  markerCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  locationIcon: { fontSize: 20 },
  locationLabel: { 
    fontSize: 10, 
    color: '#000', 
    fontWeight: 'bold',
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 4,
    borderRadius: 4,
    marginTop: 2
  },
  scootyContainer: { 
    position: 'absolute', 
    zIndex: 20,
  },
  scootyWrapper: {
    alignItems: 'center',
  },
  scootyIcon: { fontSize: 32 },
  scootyTail: {
    width: 4,
    height: 10,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 2,
    marginTop: -5,
  },
  mapOverlay: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  etaText: { 
    fontSize: 12, 
    color: '#1C8A3B', 
    fontWeight: 'bold',
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  partnerCard: {
    padding: 18,
    borderBottomWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fdfdfd',
  },
  partnerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  partnerAvatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#F8CB46',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  partnerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  partnerRating: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  partnerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#e8f5e9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  partnerStatus: {
    fontSize: 13,
    color: '#1C8A3B',
    fontWeight: '700',
    backgroundColor: '#e8f5e9',
    padding: 10,
    borderRadius: 12,
    textAlign: 'center',
  },
  tipCard: {
    padding: 18,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#000',
  },
  tipSub: {
    fontSize: 12,
    color: '#666',
    marginBottom: 12,
    marginTop: 2,
  },
  tipRow: {
    flexDirection: 'row',
    gap: 10,
  },
  tipBtn: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eee',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 12,
  },
  tipBtnActive: {
    borderColor: '#1C8A3B',
    backgroundColor: '#e8f5e9',
  },
  tipBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#333',
  },
  tipBtnTextActive: {
    color: '#1C8A3B',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#eee',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#000',
  },
  orderIdText: {
    fontSize: 12,
    color: '#999',
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 15,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 15,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  itemName: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    flex: 1,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  strikethrough: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: '#000',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#000',
  },
  actionsSection: {
    gap: 15,
  },
  simOocBtn: {
    backgroundColor: '#fff8e1',
    borderWidth: 1,
    borderColor: '#ffe082',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  simOocBtnText: {
    color: '#f57c00',
    fontWeight: 'bold',
    fontSize: 14,
  },
  deliveredSuccessContainer: {
    backgroundColor: '#e8f5e9',
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#c8e6c9',
  },
  deliveredIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  deliveredText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#1b5e20',
    marginBottom: 20,
  },
  deliveredActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  rateBtn: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#1C8A3B',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  rateBtnText: {
    color: '#1C8A3B',
    fontWeight: 'bold',
  },
  buyAgainBtn: {
    flex: 1,
    backgroundColor: '#1C8A3B',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  buyAgainBtnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  confirmDelBtn: {
    backgroundColor: '#1C8A3B',
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 15,
  },
  confirmDelText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  waitingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    marginBottom: 15,
    gap: 10,
  },
  waitingText: {
    color: '#666',
    fontWeight: '600',
  }
});
