import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppContext } from '../context/AppContext';
import { ArrowLeft } from 'lucide-react-native';

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

  const displayStock = stock.filter(item => item.categoryId === selectedCategory);

  const renderCategory = ({ item }) => {
    const isActive = selectedCategory === item.id;
    return (
      <TouchableOpacity 
        style={[styles.categoryTab, isActive && styles.categoryTabActive, isDark && styles.bgDarkLine]}
        onPress={() => setSelectedCategory(item.id)}
      >
        {isActive && <View style={styles.activeIndicator} />}
        <Text style={styles.categoryIcon}>{item.icon}</Text>
        <Text style={[styles.categoryText, isActive && styles.categoryTextActive, isDark && !isActive && styles.textDim]}>
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

  return (
    <SafeAreaView style={[styles.container, isDark && styles.bgDark]}>
      <View style={[styles.header, isDark && styles.bgDarkLine]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft size={24} color={isDark ? "#fff" : "#000"} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, isDark && styles.textLight]}>Categories</Text>
      </View>

      <View style={styles.body}>
        {/* Left Sidebar */}
        <View style={[styles.sidebar, isDark && styles.bgDark]}>
          <FlatList
            data={categories}
            renderItem={renderCategory}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
          />
        </View>

        {/* Right Content */}
        <View style={[styles.content, isDark && styles.bgDarkLine]}>
          <FlatList
            data={displayStock}
            renderItem={renderProduct}
            keyExtractor={item => item.id}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.productList}
            ListEmptyComponent={() => (
              <Text style={{ textAlign: 'center', marginTop: 20, color: '#888' }}>
                No items in this category.
              </Text>
            )}
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
  bgDark: {
    backgroundColor: '#121212',
  },
  bgDarkLine: {
    backgroundColor: '#1e1e1e',
    borderColor: '#333',
  },
  cardDark: {
    backgroundColor: '#1e1e1e',
  },
  textLight: {
    color: '#fff',
  },
  textDim: {
    color: '#999',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
  },
  backBtn: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  body: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    width: 85,
    backgroundColor: '#f5f5f5',
    borderRightWidth: 1,
    borderColor: '#eee',
  },
  categoryTab: {
    paddingVertical: 15,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#f5f5f5',
  },
  categoryTabActive: {
    backgroundColor: '#fff',
  },
  activeIndicator: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: '#1C8A3B',
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  categoryText: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 2,
  },
  categoryTextActive: {
    color: '#111',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    backgroundColor: '#fff',
  },
  productList: {
    padding: 10,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  productCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 6,
    backgroundColor: '#fafafa',
    borderRadius: 6,
    padding: 4,
  },
  productImage: {
    width: 70,
    height: 70,
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
    fontSize: 11,
    fontWeight: '600',
    color: '#111',
    minHeight: 30,
    lineHeight: 14,
  },
  productQuantity: {
    fontSize: 10,
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
    fontSize: 13,
    fontWeight: 'bold',
    color: '#111',
  },
  originalPrice: {
    fontSize: 11,
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
    fontSize: 11,
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
  }
});
