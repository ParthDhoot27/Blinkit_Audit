import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppContext } from '../context/AppContext';

export default function AllItemsScreen({ route, navigation }) {
  const initialCategory = route.params?.categoryId || '1';
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const { stock, currentUser, addToCart, theme } = useAppContext();
  
  const isDark = theme === 'dark';

  const handleAddToCart = (product) => {
    if (!currentUser) {
      navigation.navigate('Login');
      return;
    }
    addToCart(product);
  };

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

  const filteredStock = stock.filter(item => item.categoryId === selectedCategory);

  const renderCategory = ({ item }) => {
    const isActive = selectedCategory === item.id;
    return (
      <TouchableOpacity 
        style={[styles.categoryTab, isActive && styles.categoryTabActive, isDark && styles.bgDarkLine]}
        onPress={() => setSelectedCategory(item.id)}
      >
        <View style={[styles.categoryIcon, isActive && styles.categoryIconActive]}>
           <Text style={{ fontSize: 20 }}>{item.icon}</Text>
        </View>
        <Text style={[styles.categoryText, isActive && styles.categoryTextActive, isDark && styles.textLight]}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderProduct = ({ item }) => {
    const isOutOfStock = item.stock <= 0;

    return (
      <TouchableOpacity
        style={[styles.productCard, isDark && styles.cardDark]}
        onPress={() => navigation.navigate('Product', { productId: item.id })}
        activeOpacity={0.85}
      >
        <View style={[styles.imageContainer, isDark && styles.bgDarkLine]}>
          <Image
            source={{ uri: item.image }}
            style={styles.productImage}
            resizeMode="contain"
          />
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
              <Text style={styles.outOfStockText}>Out of{'\n'}Stock</Text>
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

  return (
    <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
           <Text style={{ fontSize: 24 }}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, isDark && styles.textLight]}>Buy Everything</Text>
      </View>

      <View style={styles.content}>
        {/* Left Sidebar Categories */}
        <View style={[styles.sidebar, isDark && styles.sidebarDark]}>
          <FlatList
            data={categories}
            renderItem={renderCategory}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
          />
        </View>

        {/* Right Product Grid */}
        <View style={styles.mainGrid}>
          <Text style={[styles.categoryHeading, isDark && styles.textLight]}>
            {categories.find(c => c.id === selectedCategory)?.name}
          </Text>
          <FlatList
            data={filteredStock}
            renderItem={renderProduct}
            keyExtractor={item => item.id}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            columnWrapperStyle={styles.gridRow}
          />
        </View>
      </View>
    </SafeAreaView>
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
  sidebarDark: {
    backgroundColor: '#1a1a1a',
    borderRightColor: '#333',
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backBtn: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#000',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    width: 90,
    borderRightWidth: 1,
    borderRightColor: '#f0f0f0',
    backgroundColor: '#f9f9f9',
  },
  categoryTab: {
    paddingVertical: 15,
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: 'transparent',
  },
  categoryTabActive: {
    backgroundColor: '#fff',
    borderLeftColor: '#F8CB46',
  },
  categoryIcon: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
    borderWidth: 1,
    borderColor: '#eee',
  },
  categoryIconActive: {
    backgroundColor: '#fff9c4',
    borderColor: '#F8CB46',
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '700',
    textAlign: 'center',
    color: '#666',
    paddingHorizontal: 4,
  },
  categoryTextActive: {
    color: '#000',
  },
  mainGrid: {
    flex: 1,
    padding: 10,
  },
  categoryHeading: {
    fontSize: 16,
    fontWeight: '900',
    color: '#000',
    marginBottom: 15,
    marginLeft: 5,
  },
  gridRow: {
    justifyContent: 'space-between',
    gap: 10,
  },
  productCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    maxWidth: '48%',
  },
  imageContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 10,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
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
    fontWeight: '900',
    color: '#777',
    backgroundColor: '#f0f0f0',
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },
  productName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#000',
    minHeight: 34,
    lineHeight: 16,
  },
  productQuantity: {
    fontSize: 11,
    color: '#888',
    marginTop: 2,
    marginBottom: 12,
    fontWeight: '500',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '900',
    color: '#000',
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
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  addButtonText: {
    color: '#1C8A3B',
    fontWeight: '900',
    fontSize: 11,
  },
  outOfStockBadge: {
    backgroundColor: '#ffebee',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  outOfStockText: {
    color: '#d32f2f',
    fontSize: 9,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
