import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppContext } from '../context/AppContext';
import { Star } from 'lucide-react-native';

export default function ReviewScreen({ route, navigation }) {
  const { orderId } = route.params || {};
  const { currentUser } = useAppContext();

  const order = currentUser?.orders?.find(o => o.id === orderId);

  if (!order) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <Text>Order not found for review.</Text>
      </SafeAreaView>
    );
  }

  // Only show items that were actually delivered (not OOC)
  const deliveredItems = order.items.filter(item => !item.isOOCAfterPayment);

  const renderReviewItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => navigation.navigate('Product', { product: item, isReviewMode: true })}
    >
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.details}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.qty}>{item.quantity}</Text>
        <View style={styles.ratingRow}>
          <Text style={styles.rateText}>Tap to rate & review</Text>
          <View style={styles.stars}>
            {[1,2,3,4,5].map(i => <Star key={i} size={16} color="#ccc" />)}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Review Your Items</Text>
        <Text style={styles.subtitle}>Order: {orderId}</Text>
      </View>

      <FlatList
        data={deliveredItems}
        renderItem={renderReviewItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />
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
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  list: {
    padding: 15,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    alignItems: 'center',
  },
  image: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
    marginRight: 15,
  },
  details: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  qty: {
    fontSize: 13,
    color: '#888',
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rateText: {
    fontSize: 12,
    color: '#1C8A3B',
    fontWeight: '500',
  },
  stars: {
    flexDirection: 'row',
  }
});
