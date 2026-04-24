import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { CheckCircle, ArrowRight } from 'lucide-react-native';

export default function ReviewSubmittedScreen({ navigation, route }) {
  const { review } = route.params || {};

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.successIcon}>
          <Text style={{ fontSize: 80 }}>🎉</Text>
        </View>
        
        <Text style={styles.title}>Thank you for your review!</Text>
        <Text style={styles.subtitle}>
          Your feedback helps other customers make better choices.
        </Text>

        {review && (
          <View style={styles.reviewSummary}>
             <Text style={styles.summaryTitle}>YOUR REVIEW</Text>
             <View style={styles.starsRow}>
               {[1,2,3,4,5].map(i => (
                 <Text key={i} style={{ fontSize: 20 }}>{i <= review.rating ? '⭐' : '☆'}</Text>
               ))}
             </View>
             <Text style={styles.reviewText}>"{review.comment}"</Text>
             
             <View style={styles.tagsRow}>
               {review.tags?.map((tag, index) => (
                 <View key={index} style={styles.tag}>
                   <Text style={styles.tagText}>✅ {tag}</Text>
                 </View>
               ))}
             </View>

             {review.photos && review.photos.length > 0 && (
               <View style={styles.photosRow}>
                 {review.photos.map((uri, index) => (
                   <Image key={index} source={{ uri }} style={styles.summaryPhoto} />
                 ))}
               </View>
             )}
          </View>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.homeBtn} 
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.homeBtnText}>Back to Home</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.reportBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.reportBtnText}>Report a different issue →</Text>
          </TouchableOpacity>
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
  content: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successIcon: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#000',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 22,
  },
  reviewSummary: {
    width: '100%',
    backgroundColor: '#f9f9f9',
    borderRadius: 20,
    padding: 20,
    marginBottom: 40,
    borderWidth: 1,
    borderColor: '#eee',
  },
  summaryTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#999',
    marginBottom: 10,
    letterSpacing: 1,
  },
  starsRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  reviewText: {
    fontSize: 15,
    color: '#000',
    fontStyle: 'italic',
    lineHeight: 20,
    marginBottom: 15,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  tagText: {
    fontSize: 12,
    color: '#1C8A3B',
    fontWeight: '600',
  },
  photosRow: {
    flexDirection: 'row',
    marginTop: 15,
    gap: 8,
  },
  summaryPhoto: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  buttonContainer: {
    width: '100%',
    gap: 15,
  },
  homeBtn: {
    backgroundColor: '#F8CB46',
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  homeBtnText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  reportBtn: {
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  reportBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});
