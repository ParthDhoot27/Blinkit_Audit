import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppContext } from '../context/AppContext';
import { Minus, Plus, Trash2, ArrowRightLeft, Info, ChevronRight } from 'lucide-react-native';

export default function CartScreen({ navigation }) {
  const {
    currentUser,
    stock,
    updateCartQuantity,
    removeFromCart,
    checkout,
    moveItemToPacket,
    theme
  } = useAppContext();

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('Online');

  const isDark = theme === 'dark';

  if (!currentUser) {
    return (
      <View style={[styles.centerContainer, isDark && styles.bgDark]}>
        <Text style={[isDark && styles.textLight]}>Please login to view cart</Text>
        <TouchableOpacity style={styles.browseBtn} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.browseBtnText}>Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const cartItems = currentUser.cart || [];
  const packet1Items = cartItems.filter(item => item.packet === 1 || !item.packet);
  const packet2Items = cartItems.filter(item => item.packet === 2);

  const itemTotal = cartItems.reduce((total, item) => {
    const currentStockItem = stock.find(s => s.id === item.id);
    if (currentStockItem && currentStockItem.stock > 0) {
      return total + (item.price * item.cartQuantity);
    }
    return total;
  }, 0);

  const deliveryFee = itemTotal > 0 ? 15 : 0;
  let discount = 0;
  if (appliedCoupon === 'WELCOME20') discount = Math.floor(itemTotal * 0.2);
  else if (appliedCoupon === 'FREEDELIVERY') discount = deliveryFee;

  const finalTotal = itemTotal + deliveryFee - discount;

  const handleApplyCoupon = () => {
    const code = couponCode.toUpperCase().trim();
    if (code === 'WELCOME20' || code === 'FREEDELIVERY') {
      setAppliedCoupon(code);
      Alert.alert("Coupon Applied!", `You are saving with ${code}`);
    } else {
      Alert.alert("Invalid Coupon", "Try WELCOME20");
    }
  };

  const handleCheckout = () => {
    if (itemTotal === 0) return;
    const success = checkout(paymentMethod);
    if (success) {
      navigation.navigate('Tracking');
    }
  };

  const renderCartItem = (item) => {
    const currentStockItem = stock.find(s => s.id === item.id);
    const isOutOfStock = !currentStockItem || currentStockItem.stock <= 0;
    const currentPacket = item.packet || 1;

    return (
      // items cards
      <View key={item.id} style={[styles.cartItem, isOutOfStock && styles.outOfStockItem, isDark && styles.cardDark]}>
        <View style={styles.itemMain}>
          <Image source={{ uri: item.image }} style={styles.itemImage} resizeMode="contain" />
          <View style={styles.itemDetails}>
            <Text style={[styles.itemName, isOutOfStock && styles.strikethrough, isDark && styles.textLight]}>{item.name}</Text>
            <Text style={styles.itemWeight}>{item.quantity}</Text>
            <Text style={[styles.itemPrice, isDark && styles.textLight]}>₹{item.price}</Text>

            {item.isCold && !isOutOfStock && (
              <TouchableOpacity
                style={styles.packetBadge}
                onPress={() => moveItemToPacket(item.id, currentPacket === 1 ? 2 : 1)}
              >
                <Text style={styles.packetBadgeText}>
                  {currentPacket === 1 ? 'Move to Cold Packet' : 'Tap to remove ❄️'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.itemActions}>
          {!isOutOfStock ? (
            <View style={styles.qtyContainer}>
              <TouchableOpacity onPress={() => updateCartQuantity(item.id, -1)} style={styles.qtyBtn}>
                <Minus size={14} color="#1C8A3B" />
              </TouchableOpacity>
              <Text style={styles.qtyText}>{item.cartQuantity}</Text>
              <TouchableOpacity onPress={() => updateCartQuantity(item.id, 1)} style={styles.qtyBtn}>
                <Plus size={14} color="#1C8A3B" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity onPress={() => removeFromCart(item.id)} style={styles.removeBtnLarge}>
              <Text style={styles.removeBtnText}>Remove</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, isDark && styles.bgDark]}>
      {cartItems.length > 0 ? (
        <View style={{ flex: 1 }}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

            <View style={styles.deliveryInfo}>
              <Text style={styles.deliveryTitle}>Delivering to Home</Text>
              <Text style={styles.deliveryAddress} numberOfLines={1}>{currentUser.address.building}, {currentUser.address.city}</Text>
            </View>

            {packet1Items.length > 0 && (
              <View style={styles.section}>
                <Text style={[styles.sectionHeading, isDark && styles.textLight]}>📦 Packet 1 (Regular)</Text>
                {packet1Items.map(item => renderCartItem(item))}
              </View>
            )}

            {packet2Items.length > 0 && (
              <View style={styles.section}>
                <Text style={[styles.sectionHeading, isDark && styles.textLight]}>❄️ Packet 2 (Cold/Fragile)</Text>
                {packet2Items.map(item => renderCartItem(item))}
              </View>
            )}

            <View style={[styles.card, isDark && styles.cardDark]}>
              <Text style={[styles.cardTitle, isDark && styles.textLight]}>Offers & Benefits</Text>
              <View style={styles.couponRow}>
                <TextInput
                  style={[styles.couponInput, isDark && styles.bgDarkLine, isDark && styles.textLight]}
                  placeholder="Enter coupon code"
                  placeholderTextColor="#999"
                  value={couponCode}
                  onChangeText={setCouponCode}
                />
                <TouchableOpacity style={styles.applyBtn} onPress={handleApplyCoupon}>
                  <Text style={styles.applyBtnText}>APPLY</Text>
                </TouchableOpacity>
              </View>
              {appliedCoupon && <Text style={styles.appliedSuccess}>✓ {appliedCoupon} applied!</Text>}
            </View>

            <View style={[styles.card, isDark && styles.cardDark]}>
              <Text style={[styles.cardTitle, isDark && styles.textLight]}>Bill Summary</Text>
              <View style={styles.billRow}>
                <Text style={styles.billLabel}>Item Total</Text>
                <Text style={[styles.billValue, isDark && styles.textLight]}>₹{itemTotal}</Text>
              </View>
              <View style={styles.billRow}>
                <Text style={styles.billLabel}>Delivery Charge</Text>
                <Text style={[styles.billValue, isDark && styles.textLight]}>₹{deliveryFee}</Text>
              </View>
              {discount > 0 && (
                <View style={styles.billRow}>
                  <Text style={styles.discountLabel}>Coupon Discount</Text>
                  <Text style={styles.discountValue}>-₹{discount}</Text>
                </View>
              )}
              <View style={styles.divider} />
              <View style={styles.billRow}>
                <Text style={[styles.grandTotalLabel, isDark && styles.textLight]}>Grand Total</Text>
                <Text style={[styles.grandTotalValue, isDark && styles.textLight]}>₹{finalTotal}</Text>
              </View>
            </View>

            <View style={[styles.card, isDark && styles.cardDark]}>
              <Text style={[styles.cardTitle, isDark && styles.textLight]}>Cancellation Policy</Text>
              <Text style={styles.policyText}>
                Orders cannot be cancelled once packed for delivery. In case of unexpected issues, a refund will be initiated.
              </Text>
            </View>

          </ScrollView>

          <View style={[styles.footer, isDark && styles.bgDark]}>
            <View style={styles.paymentMethodRow}>
              <Text style={[styles.pmLabel, isDark && styles.textLight]}>Payment: {paymentMethod}</Text>
              <TouchableOpacity onPress={() => setPaymentMethod(paymentMethod === 'Online' ? 'COD' : 'Online')}>
                <Text style={styles.changePmText}>CHANGE</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout}>
              <View>
                <Text style={styles.totalPayText}>₹{finalTotal}</Text>
                <Text style={styles.totalSubText}>TOTAL</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.placeOrderText}>Place Order</Text>
                <ChevronRight color="#fff" size={20} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={[styles.emptyContainer, isDark && styles.bgDark]}>
          <Text style={[styles.emptyText, isDark && styles.textLight]}>Your cart is empty</Text>
          <TouchableOpacity style={styles.browseBtn} onPress={() => navigation.navigate('Home')}>
            <Text style={styles.browseBtnText}>Start Shopping</Text>
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
  bgDark: {
    backgroundColor: '#121212',
  },
  cardDark: {
    backgroundColor: '#1e1e1e',
    borderColor: '#333',
  },
  bgDarkLine: {
    backgroundColor: '#2a2a2a',
  },
  textLight: {
    color: '#fff',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 16,
    paddingTop: 0,
    paddingBottom: 130,
  },
  deliveryInfo: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  deliveryTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  deliveryAddress: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000',
    marginTop: 4,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '900',
    color: '#000',
    marginBottom: 12,
    marginLeft: 4,
  },
  cartItem: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 10,
    marginBottom: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
  },
  itemMain: {
    flexDirection: 'row',
    flex: 1,
    alignContent: "center",
    alignItems: "center"
  },
  itemImage: {
    width: 55,
    height: 70,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
  },
  itemWeight: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000',
    marginTop: 4,
  },
  packetBadge: {
    marginTop: 5,
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 6,
    paddingVertical: 5,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  packetBadgeText: {
    fontSize: 10,
    color: '#1C8A3B',
    fontWeight: '800',
  },
  itemActions: {
    marginLeft: 10,
  },
  qtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#1C8A3B',
    borderRadius: 12,
    padding: 4,
  },
  qtyBtn: {
    padding: 5,
  },
  qtyText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#1C8A3B',
    marginHorizontal: 8,
  },
  removeBtnLarge: {
    backgroundColor: '#ffebee',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  removeBtnText: {
    color: '#d32f2f',
    fontSize: 12,
    fontWeight: 'bold',
  },
  strikethrough: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#000',
    marginBottom: 15,
  },
  couponRow: {
    flexDirection: 'row',
    gap: 10,
  },
  couponInput: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 48,
    fontSize: 14,
    color: '#000',
    fontWeight: '600',
  },
  applyBtn: {
    backgroundColor: '#1C8A3B',
    justifyContent: 'center',
    paddingHorizontal: 15,
    borderRadius: 12,
  },
  applyBtnText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 13,
  },
  appliedSuccess: {
    color: '#1C8A3B',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 10,
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 7,
  },
  billLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  billValue: {
    fontSize: 14,
    color: '#000',
    fontWeight: '600',
  },
  discountLabel: {
    fontSize: 14,
    color: '#1C8A3B',
    fontWeight: '600',
  },
  discountValue: {
    fontSize: 14,
    color: '#1C8A3B',
    fontWeight: '800',
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 15,
  },
  grandTotalLabel: {
    fontSize: 16,
    fontWeight: '900',
    color: '#000',
  },
  grandTotalValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#000',
  },
  policyText: {
    fontSize: 12,
    color: '#888',
    lineHeight: 18,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 15,
    paddingBottom: 30,
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  paymentMethodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  pmLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000',
  },
  changePmText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#1C8A3B',
  },
  checkoutBtn: {
    backgroundColor: '#1C8A3B',
    borderRadius: 16,
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  totalPayText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '900',
  },
  totalSubText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 10,
    fontWeight: 'bold',
  },
  placeOrderText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '900',
    marginRight: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    fontWeight: '600',
    marginBottom: 20,
  },
  browseBtn: {
    backgroundColor: '#1C8A3B',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 16,
  },
  browseBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  }
});
