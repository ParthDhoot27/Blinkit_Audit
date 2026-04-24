import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, TextInput, Alert, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppContext } from '../context/AppContext';
import { Star, ChevronRight, Share2, Heart, Info } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function ProductScreen({ route, navigation }) {
  const { productId, product: passedProduct, isReviewMode } = route.params || {};
  const { stock, currentUser, addToCart, productReviews, submitReview, theme } = useAppContext();
  const isDark = theme === 'dark';

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const product = passedProduct || stock.find(p => p.id === productId);

  if (!product) {
    return <SafeAreaView><Text>Product not found</Text></SafeAreaView>;
  }

  const currentStockItem = stock.find(s => s.id === product.id);
  const isOutOfStock = currentStockItem && currentStockItem.stock <= 0;

  const baseRating = product.rating || 4.8;
  const baseCount = product.reviewCount || 2143;
  const thisProductReviews = productReviews.filter(r => r.productId === product.id);
  const totalReviews = baseCount + thisProductReviews.length;

  const avgRating = totalReviews > 0
    ? ((baseRating * baseCount + thisProductReviews.reduce((sum, r) => sum + r.rating, 0)) / totalReviews).toFixed(1)
    : "4.8";

  const handleAddToCart = () => {
    if (!currentUser) {
      navigation.navigate('Login');
      return;
    }
    addToCart(product);
    Alert.alert("Added to cart", `${product.name} has been added.`);
  };

  const handleReviewSubmit = () => {
    if (rating === 0) {
      Alert.alert("Error", "Please select a star rating.");
      return;
    }
    submitReview(product.id, rating, comment);
    navigation.navigate('ReviewSubmitted', { review: { rating, comment, tags: ['Good Quality'] } });
  };

  const ratingStats = [
    { star: 5, percent: 78 },
    { star: 4, percent: 14 },
    { star: 3, percent: 5 },
    { star: 2, percent: 2 },
    { star: 1, percent: 1 },
  ];

  return (
    <SafeAreaView style={[styles.container, isDark && styles.bgDark]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[styles.imageContainer, isDark && styles.bgDarkLine]}>
          <Image source={{ uri: product.image }} style={styles.image} resizeMode="contain" />
          <View style={styles.imageActions}>
            <TouchableOpacity style={styles.imgActionBtn}><Share2 size={20} color="#333" /></TouchableOpacity>
            <TouchableOpacity style={styles.imgActionBtn}><Heart size={20} color="#333" /></TouchableOpacity>
          </View>
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.badgeRow}>
            <View style={styles.deliveryBadge}>
              <Text style={styles.deliveryText}>⏱ 8 MINS</Text>
            </View>
            {product.isCold && <View style={[styles.tagBadge, { backgroundColor: '#e3f2fd' }]}><Text style={{ color: '#1e88e5', fontSize: 10, fontWeight: 'bold' }}>❄️ COLD</Text></View>}
          </View>

          <Text style={[styles.title, isDark && styles.textLight]}>{product.name}</Text>
          <Text style={styles.quantity}>{product.quantity}</Text>

          <View style={styles.priceSection}>
            <View>
              <View style={styles.priceRow}>
                <Text style={[styles.price, isDark && styles.textLight]}>₹{product.price}</Text>
                {product.originalPrice && (
                  <Text style={styles.originalPrice}>₹{product.originalPrice}</Text>
                )}
              </View>
              <Text style={styles.taxText}>(Inclusive of all taxes)</Text>
            </View>

            {isOutOfStock ? (
              <View style={styles.outOfStockBadge}>
                <Text style={styles.outOfStockText}>Out of Stock</Text>
              </View>
            ) : (
              <TouchableOpacity style={styles.addBtnLarge} onPress={handleAddToCart}>
                <Text style={styles.addBtnLargeText}>ADD</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.divider} />

          <View style={styles.infoSection}>
            <Text style={[styles.sectionTitle, isDark && styles.textLight]}>Product Details</Text>
            <View style={styles.infoRow}>
              <Info size={16} color="#666" />
              <Text style={styles.infoLabel}>Shelf Life</Text>
              <Text style={[styles.infoValue, isDark && styles.textLight]}>5 Days</Text>
            </View>
            <View style={styles.infoRow}>
              <Info size={16} color="#666" />
              <Text style={styles.infoLabel}>Manufacturer</Text>
              <Text style={[styles.infoValue, isDark && styles.textLight]}>Blinkit Commerce</Text>
            </View>
            <Text style={styles.descriptionText}>
              High quality {product.name} delivered fresh to your door. Carefully picked and packed to ensure the best quality.
            </Text>
          </View>

          <View style={styles.divider} />

          {/* Ratings & Reviews Section - MATCHING SCREENSHOT */}
          <View style={styles.reviewsSection}>
            <View style={styles.sectionHeaderRow}>
              <Text style={[styles.sectionTitle, isDark && styles.textLight]}>Ratings & Reviews</Text>
              <TouchableOpacity 
                style={styles.rateBtn}
                onPress={() => navigation.navigate('Review', { productId: product.id })}
              >
                <Text style={styles.rateBtnText}>Rate Product</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.ratingOverview}>
              <View style={styles.ratingLeft}>
                <Text style={[styles.bigRating, isDark && styles.textLight]}>{avgRating}</Text>
                <View style={styles.starsRow}>
                  {[1, 2, 3, 4, 5].map(i => <Star key={i} size={14} fill="#F8CB46" color="#F8CB46" />)}
                </View>
                <Text style={styles.totalRatingsText}>{totalReviews.toLocaleString()} ratings</Text>
              </View>

              <View style={styles.ratingRight}>
                {ratingStats.map(stat => (
                  <View key={stat.star} style={styles.statRow}>
                    <Text style={styles.statStar}>{stat.star}</Text>
                    <View style={styles.statBarContainer}>
                      <View style={[styles.statBar, { width: `${stat.percent}%` }]} />
                    </View>
                    <Text style={styles.statPercent}>{stat.percent}%</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.filterRow}>
              <TouchableOpacity style={[styles.filterChip, styles.filterChipActive]}><Text style={styles.filterChipTextActive}>All</Text></TouchableOpacity>
              <TouchableOpacity style={styles.filterChip}><Text style={styles.filterChipText}>✅ With photos</Text></TouchableOpacity>
              <TouchableOpacity style={styles.filterChip}><Text style={styles.filterChipText}>⭐ 5 star</Text></TouchableOpacity>
            </View>

            {/* Real Reviews from Context */}
            {thisProductReviews.map((rev) => (
              <View key={rev.id} style={[styles.reviewCard, isDark && styles.cardDark]}>
                <View style={styles.reviewerRow}>
                  <View style={styles.reviewerAvatar}>
                    <Text style={styles.avatarTxt}>{rev.userName.charAt(0).toUpperCase()}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.reviewerName, isDark && styles.textLight]}>{rev.userName}</Text>
                    <Text style={styles.reviewDate}>{new Date(rev.date).toLocaleDateString()}</Text>
                  </View>
                  <View style={styles.reviewerStars}>
                    {[1, 2, 3, 4, 5].map(i => (
                      <Star key={i} size={12} fill={i <= rev.rating ? "#F8CB46" : "#ddd"} color={i <= rev.rating ? "#F8CB46" : "#ddd"} />
                    ))}
                  </View>
                </View>
                <View style={styles.verifiedBadge}><Text style={styles.verifiedText}>Verified purchase</Text></View>
                <Text style={[styles.reviewText, isDark && styles.textDim]}>{rev.comment}</Text>
                
                {rev.photos && rev.photos.length > 0 && (
                  <View style={styles.reviewPhotosRow}>
                    {rev.photos.map((p, idx) => (
                      <Image key={idx} source={{ uri: p }} style={styles.reviewPhoto} />
                    ))}
                  </View>
                )}

                <View style={styles.tagsRow}>
                  {rev.tags?.map((tag, idx) => (
                    <View key={idx} style={styles.miniTag}>
                      <Text style={styles.miniTagText}>{tag}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}

            {/* Sample Reviews (only if few real reviews) */}
            {thisProductReviews.length < 2 && (
              <>
                <View style={[styles.reviewCard, isDark && styles.cardDark]}>
                  <View style={styles.reviewerRow}>
                    <View style={styles.reviewerAvatar}><Text style={styles.avatarTxt}>RS</Text></View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.reviewerName, isDark && styles.textLight]}>Riya S.</Text>
                      <Text style={styles.reviewDate}>12 Apr 2026</Text>
                    </View>
                    <View style={styles.reviewerStars}>
                      {[1, 2, 3, 4, 5].map(i => <Star key={i} size={12} fill="#F8CB46" color="#F8CB46" />)}
                    </View>
                  </View>
                  <View style={styles.verifiedBadge}><Text style={styles.verifiedText}>Verified purchase</Text></View>
                  <Text style={[styles.reviewText, isDark && styles.textDim]}>
                    Milk is always fresh and delivered sealed. I check expiry every time — always 4-5 days ahead. Weight is accurate. Best on Blinkit.
                  </Text>
                </View>

                <View style={[styles.reviewCard, isDark && styles.cardDark]}>
                  <View style={styles.reviewerRow}>
                    <View style={[styles.reviewerAvatar, { backgroundColor: '#fce4ec' }]}><Text style={[styles.avatarTxt, { color: '#c2185b' }]}>AK</Text></View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.reviewerName, isDark && styles.textLight]}>Arjun K.</Text>
                      <Text style={styles.reviewDate}>8 Apr 2026</Text>
                    </View>
                    <View style={styles.reviewerStars}>
                      {[1, 2, 3, 4].map(i => <Star key={i} size={12} fill="#F8CB46" color="#F8CB46" />)}
                      <Star size={12} fill="#ddd" color="#ddd" />
                    </View>
                  </View>
                  <View style={styles.verifiedBadge}><Text style={styles.verifiedText}>Verified purchase</Text></View>
                  <Text style={[styles.reviewText, isDark && styles.textDim]}>
                    Milk quality is fine but packaging was slightly dented once. Support resolved quickly. 5 stars if packaging is more careful.
                  </Text>
                </View>
              </>
            )}
          </View>
        </View>
      </ScrollView>

      <View style={[styles.bottomBar, isDark && styles.bgDark]}>
        <View style={styles.footerPrice}>
          <Text style={[styles.footerPriceText, isDark && styles.textLight]}>₹{product.price}</Text>
          <Text style={styles.footerViewDetails}>VIEW DETAILS</Text>
        </View>
        <TouchableOpacity
          style={[styles.addToCartBtn, isOutOfStock && styles.disabledBtn]}
          onPress={handleAddToCart}
          disabled={isOutOfStock}
        >
          <Text style={styles.addToCartBtnText}>{isOutOfStock ? 'OUT OF STOCK' : 'Add to Cart →'}</Text>
        </TouchableOpacity>
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
  },
  cardDark: {
    backgroundColor: '#1e1e1e',
  },
  textLight: {
    color: '#fff',
  },
  textDim: {
    color: '#aaa',
  },
  imageContainer: {
    backgroundColor: '#fafafaff',
    alignItems: 'center',
    padding: 0,
    height: 300,
    justifyContent: 'center',
  },
  image: {
    width: '90%',
    height: '100%',
  },
  imageActions: {
    position: 'absolute',
    top: 20,
    right: 20,
    gap: 15,
  },
  imgActionBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  detailsContainer: {
    padding: 20,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  deliveryBadge: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  deliveryText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#555',
  },
  tagBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#000',
    marginBottom: 5,
  },
  quantity: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
    marginBottom: 20,
  },
  priceSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: 26,
    fontWeight: '900',
    color: '#000',
  },
  originalPrice: {
    fontSize: 16,
    color: '#999',
    textDecorationLine: 'line-through',
    marginLeft: 8,
  },
  taxText: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  addBtnLarge: {
    backgroundColor: '#1C8A3B',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 12,
  },
  addBtnLargeText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 20,
  },
  infoSection: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#000',
    marginBottom: 15,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  rateBtn: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#F8CB46',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  rateBtnText: {
    fontSize: 12,
    color: '#000',
    fontWeight: 'bold',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10,
  },
  infoLabel: {
    flex: 1,
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
  },
  descriptionText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
    marginTop: 10,
  },
  reviewsSection: {
    marginTop: 10,
  },
  ratingOverview: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  ratingLeft: {
    alignItems: 'center',
    paddingRight: 30,
    borderRightWidth: 1,
    borderRightColor: '#f0f0f0',
  },
  bigRating: {
    fontSize: 48,
    fontWeight: '900',
    color: '#000',
  },
  starsRow: {
    flexDirection: 'row',
    gap: 2,
    marginVertical: 5,
  },
  totalRatingsText: {
    fontSize: 12,
    color: '#999',
    fontWeight: '600',
  },
  ratingRight: {
    flex: 1,
    paddingLeft: 20,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  statStar: {
    fontSize: 12,
    color: '#666',
    width: 15,
  },
  statBarContainer: {
    flex: 1,
    height: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 3,
    marginHorizontal: 10,
    overflow: 'hidden',
  },
  statBar: {
    height: '100%',
    backgroundColor: '#F8CB46',
    borderRadius: 3,
  },
  statPercent: {
    fontSize: 11,
    color: '#999',
    width: 30,
    textAlign: 'right',
  },
  filterRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#eee',
  },
  filterChipActive: {
    backgroundColor: '#F8CB46',
    borderColor: '#F8CB46',
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  filterChipTextActive: {
    fontSize: 12,
    fontWeight: '700',
    color: '#000',
  },
  reviewCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    marginBottom: 15,
  },
  reviewerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  reviewerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e8f5e9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarTxt: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1C8A3B',
  },
  reviewerName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
  },
  reviewDate: {
    fontSize: 11,
    color: '#999',
  },
  reviewerStars: {
    flexDirection: 'row',
    gap: 2,
  },
  verifiedBadge: {
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  verifiedText: {
    fontSize: 10,
    color: '#1C8A3B',
    fontWeight: 'bold',
  },
  reviewText: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
    marginBottom: 15,
  },
  reviewActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f9f9f9',
    paddingTop: 15,
  },
  helpfulCount: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  reviewPhotosRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  reviewPhoto: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  miniTag: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 6,
  },
  miniTagText: {
    fontSize: 10,
    color: '#666',
    fontWeight: '600',
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  actionBtns: {
    flexDirection: 'row',
    gap: 10,
  },
  actionBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#eee',
  },
  actionBtnText: {
    fontSize: 11,
    color: '#666',
    fontWeight: '600',
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderTopWidth: 1,
    borderColor: '#f0f0f0',
    backgroundColor: '#fff',
    paddingBottom: 30,
  },
  footerPrice: {
    flex: 1,
  },
  footerPriceText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#000',
  },
  footerViewDetails: {
    fontSize: 10,
    color: '#1C8A3B',
    fontWeight: '900',
    marginTop: 2,
  },
  addToCartBtn: {
    backgroundColor: '#F8CB46',
    paddingHorizontal: 25,
    paddingVertical: 14,
    borderRadius: 12,
    flex: 1.5,
    alignItems: 'center',
  },
  disabledBtn: {
    backgroundColor: '#ddd',
  },
  addToCartBtnText: {
    color: '#000',
    fontWeight: '900',
    fontSize: 16,
  }
});
