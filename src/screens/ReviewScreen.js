import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, TextInput, ScrollView, Alert, Modal, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppContext } from '../context/AppContext';
import { Star, Camera as CameraIcon, X, Zap, RotateCcw } from 'lucide-react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

export default function ReviewScreen({ route, navigation }) {
  const { orderId, productId, product: directProduct } = route.params || {};
  const { currentUser, stock, theme, submitReview } = useAppContext();
  const isDark = theme === 'dark';

  const order = currentUser?.orders?.find(o => o.id === orderId);
  const targetProduct = directProduct || (productId ? stock.find(p => p.id === productId) : null);

  // Ratings for each item: { itemId: { rating: 0, comment: '', tags: [], photos: [] } }
  const [reviews, setReviews] = useState({});
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraModalVisible, setCameraModalVisible] = useState(false);
  const [activeItemId, setActiveItemId] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const cameraRef = useRef(null);

  if (!order && !targetProduct) {
    return (
      <SafeAreaView style={[styles.centerContainer, isDark && styles.bgDark]}>
        <Text style={isDark && styles.textLight}>Product not found for review.</Text>
      </SafeAreaView>
    );
  }

  const deliveredItems = order 
    ? order.items.filter(item => !item.isOOCAfterPayment)
    : [targetProduct];

  const updateReview = (itemId, field, value) => {
    setReviews(prev => ({
      ...prev,
      [itemId]: {
        ...(prev[itemId] || { rating: 0, comment: '', tags: [], photos: [] }),
        [field]: value
      }
    }));
  };

  const handleAddPhoto = async (itemId) => {
    setActiveItemId(itemId);
    if (!permission) {
      const { status } = await requestPermission();
      if (status !== 'granted') {
        Alert.alert("Permission Denied", "Camera permission is required to add photos.");
        return;
      }
    }
    if (permission.status !== 'granted') {
      const { status } = await requestPermission();
      if (status !== 'granted') {
        Alert.alert("Permission Denied", "Camera permission is required to add photos.");
        return;
      }
    }
    setCameraModalVisible(true);
  };

  const takePicture = async () => {
    if (cameraRef.current && !isCapturing) {
      try {
        setIsCapturing(true);
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.7,
          base64: false,
          exif: false,
        });
        
        const currentPhotos = reviews[activeItemId]?.photos || [];
        updateReview(activeItemId, 'photos', [...currentPhotos, photo.uri]);
        setCameraModalVisible(false);
      } catch (e) {
        Alert.alert("Error", "Could not take photo. Please try again.");
      } finally {
        setIsCapturing(false);
      }
    }
  };

  const removePhoto = (itemId, photoUri) => {
    const currentPhotos = reviews[itemId]?.photos || [];
    updateReview(itemId, 'photos', currentPhotos.filter(p => p !== photoUri));
  };

  const toggleTag = (itemId, tag) => {
    const currentReview = reviews[itemId] || { rating: 0, comment: '', tags: [], photos: [] };
    const currentTags = currentReview.tags;
    const newTags = currentTags.includes(tag)
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag];
    
    updateReview(itemId, 'tags', newTags);
  };

  const handleSubmitAll = () => {
    deliveredItems.forEach(item => {
      const itemReview = reviews[item.id];
      if (itemReview && itemReview.rating > 0) {
        submitReview(item.id, itemReview.rating, itemReview.comment, itemReview.tags, itemReview.photos);
      }
    });

    const firstItemId = deliveredItems[0].id;
    const review = reviews[firstItemId] || { rating: 5, comment: 'Great service!', tags: ['Fresh quality', 'Fast delivery'], photos: [] };
    navigation.navigate('ReviewSubmitted', { review });
  };

  const tagsList = ["Fresh quality", "Correct weight", "Fast delivery", "Well packed"];

  return (
    <SafeAreaView style={[styles.container, isDark && styles.bgDark]}>
      <View style={styles.header}>
        <Text style={[styles.title, isDark && styles.textLight]}>How was the product?</Text>
        <Text style={styles.subtitle}>
          {orderId ? `Rate items from order #${orderId.substring(0,8)}` : `Reviewing ${targetProduct.name}`}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {deliveredItems.map((item) => {
          const itemReview = reviews[item.id] || { rating: 0, comment: '', tags: [], photos: [] };
          
          return (
            <View key={item.id} style={[styles.card, isDark && styles.cardDark]}>
              <View style={styles.itemHeader}>
                <Image source={{ uri: item.image }} style={styles.image} resizeMode="contain" />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.name, isDark && styles.textLight]}>{item.name}</Text>
                  <Text style={styles.qty}>{item.quantity}</Text>
                </View>
              </View>

              <View style={styles.ratingSection}>
                <Text style={styles.sectionLabel}>Tap to rate</Text>
                <View style={styles.starsRow}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <TouchableOpacity key={star} onPress={() => updateReview(item.id, 'rating', star)}>
                      <Star 
                        size={32} 
                        fill={star <= itemReview.rating ? "#F8CB46" : "transparent"} 
                        color={star <= itemReview.rating ? "#F8CB46" : "#ccc"} 
                        style={{ marginRight: 8 }}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.tagsSection}>
                <Text style={styles.sectionLabel}>What did you like?</Text>
                <View style={styles.tagsRow}>
                  {tagsList.map(tag => (
                    <TouchableOpacity 
                      key={tag} 
                      style={[styles.tag, itemReview.tags.includes(tag) && styles.tagActive, isDark && itemReview.tags.includes(tag) && { backgroundColor: '#1b5e20' }]}
                      onPress={() => toggleTag(item.id, tag)}
                    >
                      <Text style={[styles.tagText, itemReview.tags.includes(tag) && styles.tagTextActive]}>
                        {tag}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.commentSection}>
                <TextInput
                  style={[styles.commentInput, isDark && styles.bgDarkLine, isDark && styles.textLight]}
                  placeholder="Share more details about the product..."
                  placeholderTextColor="#999"
                  multiline
                  value={itemReview.comment}
                  onChangeText={(text) => updateReview(item.id, 'comment', text)}
                />
              </View>

              {/* Photos Section */}
              <View style={styles.photosSection}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {itemReview.photos.map((uri, index) => (
                    <View key={index} style={styles.photoContainer}>
                      <Image source={{ uri }} style={styles.photoPreview} />
                      <TouchableOpacity 
                        style={styles.removePhotoBtn} 
                        onPress={() => removePhoto(item.id, uri)}
                      >
                        <X size={12} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  ))}
                  <TouchableOpacity 
                    style={[styles.photoBtn, isDark && styles.bgDarkLine]}
                    onPress={() => handleAddPhoto(item.id)}
                  >
                    <CameraIcon size={20} color="#666" />
                    <Text style={styles.photoBtnText}>Add Photos</Text>
                  </TouchableOpacity>
                </ScrollView>
              </View>
            </View>
          );
        })}

        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmitAll}>
          <Text style={styles.submitBtnText}>Submit Reviews</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Camera Modal */}
      <Modal visible={cameraModalVisible} animationType="slide" transparent={false}>
        <SafeAreaView style={styles.cameraContainer}>
          <CameraView 
            ref={cameraRef}
            style={styles.camera} 
            facing="back"
          >
            <View style={styles.cameraOverlay}>
              <TouchableOpacity 
                style={styles.closeCamera} 
                onPress={() => setCameraModalVisible(false)}
              >
                <X size={30} color="#fff" />
              </TouchableOpacity>
              
              <View style={styles.cameraControls}>
                <View style={styles.captureCircle}>
                  <TouchableOpacity 
                    style={styles.captureBtn} 
                    onPress={takePicture}
                    disabled={isCapturing}
                  >
                    {isCapturing ? <ActivityIndicator color="#000" /> : <View style={styles.captureInner} />}
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </CameraView>
        </SafeAreaView>
      </Modal>
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 24,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#000',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    fontWeight: '500',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 60,
    height: 60,
    marginRight: 15,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  qty: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  ratingSection: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#999',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  starsRow: {
    flexDirection: 'row',
  },
  tagsSection: {
    marginBottom: 20,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#f9f9f9',
  },
  tagActive: {
    backgroundColor: '#e8f5e9',
    borderColor: '#1C8A3B',
  },
  tagText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  tagTextActive: {
    color: '#1C8A3B',
  },
  commentSection: {
    marginBottom: 15,
  },
  commentInput: {
    backgroundColor: '#f9f9f9',
    borderRadius: 16,
    padding: 15,
    height: 100,
    textAlignVertical: 'top',
    fontSize: 14,
    color: '#333',
    borderWidth: 1,
    borderColor: '#eee',
  },
  photosSection: {
    marginTop: 10,
  },
  photoContainer: {
    position: 'relative',
    marginRight: 10,
  },
  photoPreview: {
    width: 70,
    height: 70,
    borderRadius: 12,
  },
  removePhotoBtn: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoBtn: {
    width: 100,
    height: 70,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
  },
  photoBtnText: {
    fontSize: 10,
    color: '#666',
    fontWeight: '600',
    marginTop: 4,
  },
  submitBtn: {
    backgroundColor: '#1C8A3B',
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#1C8A3B',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  submitBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 20,
  },
  closeCamera: {
    alignSelf: 'flex-end',
    marginTop: 20,
  },
  cameraControls: {
    alignItems: 'center',
    marginBottom: 40,
  },
  captureCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureInner: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 2,
    borderColor: '#000',
  }
});