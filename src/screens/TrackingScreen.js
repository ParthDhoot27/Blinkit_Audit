import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator, Animated, Easing, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppContext } from '../context/AppContext';
import { Image, ScrollView } from 'react-native';
import { Phone, MessageSquare, Info } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function TrackingScreen({ navigation }) {
  const { currentUser, simulatePostPaymentOOC, markOrderDelivered, buyAgain, addTipToOrder, theme } = useAppContext();
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const isDark = theme === 'dark';

  const scootyAnim = useRef(new Animated.Value(0)).current;

  // Default to the most recent order if available
  useEffect(() => {
    if (currentUser?.orders?.length > 0 && !selectedOrderId) {
      setSelectedOrderId(currentUser.orders[0].id);
    }
  }, [currentUser]);

  // Animation for scooty
  useEffect(() => {
    if (selectedOrderId) {
      scootyAnim.setValue(0);
      Animated.loop(
        Animated.timing(scootyAnim, {
          toValue: 1,
          duration: 10000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    }
  }, [selectedOrderId]);

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

  const selectedOrder = currentUser.orders.find(o => o.id === selectedOrderId);

  const handleSimulateOOC = () => {
    const result = simulatePostPaymentOOC(selectedOrderId);
    if (!result) {
      Alert.alert("Notice", "Could not simulate. Maybe order is already delivered or empty.");
      return;
    }

    if (result.paymentMethod === 'Online') {
      navigation.navigate('RefundProcessing', { refundData: result });
    } else {
      Alert.alert(
        "We apologize",
        `Unfortunately, ${result.itemName} went out of stock while processing.\n\nSince this is a Cash on Delivery order, please pay the revised amount of ₹${result.newTotal} to the delivery agent.`,
        [{ text: "Okay" }]
      );
    }
  };

  const handleSimulateDelivery = () => {
    markOrderDelivered(selectedOrderId);
    Alert.alert("Delivered!", "Your order has been delivered successfully.", [
      { text: "Review Items", onPress: () => navigation.navigate('Review', { orderId: selectedOrderId }) },
      { text: "Cancel", style: "cancel" }
    ]);
  };

  const translateX = scootyAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, width - 100],
  });

  return (
    <SafeAreaView style={[styles.container, isDark && styles.bgDark]}>

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
            {selectedOrder.status !== 'Delivered' && (
              <View style={[styles.mapContainer, isDark && styles.cardDark]}>
                <View style={styles.mapHeader}>
                  <Text style={styles.mapHeaderTextSmall}>Arriving in 5 minutes</Text>
                  <Text style={styles.mapHeaderTextLarge}>Delivery Partner is on the way</Text>
                </View>

                <View style={styles.mapArea}>
                  {/* Visual Path */}
                  <View style={styles.mapPath} />

                  {/* Animated Scooty Icon */}
                  <Animated.View style={[styles.scootyIconContainer, { transform: [{ translateX }] }]}>
                    <Text style={{ fontSize: 30 }}>🛵</Text>
                  </Animated.View>

                  {/* Destination Marker */}
                  <View style={styles.destinationMarker}>
                    <Text style={{ fontSize: 24 }}>🏠</Text>
                  </View>
                </View>

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
              </View>
            )}

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
                  <Text style={[styles.itemName, item.isOOCAfterPayment && styles.strikethrough, isDark && styles.textLight]}>
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

            {selectedOrder.status !== 'Delivered' && (
              <View style={styles.actionsSection}>
                {!selectedOrder.isOOCMocked && (
                  <TouchableOpacity style={styles.simOocBtn} onPress={handleSimulateOOC}>
                    <Text style={styles.simOocBtnText}>Simulate Item Out-of-Stock</Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity style={styles.simDelBtn} onPress={handleSimulateDelivery}>
                  <Text style={styles.simDelBtnText}>Simulate Order Delivery</Text>
                </TouchableOpacity>
              </View>
            )}

            {selectedOrder.status === 'Delivered' && (
              <View style={styles.deliveredActions}>
                <TouchableOpacity
                  style={styles.buyAgainBtn}
                  onPress={() => {
                    buyAgain(selectedOrderId);
                    navigation.navigate('Cart');
                  }}
                >
                  <Text style={styles.buyAgainBtnText}>Buy Again</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.reviewBtn} onPress={() => navigation.navigate('Review', { orderId: selectedOrderId })}>
                  <Text style={styles.reviewBtnText}>Rate your items ⭐</Text>
                </TouchableOpacity>
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
    backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
  },
  mapHeader: {
    backgroundColor: '#1C8A3B',
    padding: 18,
  },
  mapHeaderTextSmall: {
    color: '#e8f5e9',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  mapHeaderTextLarge: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '900',
  },
  mapArea: {
    height: 120,
    backgroundColor: '#f0f4f0',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  mapPath: {
    height: 4,
    backgroundColor: '#ddd',
    borderRadius: 2,
    width: '100%',
    position: 'absolute',
    alignSelf: 'center',
  },
  scootyIconContainer: {
    position: 'absolute',
    left: 20,
  },
  destinationMarker: {
    position: 'absolute',
    right: 20,
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
  simDelBtn: {
    backgroundColor: '#1C8A3B',
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
  },
  simDelBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  deliveredActions: {
    gap: 12,
  },
  buyAgainBtn: {
    backgroundColor: '#1C8A3B',
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
  },
  buyAgainBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  reviewBtn: {
    backgroundColor: '#F8CB46',
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
  },
  reviewBtnText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1C8A3B',
  }
});
