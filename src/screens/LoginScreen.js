import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Image, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useAppContext } from '../context/AppContext';

export default function LoginScreen({ navigation }) {
  const { login, theme } = useAppContext();
  const [phone, setPhone] = useState('');
  const isDark = theme === 'dark';

  const handleLogin = () => {
    // Basic validation for demo
    if (phone.length >= 10) {
      // In a real app, this would trigger OTP
      // For this demo, we'll just log in a default user
      if (login(phone, 'password123')) {
        navigation.goBack();
      } else {
        alert("User not found! Try mobile: 9876543210");
      }
    } else {
      alert("Please enter a valid phone number");
    }
  };

  return (
    <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Header Image Area */}
          <View style={styles.headerImageContainer}>
            <Image
              source={require('../../assets/img1.jpg')}
              style={styles.headerImage}
              resizeMode="cover"
            />
          </View>

          <View style={styles.content}>
            <Text style={styles.brandName}>blink<Text style={{ color: '#1C8A3B' }}>it</Text></Text>
            <Text style={styles.tagline}>Groceries delivered in minutes</Text>

            <View style={styles.badgeRow}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>⏱ 10 min Delivery</Text>
              </View>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>💰 COD Accepted</Text>
              </View>
            </View>
            <View style={styles.badgeRow}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>🔒 OTP verified</Text>
              </View>
            </View>

            <Text style={styles.inputLabel}>Mobile Number</Text>
            <View style={styles.inputWrapper}>
              <View style={styles.countryCode}>
                <Text style={styles.countryCodeText}>+91</Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder="92XXXXXXXX2"
                placeholderTextColor="#999"
                keyboardType="phone-pad"
                maxLength={10}
                value={phone}
                onChangeText={setPhone}
              />
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infoIcon}>🔒</Text>
              <Text style={styles.infoText}>
                We'll send a one-time password. No UPI or banking access required.
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.getOtpBtn, phone.length < 10 && styles.disabledBtn]}
              onPress={handleLogin}
              activeOpacity={0.8}
            >
              <Text style={styles.getOtpBtnText}>Get OTP →</Text>
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.line} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.line} />
            </View>

            <TouchableOpacity style={styles.googleBtn} activeOpacity={0.7}>
              <Text style={styles.googleBtnText}>Continue with Google</Text>
            </TouchableOpacity>

            <View style={styles.testCredentials}>
              <Text style={styles.testTitle}>Demo Mode:</Text>
              <Text style={styles.testSubtitle}>Enter any 10-digit number to log in as Renu</Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  scrollContent: {
    flexGrow: 1,
  },
  headerImageContainer: {
    height: '15%',
    width: '100%',
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  content: {
    padding: 24,
    paddingTop: 10,
    paddingBottom: 50,
  },
  brandName: {
    fontSize: 42,
    fontWeight: '900',
    color: '#000',
    letterSpacing: -1,
  },
  tagline: {
    fontSize: 16,
    color: '#666',
    marginTop: -4,
    marginBottom: 25,
  },
  badgeRow: {
    flexDirection: 'row',
    marginBottom: 10,
    gap: 10,
  },
  badge: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  badgeText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },
  inputLabel: {
    fontSize: 14,
    color: '#555',
    marginTop: 20,
    marginBottom: 10,
    fontWeight: '500',
  },
  inputWrapper: {
    flexDirection: 'row',
    height: 56,
    backgroundColor: '#f5f5f5',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  countryCode: {
    width: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#e0e0e0',
    backgroundColor: '#eee',
  },
  countryCodeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  input: {
    flex: 1,
    paddingHorizontal: 15,
    fontSize: 18,
    color: '#000',
    letterSpacing: 1,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#fff8e1',
    padding: 10,
    borderRadius: 16,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#ffecb3',
    alignItems: 'center',
  },
  infoIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: '#6d4c41',
    lineHeight: 16,
  },
  getOtpBtn: {
    backgroundColor: '#F8CB46',
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    shadowColor: '#F8CB46',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  disabledBtn: {
    backgroundColor: '#ffe082',
    shadowOpacity: 0,
  },
  getOtpBtnText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#eee',
  },
  dividerText: {
    paddingHorizontal: 15,
    color: '#999',
    fontSize: 14,
  },
  googleBtn: {
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  googleBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  testCredentials: {
    marginTop: 40,
    alignItems: 'center',
  },
  testTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#999',
    marginBottom: 4,
  },
  testSubtitle: {
    fontSize: 11,
    color: '#bbb',
  }
});
