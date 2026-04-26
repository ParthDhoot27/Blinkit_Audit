import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppContext } from './context/AppContext';

/**
 * GlobalNotification: A toast-style overlay that displays notifications
 * across all screens in the application.
 */
export default function GlobalNotification() {
  const insets = useSafeAreaInsets();
  const { notification, setNotification } = useAppContext();
  const opacity = new Animated.Value(0);

  useEffect(() => {
    if (notification) {
      // Fade in
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      // Auto-hide after 5 seconds
      const timer = setTimeout(() => {
        hideNotification();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [notification]);

  const hideNotification = () => {
    Animated.timing(opacity, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setNotification(null));
  };

  if (!notification) return null;

  return (
    <Animated.View 
      style={[
        styles.toast, 
        { 
          top: Platform.OS === 'ios' ? insets.top : 20,
          opacity: opacity 
        }
      ]}
    >
      <View style={styles.toastContent}>
        <Text style={styles.toastTitle}>
          {notification.type === 'refund' ? '💰 ' : (notification.type === 'delivered' ? '📦 ' : '⚠️ ')}
          {notification.title}
        </Text>
        <Text style={styles.toastMessage}>{notification.message}</Text>
      </View>
      <TouchableOpacity onPress={hideNotification}>
        <Text style={styles.toastClose}>✕</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    left: 20,
    right: 20,
    backgroundColor: '#333',
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10000,
    elevation: 100,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  toastContent: {
    flex: 1,
    marginRight: 10,
  },
  toastTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 2,
  },
  toastMessage: {
    color: '#ccc',
    fontSize: 12,
  },
  toastClose: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 10,
  }
});
