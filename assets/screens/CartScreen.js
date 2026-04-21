import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const COLD_ITEMS    = [
  { id:'c1', emoji:'🧀', name:'Amul Cheese Slices 200g', qty:'×1', price:110 },
  { id:'c2', emoji:'🥛', name:'Amul Butter 500g',         qty:'×1', price:60  },
  { id:'c3', emoji:'🍦', name:"Kwality Wall's Cone",      qty:'×2', price:80  },
];
const REGULAR_ITEMS = [
  { id:'r1', emoji:'🍌', name:'Banana (Elaichi) 250g', qty:'×1', price:29 },
  { id:'r2', emoji:'🥚', name:'Farm Fresh Eggs',        qty:'×6', price:72 },
  { id:'r3', emoji:'🍞', name:'Brown Bread 400g',       qty:'×1', price:45 },
];

export default function CartScreen() {
  const insets = useSafeAreaInsets();
  const [coldSep, setColdSep] = useState(true);
  const total = 398;

  return (
    <View style={{ flex:1, backgroundColor:'#0f0f0f' }}>
      <View style={[s.header, { paddingTop: insets.top + 10 }]}>
        <Text style={s.pageTitle}>Your Cart</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Cold Items Toggle */}
        <View style={s.coldCard}>
          <Text style={s.coldTitle}>❄  Separate Cold Items</Text>
          <Text style={s.coldSub}>Pack dairy &amp; frozen items separately to prevent damage</Text>
          <View style={s.row}>
            <Text style={s.coldLabel}>Enable cold item separation</Text>
            <Switch
              value={coldSep}
              onValueChange={setColdSep}
              trackColor={{ false:'#444', true:'#F8C300' }}
              thumbColor="#fff"
            />
          </View>
        </View>

        {/* Packing visual */}
        {coldSep ? (
          <View style={s.packingBox}>
            <View style={s.coldSection}>
              <Text style={s.coldSecLabel}>❄  COLD BAG — packed separately</Text>
              {COLD_ITEMS.map(i => <ItemRow key={i.id} item={i} cold />)}
            </View>
            <View style={s.regularSection}>
              <Text style={s.regSecLabel}>REGULAR BAG</Text>
              {REGULAR_ITEMS.map(i => <ItemRow key={i.id} item={i} />)}
            </View>
          </View>
        ) : (
          <View style={s.packingBox}>
            <View style={s.regularSection}>
              <Text style={s.regSecLabel}>ALL ITEMS — single bag</Text>
              {[...COLD_ITEMS, ...REGULAR_ITEMS].map(i => <ItemRow key={i.id} item={i} />)}
            </View>
          </View>
        )}

        {/* Price summary */}
        <View style={s.summaryCard}>
          {[['Items total','₹368'],['Delivery fee','₹25'],['Platform fee','₹5']].map(([l,v]) => (
            <View key={l} style={[s.row, { paddingVertical:6, borderBottomWidth:1, borderBottomColor:'#2a2a2a' }]}>
              <Text style={s.priceLabel}>{l}</Text>
              <Text style={s.priceVal}>{v}</Text>
            </View>
          ))}
          <View style={[s.row, { paddingTop:10 }]}>
            <Text style={s.totalLabel}>Total</Text>
            <Text style={s.totalVal}>₹{total}</Text>
          </View>
        </View>
        <View style={{ height: 90 }} />
      </ScrollView>

      {/* Sticky checkout */}
      <View style={[s.checkoutBar, { paddingBottom: insets.bottom + 12 }]}>
        <TouchableOpacity style={s.checkoutBtn} activeOpacity={0.85}>
          <Text style={s.checkoutTxt}>Place Order • ₹{total}</Text>
          <Text style={s.checkoutArrow}>→</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function ItemRow({ item, cold }) {
  return (
    <View style={{ flexDirection:'row', alignItems:'center', gap:10, paddingVertical:6, borderBottomWidth:1, borderBottomColor: cold ? '#0d2030' : '#222' }}>
      <Text style={{ fontSize:18, width:28, textAlign:'center' }}>{item.emoji}</Text>
      <Text style={{ color:'#ccc', fontSize:12, flex:1 }}>{item.name}</Text>
      <Text style={{ color:'#666', fontSize:11 }}>{item.qty}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  header:        { backgroundColor:'#0f0f0f', paddingHorizontal:16, paddingBottom:12 },
  pageTitle:     { color:'#fff', fontSize:20, fontWeight:'700' },
  row:           { flexDirection:'row', alignItems:'center', justifyContent:'space-between' },
  coldCard:      { margin:16, backgroundColor:'#081520', borderWidth:1, borderColor:'#1a3a5a', borderRadius:16, padding:14 },
  coldTitle:     { color:'#64b5f6', fontSize:14, fontWeight:'700', marginBottom:4 },
  coldSub:       { color:'#4a7f9a', fontSize:11, marginBottom:12 },
  coldLabel:     { color:'#90caf9', fontSize:13 },
  packingBox:    { marginHorizontal:16, marginBottom:12, borderRadius:14, overflow:'hidden', borderWidth:1, borderColor:'#2a2a2a' },
  coldSection:   { backgroundColor:'#081520', padding:14 },
  coldSecLabel:  { color:'#64b5f6', fontSize:10, fontWeight:'700', letterSpacing:.5, marginBottom:8 },
  regularSection:{ backgroundColor:'#1a1a1a', padding:14 },
  regSecLabel:   { color:'#888', fontSize:10, fontWeight:'700', letterSpacing:.5, marginBottom:8 },
  summaryCard:   { marginHorizontal:16, marginBottom:12, backgroundColor:'#1e1e1e', borderRadius:14, padding:14, borderWidth:1, borderColor:'#2a2a2a' },
  priceLabel:    { color:'#888', fontSize:13 },
  priceVal:      { color:'#ccc', fontSize:13 },
  totalLabel:    { color:'#fff', fontSize:14, fontWeight:'700' },
  totalVal:      { color:'#F8C300', fontSize:14, fontWeight:'700' },
  checkoutBar:   { position:'absolute', bottom:0, left:0, right:0, backgroundColor:'#0f0f0f', borderTopWidth:1, borderTopColor:'#1a1a1a', paddingHorizontal:16, paddingTop:12 },
  checkoutBtn:   { backgroundColor:'#F8C300', borderRadius:14, paddingVertical:15, paddingHorizontal:20, flexDirection:'row', alignItems:'center', justifyContent:'space-between' },
  checkoutTxt:   { color:'#000', fontSize:15, fontWeight:'700' },
  checkoutArrow: { color:'#000', fontSize:18, fontWeight:'700' },
});