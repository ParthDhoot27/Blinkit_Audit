import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppContext } from '../context/AppContext';

export default function TrackingScreen({ navigation }) {
  const { currentUser, simulatePostPaymentOOC, markOrderDelivered, buyAgain } = useAppContext();
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

      {selectedOrder && (
        <View style={styles.detailsSection}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Order Info</Text>
            <Text style={styles.infoText}>Status: <Text style={styles.bold}>{selectedOrder.status}</Text></Text>
            <Text style={styles.infoText}>Payment: {selectedOrder.paymentMethod}</Text>
            <Text style={styles.infoText}>Original Total: ₹{selectedOrder.originalTotal}</Text>
            {selectedOrder.revisedTotal && (
              <Text style={styles.infoTextRevised}>Revised Total: ₹{selectedOrder.revisedTotal}</Text>
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
  }
});
