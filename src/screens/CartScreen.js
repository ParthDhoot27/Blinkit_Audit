import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppContext } from '../context/AppContext';
import { Minus, Plus, Trash2, ArrowRightLeft } from 'lucide-react-native';

export default function CartScreen({ navigation }) {
  const { 
    currentUser, 
    stock, 
    updateCartQuantity, 
    removeFromCart, 
    checkout,
    moveItemToPacket
  } = useAppContext();

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('Online');
  const [showRefundPipeline, setShowRefundPipeline] = useState(false);

  if (!currentUser) {
    return (
      <View style={styles.centerContainer}>
        <Text>Please login to view cart</Text>
      </View>
    );
  }

  const cartItems = currentUser.cart || [];
  
  const packet1Items = cartItems.filter(item => item.packet === 1 || !item.packet);
  const packet2Items = cartItems.filter(item => item.packet === 2);

  const hasOOCItems = cartItems.some(item => {
    const currentStockItem = stock.find(s => s.id === item.id);
    return !currentStockItem || currentStockItem.stock <= 0;
  });

  const itemTotal = cartItems.reduce((total, item) => {
    const currentStockItem = stock.find(s => s.id === item.id);
    if (currentStockItem && currentStockItem.stock > 0) {
      return total + (item.price * item.cartQuantity);
    }
    return total;
  }, 0);

  const deliveryFee = itemTotal > 0 ? 15 : 0;
  
  let discount = 0;
  if (appliedCoupon === 'WELCOME20') {
    discount = Math.floor(itemTotal * 0.2);
  } else if (appliedCoupon === 'FREEDELIVERY') {
    discount = deliveryFee;
  }

  const finalTotal = itemTotal + deliveryFee - discount;

  const handleApplyCoupon = () => {
    const code = couponCode.toUpperCase().trim();
    if (code === 'WELCOME20' || code === 'FREEDELIVERY') {
      setAppliedCoupon(code);
      Alert.alert("Coupon Applied!", `You are saving with ${code}`);
    } else {
      Alert.alert("Invalid Coupon", "Please enter a valid coupon code.");
      setAppliedCoupon(null);
    }
  };

  const handleCheckout = () => {
    if (itemTotal === 0) {
      Alert.alert("Empty Cart", "Add available items to checkout.");
      return;
    }
    if (hasOOCItems) {
      Alert.alert("Items Unavailable", "Please remove out of stock items before proceeding.");
      return;
    }
    const success = checkout(paymentMethod);
    if (success) {
      setShowRefundPipeline(true);
      Alert.alert("Order Placed", "Your order is placed successfully!");
    }
  };

  const renderCartItem = ({ item }) => {
    const currentStockItem = stock.find(s => s.id === item.id);
    const isOutOfStock = !currentStockItem || currentStockItem.stock <= 0;
    const currentPacket = item.packet || 1;

    return (
      <View style={[styles.cartItem, isOutOfStock && styles.outOfStockItem]}>
        <Image source={{ uri: item.image }} style={styles.itemImage} />
        <View style={styles.itemDetails}>
          <Text style={[styles.itemName, isOutOfStock && styles.strikethrough]}>{item.name}</Text>
          <Text style={styles.itemQuantity}>{item.quantity}</Text>
          <Text style={[styles.itemPrice, isOutOfStock && styles.strikethrough]}>₹{item.price}</Text>
          
          {isOutOfStock && (
            <View>
              <Text style={styles.outOfStockText}>Unavailable (Cannot be bought)</Text>
              <Text style={styles.alternativeText}>Please remove to proceed.</Text>
            </View>
          )}
          
          {item.isCold && !isOutOfStock && (
            <TouchableOpacity 
              style={styles.movePacketBtn}
              onPress={() => moveItemToPacket(item.id, currentPacket === 1 ? 2 : 1)}
            >
              <ArrowRightLeft size={12} color="#0066cc" />
              <Text style={styles.movePacketText}>
                Move to Packet {currentPacket === 1 ? '2 (Cold)' : '1'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.actionContainer}>
          {!isOutOfStock && (
            <View style={styles.quantityControls}>
              <TouchableOpacity onPress={() => updateCartQuantity(item.id, -1)} style={styles.controlBtn}>
                <Minus size={16} color="green" />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{item.cartQuantity}</Text>
              <TouchableOpacity onPress={() => updateCartQuantity(item.id, 1)} style={styles.controlBtn}>
                <Plus size={16} color="green" />
              </TouchableOpacity>
            </View>
          )}
          <TouchableOpacity onPress={() => removeFromCart(item.id)} style={styles.removeBtn}>
            <Trash2 size={20} color={isOutOfStock ? "#d32f2f" : "#666"} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (showRefundPipeline) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.refundContainer}>
          <Text style={styles.refundTitle}>Payment Processed</Text>
          <Text style={styles.successText}>Order is being prepared!</Text>
          <TouchableOpacity style={styles.backHomeBtn} onPress={() => navigation.navigate('Home')}>
            <Text style={styles.backHomeText}>Back to Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.trackBtn} onPress={() => {
            setShowRefundPipeline(false);
            navigation.navigate('Tracking');
          }}>
            <Text style={styles.trackBtnText}>Track Order</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {cartItems.length > 0 ? (
        <View style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            
            {packet1Items.length > 0 && (
              <View style={styles.packetContainer}>
                <Text style={styles.packetTitle}>📦 Packet 1 (Regular Items)</Text>
                {packet1Items.map(item => <React.Fragment key={item.id}>{renderCartItem({item})}</React.Fragment>)}
              </View>
            )}

            {packet2Items.length > 0 && (
              <View style={styles.packetContainer}>
                <Text style={styles.packetTitle}>❄️ Packet 2 (Cold/Fragile Items)</Text>
                {packet2Items.map(item => <React.Fragment key={item.id}>{renderCartItem({item})}</React.Fragment>)}
              </View>
            )}

            <View style={styles.couponSection}>
              <Text style={styles.sectionTitle}>Apply Coupon</Text>
              <View style={styles.couponRow}>
                <TextInput
                  style={styles.couponInput}
                  placeholder="Enter code (e.g., WELCOME20)"
                  value={couponCode}
                  onChangeText={setCouponCode}
                />
                <TouchableOpacity style={styles.applyBtn} onPress={handleApplyCoupon}>
                  <Text style={styles.applyBtnText}>Apply</Text>
                </TouchableOpacity>
              </View>
              {appliedCoupon && (
                <Text style={styles.appliedText}>✓ Coupon '{appliedCoupon}' applied!</Text>
              )}
            </View>

            <View style={styles.billSummary}>
              <Text style={styles.sectionTitle}>Bill Summary</Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Item Total</Text>
                <Text style={styles.summaryValue}>₹{itemTotal}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Delivery Fee</Text>
                <Text style={styles.summaryValue}>₹{deliveryFee}</Text>
              </View>
              {discount > 0 && (
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabelDiscount}>Coupon Discount</Text>
                  <Text style={styles.summaryValueDiscount}>-₹{discount}</Text>
                </View>
              )}
              <View style={styles.divider} />
              <View style={styles.summaryRow}>
                <Text style={styles.finalTotalLabel}>Grand Total</Text>
                <Text style={styles.finalTotalValue}>₹{finalTotal}</Text>
              </View>
            </View>

            <View style={styles.paymentSection}>
              <Text style={styles.sectionTitle}>Payment Method</Text>
              <View style={styles.paymentOptions}>
                <TouchableOpacity 
                  style={[styles.paymentOption, paymentMethod === 'Online' && styles.paymentOptionActive]}
                  onPress={() => setPaymentMethod('Online')}
                >
                  <Text style={[styles.paymentOptionText, paymentMethod === 'Online' && styles.paymentOptionTextActive]}>Pay Online</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.paymentOption, paymentMethod === 'COD' && styles.paymentOptionActive]}
                  onPress={() => setPaymentMethod('COD')}
                >
                  <Text style={[styles.paymentOptionText, paymentMethod === 'COD' && styles.paymentOptionTextActive]}>Cash on Delivery</Text>
                </TouchableOpacity>
              </View>
            </View>

          </ScrollView>

          <View style={styles.checkoutBar}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total To Pay</Text>
              <Text style={styles.totalAmount}>₹{finalTotal}</Text>
            </View>
            <TouchableOpacity 
              style={[styles.checkoutBtn, hasOOCItems && styles.disabledBtn]} 
              onPress={handleCheckout}
              disabled={hasOOCItems}
            >
              <Text style={styles.checkoutBtnText}>
                {hasOOCItems ? 'Remove Unavailable Items' : 'Proceed to Checkout'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Your cart is empty</Text>
          <TouchableOpacity style={styles.browseBtn} onPress={() => navigation.navigate('Home')}>
            <Text style={styles.browseBtnText}>Browse Products</Text>
          </TouchableOpacity>
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
  },
  scrollContent: {
    padding: 15,
    paddingBottom: 40,
  },
  packetContainer: {
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  packetTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 8,
  },
  cartItem: {
    flexDirection: 'row',
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  outOfStockItem: {
    backgroundColor: '#fffafa',
    opacity: 0.8,
  },
  itemImage: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
    marginRight: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
    color: '#111',
  },
  itemQuantity: {
    fontSize: 12,
    color: '#777',
    marginBottom: 5,
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#111',
  },
  strikethrough: {
    textDecorationLine: 'line-through',
    color: '#d32f2f',
  },
  outOfStockText: {
    color: '#d32f2f',
    fontWeight: 'bold',
    fontSize: 11,
    marginTop: 5,
  },
  alternativeText: {
    color: '#666',
    fontSize: 10,
    marginTop: 2,
  },
  movePacketBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    backgroundColor: '#e6f2ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  movePacketText: {
    color: '#0066cc',
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 4,
  },
  actionContainer: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
    padding: 4,
  },
  controlBtn: {
    padding: 4,
  },
  quantityText: {
    marginHorizontal: 10,
    fontWeight: 'bold',
  },
  removeBtn: {
    marginTop: 10,
    padding: 5,
  },
  couponSection: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#111',
  },
  couponRow: {
    flexDirection: 'row',
  },
  couponInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
    marginRight: 10,
    backgroundColor: '#f9f9f9',
  },
  applyBtn: {
    backgroundColor: '#1C8A3B',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  applyBtnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  appliedText: {
    color: '#1C8A3B',
    fontWeight: 'bold',
    fontSize: 12,
    marginTop: 8,
  },
  billSummary: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    color: '#555',
    fontSize: 13,
  },
  summaryValue: {
    color: '#111',
    fontWeight: '500',
    fontSize: 13,
  },
  summaryLabelDiscount: {
    color: '#1C8A3B',
    fontSize: 13,
  },
  summaryValueDiscount: {
    color: '#1C8A3B',
    fontWeight: 'bold',
    fontSize: 13,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 10,
  },
  finalTotalLabel: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#111',
  },
  finalTotalValue: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#111',
  },
  paymentSection: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
  },
  paymentOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  paymentOption: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  paymentOptionActive: {
    borderColor: '#1C8A3B',
    backgroundColor: '#e8f5e9',
  },
  paymentOptionText: {
    color: '#555',
    fontWeight: '500',
  },
  paymentOptionTextActive: {
    color: '#1C8A3B',
    fontWeight: 'bold',
  },
  checkoutBar: {
    backgroundColor: '#fff',
    padding: 15,
    paddingBottom: 25,
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  totalLabel: {
    fontSize: 14,
    color: '#555',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111',
  },
  checkoutBtn: {
    backgroundColor: '#1C8A3B',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  disabledBtn: {
    backgroundColor: '#999',
  },
  checkoutBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  browseBtn: {
    backgroundColor: '#1C8A3B',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  browseBtnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  refundContainer: {
    padding: 30,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  refundTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1C8A3B',
  },
  successText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 30,
  },
  backHomeBtn: {
    backgroundColor: '#eee',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
    marginBottom: 15,
  },
  backHomeText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
  trackBtn: {
    backgroundColor: '#F8CB46',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  trackBtnText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#000',
  }
});
