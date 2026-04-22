import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppContext } from '../context/AppContext';
import { Image, ScrollView } from 'react-native';

export default function TrackingScreen({ navigation }) {
  const { currentUser, simulatePostPaymentOOC, markOrderDelivered, buyAgain, addTipToOrder } = useAppContext();
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [isRefunding, setIsRefunding] = useState(false);

  // Default to the most recent order if available
  useEffect(() => {
    if (currentUser?.orders?.length > 0 && !selectedOrderId) {
      setSelectedOrderId(currentUser.orders[0].id);
    }
  }, [currentUser]);

  if (!currentUser || !currentUser.orders || currentUser.orders.length === 0) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <Text style={styles.emptyText}>You have no active orders to track.</Text>
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
      // Simulate 2-3s loading for refund
      setIsRefunding(true);
      setTimeout(() => {
        setIsRefunding(false);
        Alert.alert(
          "We apologize",
          `Unfortunately, ${result.itemName} went out of stock right after your payment.\n\nRefund of ₹${result.refundAmount} has been initiated to your original payment method.\n\nYour new order total is ₹${result.newTotal}.`,
          [{ text: "Okay" }]
        );
      }, 2500);
    } else {
      // COD
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

  return (
    <SafeAreaView style={styles.container}>
      {isRefunding && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#1C8A3B" />
          <Text style={styles.loadingText}>Processing Refund...</Text>
        </View>
      )}

      <View style={styles.dropdownSection}>
        <Text style={styles.sectionTitle}>Select Order to Track</Text>
        <FlatList
          horizontal
          data={currentUser.orders}
          keyExtractor={item => item.id}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={[styles.orderTab, selectedOrderId === item.id && styles.orderTabActive]}
              onPress={() => setSelectedOrderId(item.id)}
            >
              <Text style={[styles.orderTabText, selectedOrderId === item.id && styles.orderTabTextActive]}>
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
            <View style={styles.mapContainer}>
              <View style={styles.mapHeader}>
                <Text style={styles.mapHeaderTextSmall}>Packing your order</Text>
                <Text style={styles.mapHeaderTextLarge}>Arriving in 5 minutes</Text>
              </View>
              <Image source={{ uri: 'https://placehold.co/400x200/e0e0e0/666666/png?text=Map+Tracking+Route' }} style={styles.mapImage} />
              
              <View style={styles.payCard}>
                <Text style={styles.payTitle}>Pay ₹{selectedOrder.revisedTotal || selectedOrder.originalTotal} before or on delivery</Text>
                <Text style={styles.paySub}>Please keep change handy or avoid hassle by paying online.</Text>
              </View>

              <View style={styles.partnerCard}>
                <Text style={styles.partnerName}>I'm RAMESHWAR, your delivery partner</Text>
                <Text style={styles.partnerStatus}>I've reached the store and will pick up your order soon</Text>
              </View>

              <View style={styles.tipCard}>
                <Text style={styles.tipTitle}>Delivering happiness at your doorstep!</Text>
                <Text style={styles.tipSub}>Thank them by leaving a tip</Text>
                <View style={styles.tipRow}>
                  <TouchableOpacity 
                    style={[styles.tipBtn, selectedOrder.tipAmount === 20 && styles.tipBtnActive]} 
                    onPress={() => addTipToOrder(selectedOrderId, 20)}>
                    <Text style={[styles.tipBtnText, selectedOrder.tipAmount === 20 && styles.tipBtnTextActive]}>🤩 ₹20</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.tipBtn, selectedOrder.tipAmount === 30 && styles.tipBtnActive]} 
                    onPress={() => addTipToOrder(selectedOrderId, 30)}>
                    <Text style={[styles.tipBtnText, selectedOrder.tipAmount === 30 && styles.tipBtnTextActive]}>🤩 ₹30</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.tipBtn, selectedOrder.tipAmount === 50 && styles.tipBtnActive]} 
                    onPress={() => addTipToOrder(selectedOrderId, 50)}>
                    <Text style={[styles.tipBtnText, selectedOrder.tipAmount === 50 && styles.tipBtnTextActive]}>🤩 ₹50</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Order Info</Text>
            <Text style={styles.infoText}>Status: <Text style={styles.bold}>{selectedOrder.status}</Text></Text>
            <Text style={styles.infoText}>Payment: {selectedOrder.paymentMethod}</Text>
            <Text style={styles.infoText}>Original Total: ₹{selectedOrder.originalTotal}</Text>
            {selectedOrder.tipAmount > 0 && (
              <Text style={styles.infoText}>Delivery Tip: ₹{selectedOrder.tipAmount}</Text>
            )}
            {selectedOrder.revisedTotal && (
              <Text style={styles.infoTextRevised}>Final Total: ₹{selectedOrder.revisedTotal}</Text>
            )}
            
            <View style={styles.divider} />
            <Text style={styles.cardTitle}>Items ({selectedOrder.items.length})</Text>
            {selectedOrder.items.map((item, index) => (
              <View key={index} style={styles.itemRow}>
                <Text style={[styles.itemName, item.isOOCAfterPayment && styles.strikethrough]}>
                  {item.cartQuantity}x {item.name}
                </Text>
                {item.isOOCAfterPayment && <Text style={styles.oocText}>Unavailable</Text>}
              </View>
            ))}
          </View>

          {selectedOrder.status !== 'Delivered' && (
            <View style={styles.actionsSection}>
              {!selectedOrder.isOOCMocked && (
                <TouchableOpacity style={styles.simOocBtn} onPress={handleSimulateOOC}>
                  <Text style={styles.simOocBtnText}>Simulate Post-Payment OOC Event</Text>
                </TouchableOpacity>
              )}
              
              <TouchableOpacity style={styles.simDelBtn} onPress={handleSimulateDelivery}>
                <Text style={styles.simDelBtnText}>Simulate Delivery</Text>
              </TouchableOpacity>
            </View>
          )}

          {selectedOrder.status === 'Delivered' && (
            <View>
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
                <Text style={styles.reviewBtnText}>Write a Review</Text>
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
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  btn: {
    backgroundColor: '#1C8A3B',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  dropdownSection: {
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  orderTab: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginRight: 10,
    minWidth: 120,
  },
  orderTabActive: {
    borderColor: '#1C8A3B',
    backgroundColor: '#e8f5e9',
  },
  orderTabText: {
    fontWeight: '600',
    color: '#555',
  },
  orderTabTextActive: {
    color: '#1C8A3B',
  },
  orderTabStatus: {
    fontSize: 11,
    color: '#888',
    marginTop: 4,
  },
  detailsSection: {
    padding: 15,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#111',
  },
  infoText: {
    fontSize: 14,
    color: '#444',
    marginBottom: 6,
  },
  bold: {
    fontWeight: 'bold',
  },
  infoTextRevised: {
    fontSize: 14,
    color: '#d32f2f',
    fontWeight: 'bold',
    marginTop: 5,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 15,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  itemName: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  strikethrough: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  oocText: {
    color: '#d32f2f',
    fontSize: 12,
    fontWeight: 'bold',
  },
  actionsSection: {
    marginTop: 10,
  },
  simOocBtn: {
    backgroundColor: '#fff3e0',
    borderWidth: 1,
    borderColor: '#ff9800',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  simOocBtnText: {
    color: '#ef6c00',
    fontWeight: 'bold',
  },
  simDelBtn: {
    backgroundColor: '#1C8A3B',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  simDelBtnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  buyAgainBtn: {
    backgroundColor: '#1C8A3B',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  buyAgainBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  reviewBtn: {
    backgroundColor: '#F8CB46',
    padding: 15,
    borderRadius: 8,
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
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1C8A3B',
  },
  mapContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  mapHeader: {
    backgroundColor: '#1C8A3B',
    padding: 15,
    alignItems: 'center',
  },
  mapHeaderTextSmall: {
    color: '#e8f5e9',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  mapHeaderTextLarge: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '900',
  },
  mapImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  payCard: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  payTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 4,
  },
  paySub: {
    fontSize: 12,
    color: '#666',
  },
  partnerCard: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fdfdfd',
  },
  partnerName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  partnerStatus: {
    fontSize: 12,
    color: '#1C8A3B',
    fontWeight: '600',
    backgroundColor: '#e8f5e9',
    padding: 8,
    borderRadius: 6,
  },
  tipCard: {
    padding: 15,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111',
  },
  tipSub: {
    fontSize: 12,
    color: '#666',
    marginBottom: 10,
  },
  tipRow: {
    flexDirection: 'row',
    gap: 10,
  },
  tipBtn: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  tipBtnActive: {
    borderColor: '#1C8A3B',
    backgroundColor: '#e8f5e9',
  },
  tipBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },
  tipBtnTextActive: {
    color: '#1C8A3B',
  }
});
