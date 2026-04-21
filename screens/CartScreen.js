import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { updateCart } from '../db';

export default function CartScreen({ user, setUser }) {
  const insets = useSafeAreaInsets();
  const [cart, setCart]       = useState(user?.cart || []);
  const [coldSep, setColdSep] = useState(user?.coldSeparation ?? true);

  async function changeQty(id, delta) {
    const updated = cart.map(i => i.id===id ? { ...i, qty: Math.max(0, i.qty+delta) } : i).filter(i => i.qty > 0);
    setCart(updated);
    await updateCart(user.id, updated);
  }

  async function toggleCold(val) {
    setColdSep(val);
    const u = await updateCart(user.id, cart);
  }

  const coldItems    = cart.filter(i => i.cold);
  const regularItems = cart.filter(i => !i.cold);
  const itemsTotal   = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const delivery     = 25, surge = 12, platform = 4;
  const total        = itemsTotal + delivery + surge + platform;

  return (
    <View style={{ flex:1, backgroundColor:'#fff' }}>
      <View style={[s.header, { paddingTop: insets.top + 10 }]}>
        <Text style={s.pageTitle}>Your cart</Text>
        <Text style={s.locSub}>📍 {user?.addresses?.[0]?.city || 'Jaipur'}</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Delivery ETA */}
        <View style={s.etaBanner}>
          <Text style={s.etaTitle}>⚡ Arriving in 9 minutes</Text>
          <Text style={s.etaSub}>Rider assigned — tracking live</Text>
          <TouchableOpacity style={s.infoBtn}><Text style={s.infoTxt}>info</Text></TouchableOpacity>
        </View>

        {/* Reserved timer */}
        <View style={s.reservedBanner}>
          <Text style={s.reservedTxt}>⏱ Items reserved for 5:00 — complete checkout to hold stock</Text>
        </View>

        {/* Cold separation toggle — AUDIT FEATURE 5 */}
        <View style={s.coldCard}>
          <Text style={s.coldTitle}>❄  Separate Cold Items</Text>
          <Text style={s.coldSub}>Pack dairy & frozen items separately to prevent spoilage</Text>
          <View style={s.row}>
            <Text style={s.coldLabel}>Enable separation</Text>
            <Switch value={coldSep} onValueChange={toggleCold}
              trackColor={{ false:'#ddd', true:'#0c831f' }} thumbColor="#fff" />
          </View>
        </View>

        {/* Cold bag */}
        {coldSep && coldItems.length > 0 && (
          <View style={s.bagSection}>
            <Text style={s.bagLabel}>❄  Cold bag</Text>
            {coldItems.map(item => <CartItem key={item.id} item={item} onQty={changeQty} />)}
          </View>
        )}

        {/* Regular bag */}
        <View style={s.bagSection}>
          <Text style={s.bagLabel}>{coldSep ? '🛍  Regular bag' : '🛍  All items'}</Text>
          {(coldSep ? regularItems : cart).map(item => <CartItem key={item.id} item={item} onQty={changeQty} />)}
        </View>

        {/* Bill details */}
        <View style={s.billCard}>
          <Text style={s.billTitle}>Bill details</Text>
          {[['Item total', `₹${itemsTotal}`],['Delivery fee', `₹${delivery} 🙂`],['Surge fee', `₹${surge} 🔴 High demand`],['Platform fee', `₹${platform}`]].map(([l,v]) => (
            <View key={l} style={s.billRow}>
              <Text style={s.billLabel}>{l}</Text>
              <Text style={s.billVal}>{v}</Text>
            </View>
          ))}
          <View style={[s.billRow, { borderTopWidth:1, borderTopColor:'#eee', marginTop:8, paddingTop:8 }]}>
            <Text style={s.toPayLabel}>To pay</Text>
            <Text style={s.toPayVal}>₹{total}</Text>
          </View>
          <Text style={s.savingTxt}>🟢 You save ₹25 on delivery today</Text>
        </View>

        {/* Payment method */}
        <View style={s.payCard}>
          <Text style={s.billTitle}>Payment method</Text>
          <View style={s.payRow}>
            {['UPI (PhonePe)', 'Cash on Delivery', 'Card'].map(m => (
              <TouchableOpacity key={m} style={s.payChip}><Text style={s.payChipTxt}>{m}</Text></TouchableOpacity>
            ))}
          </View>
        </View>
        <View style={{ height:90 }} />
      </ScrollView>

      {/* Proceed button */}
      <View style={[s.proceedBar, { paddingBottom: insets.bottom + 12 }]}>
        <View style={s.proceedLeft}>
          <Text style={s.proceedCount}>{cart.length} items · ₹{total}</Text>
        </View>
        <TouchableOpacity style={s.proceedBtn}>
          <Text style={s.proceedTxt}>Proceed to pay →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function CartItem({ item, onQty }) {
  return (
    <View style={cs.row}>
      <Text style={{ fontSize:32, width:44, textAlign:'center' }}>{item.emoji}</Text>
      <View style={{ flex:1 }}>
        <Text style={cs.name}>{item.name}</Text>
        <Text style={cs.meta}>₹{item.price} · {item.cold ? 'Cold item' : 'Regular'}</Text>
      </View>
      <View style={cs.qtyCtrl}>
        <TouchableOpacity style={cs.qtyBtn} onPress={() => onQty(item.id, -1)}><Text style={cs.qtyBtnTxt}>−</Text></TouchableOpacity>
        <Text style={cs.qty}>{item.qty}</Text>
        <TouchableOpacity style={cs.qtyBtn} onPress={() => onQty(item.id, +1)}><Text style={cs.qtyBtnTxt}>+</Text></TouchableOpacity>
      </View>
    </View>
  );
}

const cs = StyleSheet.create({
  row:      { flexDirection:'row', alignItems:'center', gap:10, paddingVertical:10, borderBottomWidth:1, borderBottomColor:'#f0f0f0' },
  name:     { fontSize:13, fontWeight:'600', color:'#1a1a1a' },
  meta:     { fontSize:11, color:'#888', marginTop:2 },
  qtyCtrl:  { flexDirection:'row', alignItems:'center', gap:6, backgroundColor:'#0c831f', borderRadius:8, padding:4 },
  qtyBtn:   { width:26, height:26, alignItems:'center', justifyContent:'center' },
  qtyBtnTxt:{ color:'#fff', fontSize:18, fontWeight:'700' },
  qty:      { color:'#fff', fontSize:13, fontWeight:'700', minWidth:18, textAlign:'center' },
});

const s = StyleSheet.create({
  header:        { backgroundColor:'#fff', paddingHorizontal:16, paddingBottom:10, borderBottomWidth:1, borderBottomColor:'#eee' },
  pageTitle:     { fontSize:20, fontWeight:'700', color:'#1a1a1a' },
  locSub:        { fontSize:12, color:'#888', marginTop:2 },
  row:           { flexDirection:'row', alignItems:'center', justifyContent:'space-between' },
  etaBanner:     { backgroundColor:'#0c831f', margin:12, borderRadius:12, padding:12, flexDirection:'row', alignItems:'center' },
  etaTitle:      { color:'#fff', fontSize:14, fontWeight:'700', flex:1 },
  etaSub:        { color:'#c8e6c9', fontSize:11 },
  infoBtn:       { backgroundColor:'rgba(255,255,255,0.2)', borderRadius:6, paddingHorizontal:8, paddingVertical:4 },
  infoTxt:       { color:'#fff', fontSize:11 },
  reservedBanner:{ backgroundColor:'#fff8e1', marginHorizontal:12, borderRadius:10, padding:10, marginBottom:8 },
  reservedTxt:   { color:'#f57f17', fontSize:12 },
  coldCard:      { margin:12, backgroundColor:'#e3f2fd', borderRadius:14, padding:14, borderWidth:1, borderColor:'#bbdefb' },
  coldTitle:     { color:'#1565c0', fontSize:14, fontWeight:'700', marginBottom:4 },
  coldSub:       { color:'#42a5f5', fontSize:11, marginBottom:10 },
  coldLabel:     { color:'#1565c0', fontSize:13 },
  bagSection:    { marginHorizontal:12, marginBottom:8, backgroundColor:'#f9f9f9', borderRadius:14, padding:14 },
  bagLabel:      { fontSize:12, fontWeight:'700', color:'#555', marginBottom:8, letterSpacing:.3 },
  billCard:      { margin:12, backgroundColor:'#fff', borderRadius:14, padding:14, borderWidth:1, borderColor:'#eee', elevation:1 },
  billTitle:     { fontSize:14, fontWeight:'700', color:'#1a1a1a', marginBottom:12 },
  billRow:       { flexDirection:'row', justifyContent:'space-between', paddingVertical:5 },
  billLabel:     { color:'#555', fontSize:13 },
  billVal:       { color:'#1a1a1a', fontSize:13 },
  toPayLabel:    { fontSize:14, fontWeight:'700', color:'#1a1a1a' },
  toPayVal:      { fontSize:14, fontWeight:'700', color:'#1a1a1a' },
  savingTxt:     { color:'#0c831f', fontSize:12, marginTop:8 },
  payCard:       { marginHorizontal:12, marginBottom:12, backgroundColor:'#fff', borderRadius:14, padding:14, borderWidth:1, borderColor:'#eee' },
  payRow:        { flexDirection:'row', gap:8, flexWrap:'wrap', marginTop:10 },
  payChip:       { backgroundColor:'#f5f5f5', borderRadius:10, paddingHorizontal:12, paddingVertical:8, borderWidth:1, borderColor:'#e0e0e0' },
  payChipTxt:    { fontSize:12, color:'#333' },
  proceedBar:    { position:'absolute', bottom:0, left:0, right:0, backgroundColor:'#fff', borderTopWidth:1, borderTopColor:'#eee', padding:12, flexDirection:'row', alignItems:'center', justifyContent:'space-between' },
  proceedLeft:   { flex:1 },
  proceedCount:  { fontSize:13, fontWeight:'600', color:'#1a1a1a' },
  proceedBtn:    { backgroundColor:'#0c831f', borderRadius:12, paddingVertical:13, paddingHorizontal:24 },
  proceedTxt:    { color:'#fff', fontSize:14, fontWeight:'700' },
});