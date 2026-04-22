import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppContext } from '../context/AppContext';

export default function HomeScreen({ navigation }) {
  const { stock, isEssentialMode, currentUser, addToCart, theme } = useAppContext();
  
  const isDark = theme === 'dark';
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const categories = [
    { id: '1', name: 'Vegetables', icon: '🥦' },
    { id: '2', name: 'Dairy & Bread', icon: '🥛' },
    { id: '3', name: 'Snacks', icon: '🍪' },
    { id: '4', name: 'Beverages', icon: '🥤' },
    { id: '5', name: 'Sweets', icon: '🍬' },
    { id: '6', name: 'Cleaning', icon: '🧹' },
    { id: '7', name: 'Healthcare', icon: '💊' },
    { id: '8', name: 'Personal Care', icon: '🧴' },
  ];

  const handleAddToCart = (product) => {
    if (!currentUser) {
      navigation.navigate('Login');
      return;
    }
    addToCart(product);
  };

  const renderProduct = ({ item, isHorizontal }) => {
    const liveStock = stock.find(s => s.id === item.id);
    const isOutOfStock = !liveStock || liveStock.stock <= 0;

    return (
      <TouchableOpacity
        style={[styles.productCard, isDark && styles.cardDark, isHorizontal && { width: '100%' }]}
        onPress={() => navigation.navigate('Product', { productId: item.id })}
        activeOpacity={0.85}
      >
        <View style={[styles.imageContainer, isDark && styles.bgDarkLine]}>
          <Image source={{ uri: item.image }} style={styles.productImage} />
        </View>
        <View style={styles.deliveryBadge}>
          <Text style={styles.deliveryText}>⏱ 8 MINS</Text>
        </View>
        <Text style={[styles.productName, isDark && styles.textLight]} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.productQuantity}>{item.quantity}</Text>
        <View style={styles.priceRow}>
          <View>
            <Text style={[styles.productPrice, isDark && styles.textLight]}>₹{item.price}</Text>
            {item.originalPrice && (
              <Text style={styles.originalPrice}>₹{item.originalPrice}</Text>
            )}
          </View>
          {isOutOfStock ? (
            <View style={styles.outOfStockBadge}>
              <Text style={styles.outOfStockText}>Out{'\n'}of Stock</Text>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => handleAddToCart(item)}
              activeOpacity={0.7}
            >
              <Text style={styles.addButtonText}>ADD</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const cartCount = currentUser ? currentUser.cart.reduce((sum, item) => sum + item.cartQuantity, 0) : 0;
  
  // Best Sellers (first 9 items)
  const bestSellers = stock.slice(0, 9);

  // Buy Again & Review items
  const deliveredOrders = currentUser?.orders?.filter(o => o.status === 'Delivered') || [];
  let pastItems = [];
  deliveredOrders.forEach(order => {
    order.items.forEach(item => {
      if (!pastItems.find(p => p.id === item.id)) {
        pastItems.push(item);
      }
    });
  });

  const searchResults = searchQuery.trim().length > 0
    ? stock.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  return (
    <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.locationRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.deliveryTitle}>Delivery in 8 minutes</Text>
            <Text style={styles.addressText} numberOfLines={1}>
              📍 {currentUser ? `${currentUser.address.building}, ${currentUser.address.city}` : 'Select your location ▾'}
            </Text>
          </View>
          <View style={styles.headerButtons}>
            <TouchableOpacity
              style={styles.ordersBtn}
              onPress={() => navigation.navigate(currentUser ? 'Tracking' : 'Login')}
            >
              <Text style={styles.ordersBtnText}>📦</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.profileBtn}
              onPress={() => navigation.navigate(currentUser ? 'Profile' : 'Login')}
            >
              <Text style={styles.profileBtnText}>
                {currentUser ? currentUser.name.charAt(0) : '👤'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            placeholder="Search 'milk'"
            style={styles.searchInput}
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={text => {
              setSearchQuery(text);
              setShowSearch(text.length > 0);
            }}
            onFocus={() => setShowSearch(searchQuery.length > 0)}
          />
        </View>
        
        {showSearch && searchResults.length > 0 && (
          <View style={styles.searchResultsContainer}>
            {searchResults.map(item => (
              <TouchableOpacity 
                key={item.id} 
                style={styles.searchResultItem}
                onPress={() => {
                  setSearchQuery('');
                  setShowSearch(false);
                  navigation.navigate('Product', { productId: item.id });
                }}
              >
                <Image source={{ uri: item.image }} style={styles.searchResultImage} />
                <View>
                  <Text style={styles.searchResultName}>{item.name}</Text>
                  <Text style={styles.searchResultPrice}>₹{item.price}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Banner */}
        {!isEssentialMode && (
          <View style={styles.bannerContainer}>
            <View style={styles.bannerCard}>
              <View style={styles.bannerContent}>
                <Text style={styles.bannerTitle}>Get 20% off</Text>
                <Text style={styles.bannerSub}>on your first order!</Text>
                <TouchableOpacity 
                  style={styles.bannerBtn}
                  onPress={() => navigation.navigate('AllItems')}
                >
                  <Text style={styles.bannerBtnText}>Order Now</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.bannerEmoji}>🛒</Text>
            </View>
          </View>
        )}

        {/* 3x3 Best Sellers Grid */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, isDark && styles.textLight]}>🔥 Bestsellers</Text>
          <FlatList
            data={bestSellers}
            renderItem={renderProduct}
            keyExtractor={item => item.id}
            numColumns={3}
            scrollEnabled={false}
            columnWrapperStyle={styles.row}
          />
          <TouchableOpacity 
            style={styles.seeAllBtn}
            onPress={() => navigation.navigate('AllItems')}
          >
            <Text style={styles.seeAllBtnText}>See All Items →</Text>
          </TouchableOpacity>
        </View>

        {/* Shop by Categories (Horizontal Scroll) */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, isDark && styles.textLight]}>Shop by Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map(cat => (
              <TouchableOpacity 
                key={cat.id} 
                style={[styles.categoryCard, isDark && styles.cardDark]} 
                onPress={() => navigation.navigate('AllItems', { categoryId: cat.id })}
              >
                <Text style={styles.categoryCardIcon}>{cat.icon}</Text>
                <Text style={[styles.categoryCardText, isDark && styles.textLight]}>{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Buy Again Section */}
        {pastItems.length > 0 && (
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionTitle, isDark && styles.textLight]}>Buy Again</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {pastItems.map(item => (
                <View key={item.id} style={{ width: 130, marginRight: 10 }}>
                  {renderProduct({ item: stock.find(s => s.id === item.id) || item, isHorizontal: true })}
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Review Items Section */}
        {pastItems.length > 0 && (
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionTitle, isDark && styles.textLight]}>Review your past purchases</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {pastItems.map(item => (
                <TouchableOpacity 
                  key={`rev-${item.id}`} 
                  style={[styles.reviewItemCard, isDark && styles.cardDark]}
                  onPress={() => navigation.navigate('Product', { productId: item.id, isReviewMode: true })}
                >
                  <Image source={{ uri: item.image }} style={styles.reviewItemImage} />
                  <Text style={[styles.reviewItemName, isDark && styles.textLight]} numberOfLines={1}>{item.name}</Text>
                  <Text style={styles.reviewItemAction}>Tap to rate ⭐</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </ScrollView>

      {/* Floating Cart Button */}
      {currentUser && cartCount > 0 && (
        <TouchableOpacity
          style={styles.floatingCart}
          onPress={() => navigation.navigate('Cart')}
          activeOpacity={0.9}
        >
          <View style={styles.cartInfo}>
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartCount}</Text>
            </View>
            <Text style={styles.cartItemsText}>{cartCount} item{cartCount > 1 ? 's' : ''} in cart</Text>
          </View>
          <Text style={styles.viewCartText}>View Cart →</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  containerDark: {
    backgroundColor: '#121212',
  },
  textLight: {
    color: '#fff',
  },
  header: {
    backgroundColor: '#F8CB46',
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 15,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  deliveryTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#000',
  },
  addressText: {
    fontSize: 13,
    color: '#333',
    fontWeight: '500',
    marginTop: 2,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ordersBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  ordersBtnText: {
    fontSize: 18,
  },
  profileBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  profileBtnText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#222',
  },
  searchResultsContainer: {
    position: 'absolute',
    top: 100,
    left: 15,
    right: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    maxHeight: 250,
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    padding: 10,
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchResultImage: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    marginRight: 12,
  },
  searchResultName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  searchResultPrice: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#111',
    marginTop: 2,
  },
  bannerContainer: {
    padding: 12,
  },
  bannerCard: {
    backgroundColor: '#1a472a',
    borderRadius: 14,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bannerContent: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#F8CB46',
  },
  bannerSub: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 12,
  },
  bannerBtn: {
    backgroundColor: '#F8CB46',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    alignSelf: 'flex-start',
  },
  bannerBtnText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 13,
  },
  bannerEmoji: {
    fontSize: 60,
    marginLeft: 10,
  },
  sectionContainer: {
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#111',
  },
  seeAllBtn: {
    backgroundColor: '#e8f5e9',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 5,
  },
  seeAllBtnText: {
    color: '#1C8A3B',
    fontWeight: 'bold',
    fontSize: 14,
  },
  categoryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginRight: 10,
    alignItems: 'center',
    width: 100,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  categoryCardIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  categoryCardText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    color: '#333',
  },
  reviewItemCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    marginRight: 10,
    width: 120,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  reviewItemImage: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
    marginBottom: 8,
  },
  reviewItemName: {
    fontSize: 11,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
    marginBottom: 6,
  },
  reviewItemAction: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#F8CB46',
  },
  row: {
    justifyContent: 'flex-start',
    marginBottom: 2,
    gap: 8,
  },
  productCard: {
    width: '31%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 5,
    elevation: 2,
  },
  cardDark: {
    backgroundColor: '#1e1e1e',
  },
  bgDarkLine: {
    backgroundColor: '#1e1e1e',
    borderColor: '#333',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 6,
    backgroundColor: '#fafafa',
    borderRadius: 8,
    padding: 4,
  },
  productImage: {
    width: 65,
    height: 65,
    resizeMode: 'contain',
  },
  deliveryBadge: {
    marginBottom: 5,
  },
  deliveryText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#555',
    backgroundColor: '#f0f0f0',
    alignSelf: 'flex-start',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  productName: {
    fontSize: 10,
    fontWeight: '600',
    color: '#111',
    minHeight: 28,
    lineHeight: 14,
  },
  productQuantity: {
    fontSize: 9,
    color: '#888',
    marginBottom: 8,
    marginTop: 2,
  },
  priceRow: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 5,
  },
  productPrice: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#111',
  },
  originalPrice: {
    fontSize: 10,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  addButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#1C8A3B',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignItems: 'center',
    width: '100%',
  },
  addButtonText: {
    color: '#1C8A3B',
    fontWeight: 'bold',
    fontSize: 10,
  },
  outOfStockBadge: {
    backgroundColor: '#ffebee',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 4,
    width: '100%',
  },
  outOfStockText: {
    color: '#d32f2f',
    fontSize: 9,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 12,
  },
  floatingCart: {
    position: 'absolute',
    bottom: 16,
    left: 14,
    right: 14,
    backgroundColor: '#1C8A3B',
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 18,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  cartInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartBadge: {
    backgroundColor: '#F8CB46',
    borderRadius: 5,
    width: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  cartBadgeText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 12,
  },
  cartItemsText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  viewCartText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  }
});
