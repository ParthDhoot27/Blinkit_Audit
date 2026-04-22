import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppContext } from '../context/AppContext';
import { Star } from 'lucide-react-native';

export default function ProductScreen({ route, navigation }) {
  const { productId, product: passedProduct, isReviewMode } = route.params || {};
  const { stock, currentUser, addToCart, productReviews, submitReview } = useAppContext();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  // Handle both ways of passing the product
  const product = passedProduct || stock.find(p => p.id === productId);
  
  if (!product) {
    return <SafeAreaView><Text>Product not found</Text></SafeAreaView>;
  }

  const currentStockItem = stock.find(s => s.id === product.id);
  const isOutOfStock = currentStockItem && currentStockItem.stock <= 0;
  
  // Calculate reviews using base stats from stock.json
  const baseRating = product.rating || 0;
  const baseCount = product.reviewCount || 0;
  const thisProductReviews = productReviews.filter(r => r.productId === product.id);
  const totalReviews = baseCount + thisProductReviews.length;
  
  const avgRating = totalReviews > 0 
    ? ((baseRating * baseCount + thisProductReviews.reduce((sum, r) => sum + r.rating, 0)) / totalReviews).toFixed(1)
    : null;

  const handleAddToCart = () => {
    if (!currentUser) {
      navigation.navigate('Login');
      return;
    }
    addToCart(product);
    navigation.navigate('Cart');
  };

  const handleReviewSubmit = () => {
    if (rating === 0) {
      Alert.alert("Error", "Please select a star rating.");
      return;
    }
    submitReview(product.id, rating, comment);
    Alert.alert("Review Submitted", "Thank you for your feedback!", [
      { text: "OK", onPress: () => navigation.goBack() }
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.imageContainer}>
          <Image source={{ uri: product.image }} style={styles.image} />
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.title}>{product.name}</Text>
          <Text style={styles.quantity}>{product.quantity}</Text>
          
          {avgRating && (
            <View style={styles.avgRatingRow}>
              <Star size={16} color="#F8CB46" fill="#F8CB46" />
              <Text style={styles.avgRatingText}>{avgRating} ({totalReviews} reviews)</Text>
            </View>
          )}

          <View style={styles.priceRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.price}>₹{product.price}</Text>
              {product.originalPrice && (
                <Text style={styles.originalPrice}>₹{product.originalPrice}</Text>
              )}
            </View>
            {isOutOfStock ? (
              <View style={styles.outOfStockBadge}>
                <Text style={styles.outOfStockText}>Out of Stock</Text>
              </View>
            ) : (
              <Text style={styles.stockText}>In Stock: {currentStockItem?.stock}</Text>
            )}
          </View>

          {product.isFragile && <Text style={styles.tag}>⚠️ Fragile Item</Text>}
          {product.isCold && <Text style={styles.tag}>❄️ Cold Item</Text>}

          <View style={styles.descriptionBox}>
            <Text style={styles.descriptionTitle}>Product Details</Text>
            <Text style={styles.descriptionText}>
              High quality {product.name} delivered fresh to your door in 8 minutes.
            </Text>
          </View>

          {isReviewMode ? (
            <View style={styles.reviewSection}>
              <Text style={styles.reviewTitle}>Rate this product</Text>
              <View style={styles.starRow}>
                {[1,2,3,4,5].map(i => (
                  <TouchableOpacity key={i} onPress={() => setRating(i)}>
                    <Star size={32} color={i <= rating ? "#F8CB46" : "#ddd"} fill={i <= rating ? "#F8CB46" : "none"} />
                  </TouchableOpacity>
                ))}
              </View>
              <TextInput 
                style={styles.commentInput}
                placeholder="Write your review here..."
                multiline
                numberOfLines={4}
                value={comment}
                onChangeText={setComment}
              />
              <TouchableOpacity style={styles.submitReviewBtn} onPress={handleReviewSubmit}>
                <Text style={styles.submitReviewText}>Submit Review</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.reviewsListSection}>
              <Text style={styles.reviewsListTitle}>Customer Reviews</Text>
              {thisProductReviews.length === 0 ? (
                <Text style={styles.noReviewsText}>No reviews yet. Buy this item to be the first!</Text>
              ) : (
                thisProductReviews.map(r => (
                  <View key={r.id} style={styles.reviewCard}>
                    <View style={styles.reviewHeader}>
                      <Text style={styles.reviewerName}>{r.userName}</Text>
                      <View style={styles.reviewStars}>
                        {[1,2,3,4,5].map(i => (
                          <Star key={i} size={12} color={i <= r.rating ? "#F8CB46" : "#ddd"} fill={i <= r.rating ? "#F8CB46" : "none"} />
                        ))}
                      </View>
                    </View>
                    {r.comment ? <Text style={styles.reviewComment}>{r.comment}</Text> : null}
                  </View>
                ))
              )}
            </View>
          )}
        </View>
      </ScrollView>

      {!isReviewMode && (
        <View style={styles.bottomBar}>
          <TouchableOpacity 
            style={[styles.addToCartButton, isOutOfStock && styles.disabledButton]} 
            onPress={handleAddToCart}
            disabled={isOutOfStock}
          >
            <Text style={styles.addToCartText}>
              {isOutOfStock ? 'Currently Unavailable' : 'Add to Cart'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imageContainer: {
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
    padding: 40,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  detailsContainer: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  quantity: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  originalPrice: {
    fontSize: 16,
    color: '#999',
    textDecorationLine: 'line-through',
    marginLeft: 10,
  },
  avgRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  avgRatingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginLeft: 5,
  },
  stockText: {
    color: 'green',
    fontWeight: '600',
  },
  outOfStockBadge: {
    backgroundColor: '#ffebee',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  outOfStockText: {
    color: '#d32f2f',
    fontWeight: 'bold',
  },
  tag: {
    backgroundColor: '#f0f8ff',
    padding: 8,
    borderRadius: 6,
    marginBottom: 10,
    alignSelf: 'flex-start',
    color: '#0066cc',
    fontWeight: 'bold',
  },
  descriptionBox: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
  },
  descriptionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  descriptionText: {
    color: '#444',
    lineHeight: 22,
  },
  bottomBar: {
    padding: 15,
    borderTopWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
  },
  addToCartButton: {
    backgroundColor: '#1C8A3B',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  addToCartText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  reviewSection: {
    marginTop: 25,
    paddingTop: 20,
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  reviewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  starRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 10,
  },
  commentInput: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 15,
  },
  submitReviewBtn: {
    backgroundColor: '#F8CB46',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitReviewText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#000',
  },
  reviewsListSection: {
    marginTop: 25,
    paddingTop: 20,
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  reviewsListTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  noReviewsText: {
    color: '#666',
    fontStyle: 'italic',
  },
  reviewCard: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewerName: {
    fontWeight: 'bold',
    color: '#333',
  },
  reviewStars: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewComment: {
    color: '#555',
    lineHeight: 20,
  }
});
