import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, TextInput, ScrollView, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppContext } from '../context/AppContext';

export default function HomeScreen({ navigation }) {
  const { stock, isEssentialMode, currentUser, addToCart, theme } = useAppContext();
  
  const isDark = theme === 'dark';
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showSearch, setShowSearch] = useState(false);

  const categories = [
    { id: '1', name: '🥦 Vegetables' },
    { id: '2', name: '🥛 Dairy & Bread' },
    { id: '3', name: '🍪 Snacks' },
    { id: '4', name: '🥤 Beverages' },
    { id: '5', name: '🍬 Sweets' },
    { id: '6', name: '🧹 Cleaning' },
    { id: '7', name: '💊 Healthcare' },
  ];

  const handleAddToCart = (product) => {
    if (!currentUser) {
      navigation.navigate('Login');
      return;
    }
    addToCart(product);
  };

  const renderProduct = ({ item }) => {
    // Use LIVE stock from context, not the stale item.stock
    const liveStock = stock.find(s => s.id === item.id);
    const isOutOfStock = !liveStock || liveStock.stock <= 0;

    return (
      <TouchableOpacity
        style={styles.productCard}
        onPress={() => navigation.navigate('Product', { productId: item.id })}
        activeOpacity={0.85}
      >
        <View style={styles.imageContainer}>
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

  const displayStock = stock.filter(item => {
    if (selectedCategory && item.categoryId !== selectedCategory) return false;
    return true;
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
          <TouchableOpacity
            style={styles.profileBtn}
            onPress={() => navigation.navigate(currentUser ? 'Profile' : 'Login')}
          >
            <Text style={styles.profileBtnText}>
              {currentUser ? currentUser.name.charAt(0) : '👤'}
            </Text>
          </TouchableOpacity>
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
        {/* Banner (Hidden in Essential Mode) */}
        {!isEssentialMode && (
          <View style={styles.bannerContainer}>
            <View style={styles.bannerCard}>
              <View style={styles.bannerContent}>
                <Text style={styles.bannerTitle}>Get 20% off</Text>
                <Text style={styles.bannerSub}>on your first order!</Text>
                <View style={styles.bannerBtn}>
                  <Text style={styles.bannerBtnText}>Order Now</Text>
                </View>
              </View>
              <Text style={styles.bannerEmoji}>🛒</Text>
            </View>
          </View>
        )}

        {/* Categories */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Shop by Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity 
              style={[styles.categoryBadge, selectedCategory === null && styles.categoryBadgeActive]} 
              activeOpacity={0.7}
              onPress={() => setSelectedCategory(null)}
            >
              <Text style={[styles.categoryText, selectedCategory === null && styles.categoryTextActive]}>All</Text>
            </TouchableOpacity>
            {categories.map(cat => (
              <TouchableOpacity 
                key={cat.id} 
                style={[styles.categoryBadge, selectedCategory === cat.id && styles.categoryBadgeActive]} 
                activeOpacity={0.7}
                onPress={() => setSelectedCategory(cat.id)}
              >
                <Text style={[styles.categoryText, selectedCategory === cat.id && styles.categoryTextActive]}>{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Product Grid */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, isDark && styles.textLight]}>{selectedCategory ? 'Products' : '🔥 Bestsellers'}</Text>
          {displayStock.length === 0 ? (
            <Text style={{ textAlign: 'center', marginTop: 20, color: '#666' }}>No products found in this category.</Text>
          ) : (
            <FlatList
              data={displayStock}
              renderItem={renderProduct}
              keyExtractor={item => item.id}
              numColumns={3}
              scrollEnabled={false}
              columnWrapperStyle={styles.row}
            />
          )}
        </View>
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
    top: 100, // Below the header
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
    paddingBottom: 4,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#111',
  },
  categoryBadge: {
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  categoryBadgeActive: {
    backgroundColor: '#1C8A3B',
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },
  categoryTextActive: {
    color: '#fff',
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
