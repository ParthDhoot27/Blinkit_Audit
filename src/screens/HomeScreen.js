import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, TextInput, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useAppContext } from '../context/AppContext';

const { width } = Dimensions.get('window');

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
          <Image source={{ uri: item.image }} style={styles.productImage} resizeMode="contain" />
        </View>
        <View style={styles.deliveryBadge}>
          <Text style={styles.deliveryText}>⏱ 8 MINS</Text>
        </View>
        <Text style={[styles.productName, isDark && styles.textLight]} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.productQuantity}>{item.quantity}</Text>
        <View style={styles.priceRow}>
          <View style={{ flexDirection: 'row' }}>
            <Text style={[styles.productPrice, isDark && styles.textLight]}>₹{item.price}</Text>
            {item.originalPrice && (
              <Text style={styles.originalPrice}>₹{item.originalPrice}</Text>
            )}
            {isOutOfStock ? (
              <View style={styles.outOfStockBadge}>
                <Text style={styles.outOfStockText}>x</Text>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => handleAddToCart(item)}
                activeOpacity={0.7}
              >
                <Text style={styles.addButtonText}>+</Text>
              </TouchableOpacity>
            )}
          </View>
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
    ? stock.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5)
    : [];

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <StatusBar style="dark" backgroundColor="#F8CB46" translucent={false} />
      <SafeAreaView edges={['top']} style={{ backgroundColor: '#F8CB46' }} />
      <View style={{ flex: 1, backgroundColor: isDark ? '#121212' : '#fff' }}>
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
              <ScrollView showsVerticalScrollIndicator={true} style={{ maxHeight: 250 }}>
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
                    <Image source={{ uri: item.image }} style={styles.searchResultImage} resizeMode="contain" />
                    <View>
                      <Text style={styles.searchResultName}>{item.name}</Text>
                      <Text style={styles.searchResultPrice}>₹{item.price}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
                {searchQuery.length > 0 && (
                  <TouchableOpacity
                    style={styles.moreResultsBtn}
                    onPress={() => {
                      navigation.navigate('AllItems', { searchQuery });
                      setSearchQuery('');
                      setShowSearch(false);
                    }}
                  >
                    <Text style={styles.moreResultsText}>See more results for "{searchQuery}"</Text>
                  </TouchableOpacity>
                )}
              </ScrollView>
            </View>
          )}
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
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
                  <View style={styles.categoryIconCircle}>
                    <Text style={styles.categoryCardIcon}>{cat.icon}</Text>
                  </View>
                  <Text style={[styles.categoryCardText, isDark && styles.textLight]}>{cat.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
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

            {/* Scrollable Categories in Best Sellers */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.bsCategories}>
              {categories.map(cat => (
                <TouchableOpacity
                  key={`bs-${cat.id}`}
                  style={[styles.bsCategoryBtn, isDark && styles.cardDark]}
                  onPress={() => navigation.navigate('AllItems', { categoryId: cat.id })}
                >
                  <Text style={styles.bsCategoryIcon}>{cat.icon}</Text>
                  <Text style={[styles.bsCategoryText, isDark && styles.textLight]}>{cat.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

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
                    onPress={() => navigation.navigate('Review', { productId: item.id })}
                  >
                    <Image source={{ uri: item.image }} style={styles.reviewItemImage} resizeMode="contain" />
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
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    paddingVertical: 22,
    // paddingBottom: 15,
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
    borderRadius: 25,
    paddingHorizontal: 12,
    height: 48,
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
    color: '#000',
    fontWeight: '500',
  },
  searchResultsContainer: {
    position: 'absolute',
    top: 105,
    left: 15,
    right: 15,
    backgroundColor: '#fff',
    borderRadius: 16,
    zIndex: 1000,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    padding: 8,
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingHorizontal: 10,
  },
  searchResultImage: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  searchResultName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  searchResultPrice: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1C8A3B',
    marginTop: 2,
  },
  moreResultsBtn: {
    padding: 12,
    alignItems: 'center',
  },
  moreResultsText: {
    color: '#666',
    fontSize: 12,
    fontWeight: '500',
  },
  bannerContainer: {
    padding: 12,
  },
  bannerCard: {
    backgroundColor: '#1a472a',
    borderRadius: 20,
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
    borderRadius: 10,
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
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 12,
    color: '#000',
  },
  bsCategories: {
    marginBottom: 15,
  },
  bsCategoryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  bsCategoryIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  bsCategoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  seeAllBtn: {
    backgroundColor: '#e8f5e9',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  seeAllBtnText: {
    color: '#1C8A3B',
    fontWeight: 'bold',
    fontSize: 14,
  },
  categoryCard: {
    alignItems: 'center',
    width: 60,
    marginRight: 10,
  },
  categoryIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: '#f9f9f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  categoryCardIcon: {
    fontSize: 32,
  },
  categoryCardText: {
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
    color: '#222',
  },
  reviewItemCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    marginRight: 10,
    width: 130,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  reviewItemImage: {
    width: 70,
    height: 70,
    marginBottom: 10,
  },
  reviewItemName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
    marginBottom: 8,
  },
  reviewItemAction: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#F8CB46',
  },
  row: {
    justifyContent: 'flex-start',
    marginBottom: 2,
    gap: 10,
  },
  productCard: {
    width: '31%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 5,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  cardDark: {
    backgroundColor: '#1e1e1e',
    borderColor: '#333',
  },
  bgDarkLine: {
    backgroundColor: '#2a2a2a',
  },
  imageContainer: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 5,
    height: 50,
    marginBottom: 2,
    justifyContent: 'center',
    width: '100%',
    resizeMode: 'cover',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  deliveryBadge: {
    marginBottom: 6,
  },
  deliveryText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#666',
    backgroundColor: '#f0f0f0',
    alignSelf: 'flex-start',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },
  productName: {
    fontSize: 11,
    fontWeight: '700',
    color: '#000',
    minHeight: 32,
    lineHeight: 15,
  },
  productQuantity: {
    fontSize: 10,
    color: '#888',
    marginBottom: 10,
    marginTop: 2,
  },
  priceRow: {
    flexDirection: 'column',
    gap: 8,
  },
  productPrice: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#000',
  },
  originalPrice: {
    fontSize: 8,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  addButton: {
    backgroundColor: '#F8CB46',
    borderRadius: 10,
    paddingVertical: 6,
    alignItems: 'center',
    width: 30,
    marginLeft: 'auto',

  },
  addButtonText: {
    color: '#000000',
    fontWeight: 'bold',
    fontSize: 12,
  },
  outOfStockBadge: {
    backgroundColor: '#ffebee',
    borderRadius: 10,
    paddingVertical: 6,
    width: 30,
    marginLeft: 'auto',
  },
  outOfStockText: {
    color: '#d32f2f',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  floatingCart: {
    position: 'absolute',
    bottom: 20,
    left: 15,
    right: 15,
    backgroundColor: '#1C8A3B',
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  cartInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartBadge: {
    backgroundColor: '#F8CB46',
    borderRadius: 6,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cartBadgeText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 13,
  },
  cartItemsText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 15,
  },
  viewCartText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  }
});
