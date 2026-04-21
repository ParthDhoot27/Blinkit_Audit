import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { login, register } from '../db';

export default function LoginScreen({ setUser }) {
  const insets = useSafeAreaInsets();
  const [phone, setPhone]       = useState('');
  const [mode, setMode]         = useState('login'); // login | register
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [lane, setLane]         = useState('');
  const [building, setBuilding] = useState('');
  const [city, setCity]         = useState('');
  const [pincode, setPincode]   = useState('');

  async function handleOTP() {
    if (phone.length < 10) return Alert.alert('Enter valid 10-digit number');
    const user = await login(phone);
    if (user) { setUser(user); return; }
    setMode('register');
  }

  async function handleRegister() {
    if (!name || !lane || !building || !city || !pincode)
      return Alert.alert('Fill all fields');
    const user = await register({ phone, name, email, lane, building, city, pincode });
    if (user) setUser(user);
    else Alert.alert('Phone already registered');
  }

  return (
    <ScrollView style={s.bg} contentContainerStyle={{ paddingTop: insets.top + 20, paddingBottom:40 }}>
      <View style={s.logoBox}>
        <Text style={s.logo}>blinkit</Text>
        <Text style={s.logoSub}>Groceries in 10 minutes</Text>
        <Text style={{ fontSize:48, marginTop:8 }}>🛵</Text>
      </View>

      {mode === 'login' ? (
        <View style={s.card}>
          <Text style={s.welcome}>Welcome back!</Text>
          <Text style={s.sub}>Enter your mobile number to continue</Text>
          <Text style={s.label}>Mobile number</Text>
          <View style={s.phoneRow}>
            <View style={s.countryBox}><Text style={s.countryTxt}>🇮🇳 +91</Text></View>
            <TextInput style={s.phoneInput} placeholder="Enter mobile number" keyboardType="phone-pad"
              value={phone} onChangeText={setPhone} maxLength={10} />
          </View>
          <TouchableOpacity style={s.otpBtn} onPress={handleOTP}>
            <Text style={s.otpBtnTxt}>Get OTP</Text>
          </TouchableOpacity>
          <Text style={s.orTxt}>or continue with</Text>
          <View style={s.socialRow}>
            <TouchableOpacity style={s.socialBtn}><Text>🔵  Google</Text></TouchableOpacity>
            <TouchableOpacity style={s.socialBtn}><Text>💚  WhatsApp</Text></TouchableOpacity>
          </View>
          <View style={s.trustRow}>
            <Text style={s.trustItem}>🔒 Secure{'\n'}& encrypted</Text>
            <Text style={s.trustItem}>⚡ Instant{'\n'}access</Text>
            <Text style={s.trustItem}>🎁 New user{'\n'}offers</Text>
          </View>
        </View>
      ) : (
        <View style={s.card}>
          <Text style={s.welcome}>Create account</Text>
          <Text style={s.sub}>+91 {phone} · <Text style={{ color:'#0c831f' }} onPress={() => setMode('login')}>Change</Text></Text>
          {[['Full name', name, setName, 'default'],
            ['Email (optional)', email, setEmail, 'email-address'],
            ['Lane / Street', lane, setLane, 'default'],
            ['Building / Flat no.', building, setBuilding, 'default'],
            ['City', city, setCity, 'default'],
            ['Pincode', pincode, setPincode, 'numeric'],
          ].map(([lbl, val, fn, kb]) => (
            <View key={lbl} style={{ marginBottom:12 }}>
              <Text style={s.label}>{lbl}</Text>
              <TextInput style={s.input} placeholder={lbl} keyboardType={kb}
                value={val} onChangeText={fn} />
            </View>
          ))}
          <TouchableOpacity style={s.otpBtn} onPress={handleRegister}>
            <Text style={s.otpBtnTxt}>Create Account</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  bg:         { flex:1, backgroundColor:'#f5f5f5' },
  logoBox:    { alignItems:'center', backgroundColor:'#0c831f', paddingVertical:32, marginBottom:20 },
  logo:       { color:'#F8C300', fontSize:36, fontWeight:'900', fontStyle:'italic' },
  logoSub:    { color:'#fff', fontSize:13, marginTop:4 },
  card:       { backgroundColor:'#fff', marginHorizontal:16, borderRadius:16, padding:20, elevation:2 },
  welcome:    { fontSize:22, fontWeight:'700', color:'#1a1a1a', marginBottom:4 },
  sub:        { color:'#888', fontSize:13, marginBottom:20 },
  label:      { color:'#555', fontSize:12, fontWeight:'600', marginBottom:6 },
  phoneRow:   { flexDirection:'row', gap:8, marginBottom:16 },
  countryBox: { backgroundColor:'#f5f5f5', borderRadius:10, borderWidth:1, borderColor:'#ddd', padding:12, justifyContent:'center' },
  countryTxt: { fontSize:13 },
  phoneInput: { flex:1, backgroundColor:'#f5f5f5', borderRadius:10, borderWidth:1, borderColor:'#ddd', padding:12, fontSize:14 },
  input:      { backgroundColor:'#f5f5f5', borderRadius:10, borderWidth:1, borderColor:'#ddd', padding:12, fontSize:14 },
  otpBtn:     { backgroundColor:'#0c831f', borderRadius:12, padding:15, alignItems:'center', marginBottom:16 },
  otpBtnTxt:  { color:'#fff', fontSize:15, fontWeight:'700' },
  orTxt:      { textAlign:'center', color:'#aaa', fontSize:12, marginBottom:14 },
  socialRow:  { flexDirection:'row', gap:10, marginBottom:20 },
  socialBtn:  { flex:1, borderWidth:1, borderColor:'#ddd', borderRadius:10, padding:12, alignItems:'center' },
  trustRow:   { flexDirection:'row', justifyContent:'space-around' },
  trustItem:  { textAlign:'center', fontSize:11, color:'#888' },
});