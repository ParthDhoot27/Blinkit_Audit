import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Switch, Modal, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getProducts, getSwaps, updateUser } from '../db';

const CATS = ['All','Dairy','Snacks','Fruits','Bakery','Beverages','Pharma','Baby'];

export default function HomeScreen({ user, setUser }) {
  const insets = useSafeAreaInsets();
  const [products, setProducts]     = useState([]);
  const [cat, setCat]               = useState('All');
  const [essentials, setEssentials] = useState(user?.essentialsMode || false);
  const [swapModal, setSwapModal]   = useState(null);
  const [swaps, setSwaps]           = useState([]);

  useEffect(() => { getProducts().then(setProducts); }, []);

  async function toggleEssentials(val) {
    setEssentials(val);
    const updated = await updateUser(user.id, { essentialsMode: val });
    setUser(updated);
  }

  async function openSwap(p) {
    const s = await getSwaps(p.id);
    setSwaps(s);
    setSwapModal(p);
  }

  const filtered = cat === 'All' ? products : products.filter(p => p.category === cat);

  return (
    <View style={{ flex:1, backgroundColor:'#fff' }}>
      {/* Header */}
      <View style={[s.header, { paddingTop: insets.top + 8 }]}>
        <View style={s.locRow}>
          <Text style={s.delivering}>Delivering to</Text>
          <View style={s.logoWrap}><Text style={s.logo}>blinkit</Text></View>
          <TouchableOpacity style={s.iconBtn}><Text>🔔</Text></TouchableOpacity>
          <TouchableOpacity style={s.iconBtn}><Text>👤</Text></TouchableOpacity>
        </View>
        <Text style={s.locVal}>{user?.addresses?.[0]?.city || 'Jaipur'}, {user?.addresses?.[0]?.lane || ''} ▾</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Search */}
        <View style={s.searchBar}>
          <Text style={s.searchIcon}>🔍</Text>
          <Text style={s.searchPh}>Search milk, eggs, bread...</Text>
          <TouchableOpacity style={s.scanBtn}><Text style={s.scanTxt}>Scan</Text></TouchableOpacity>
        </View>

        {/* Essentials mode — AUDIT FEATURE 4 */}
        <View style={s.essBanner}>
          <View style={s.essLeft}>
            <Text style={{ fontSize:16 }}>✨</Text>
            <View>
              <Text style={s.essTitle}>Essentials Mode</Text>
              <Text style={s.essSub}>{essentials ? 'Ads hidden' : 'Hide ads & promos'}</Text>
            </View>
          </View>
          <Switch value={essentials} onValueChange={toggleEssentials}
            trackColor={{ false:'#ddd', true:'#0c831f' }} thumbColor="#fff" />
        </View>

        {/* Delivery guarantee */}
        <View style={s.guaranteeRow}>
          <Text style={s.guaranteeTxt}>✅ 99% orders delivered correctly</Text>
          <Text style={s.guaranteeTxt}>⚡ Instant refund guarantee</Text>
        </View>

        {/* Promo banner — hidden in essentials */}
        {!essentials && (
          <View style={s.promoBanner}>
            <View>
              <Text style={s.promoLabel}>LIMITED TIME</Text>
              <Text style={s.promoTitle}>Flat ₹60 OFF</Text>
              <Text style={s.promoSub}>On orders above ₹399</Text>
            </View>
            <TouchableOpacity style={s.grabBtn}><Text style={s.grabTxt}>Grab Now</Text></TouchableOpacity>
          </View>
        )}

        {/* Buy again */}
        <View style={s.sectionHead}>
          <Text style={s.sectionTitle}>Buy again</Text>
          <Text style={s.seeAll}>See all</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal:16, gap:12, paddingBottom:8 }}>
          {(user?.orders?.[0]?.items || []).map(item => (
            <View key={item.id} style={s.buyAgainCard}>
              <Text style={{ fontSize:28 }}>{item.emoji}</Text>
              <Text style={s.buyAgainName} numberOfLines={2}>{item.name}</Text>
              <TouchableOpacity style={s.addSmallBtn}><Text style={s.addSmallTxt}>+ Add</Text></TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        {/* Categories */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal:16, gap:8, paddingVertical:8 }}>
          {CATS.map(c => (
            <TouchableOpacity key={c} style={[s.catChip, cat===c && s.catActive]} onPress={() => setCat(c)}>
              <Text style={[s.catTxt, cat===c && s.catActiveTxt]}>{c}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Product grid */}
        <Text style={[s.sectionTitle, { paddingHorizontal:16, marginBottom:8 }]}>Fresh picks for you</Text>
        <View style={s.grid}>
          {filtered.map((p, i) => (
            <TouchableOpacity key={p.id} style={[s.prodCard, i%2===0 ? { marginRight:5 } : { marginLeft:5 }]}
              activeOpacity={0.85} onPress={() => p.lowStock && openSwap(p)}>
              <View style={s.prodImg}>
                <Text style={{ fontSize:38 }}>{p.emoji}</Text>
                {/* AUDIT FEATURE 1: Low Stock badge */}
                {p.lowStock && <Text style={s.lowBadge}>Low Stock</Text>}
              </View>
              <Text style={s.prodName} numberOfLines={2}>{p.name}</Text>
              <Text style={s.prodQty}>{p.qty}</Text>
              <View style={s.prodFooter}>
                <Text style={s.prodPrice}>₹{p.price}</Text>
                {p.lowStock
                  ? <TouchableOpacity style={s.swapBtn} onPress={() => openSwap(p)}>
                      <Text style={s.swapBtnTxt}>Swap</Text>
                    </TouchableOpacity>
                  : <TouchableOpacity style={s.addBtn}>
                      <Text style={s.addBtnTxt}>+ Add</Text>
                    </TouchableOpacity>
                }
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Smart Swap Modal — AUDIT FEATURE 1 */}
      <Modal visible={!!swapModal} transparent animationType="slide" onRequestClose={() => setSwapModal(null)}>
        <Pressable style={s.overlay} onPress={() => setSwapModal(null)} />
        <View style={s.sheet}>
          <View style={s.sheetHandle} />
          <Text style={s.sheetTitle}>🤖 Smart-Swap</Text>
          <Text style={s.sheetSub}>{swapModal?.name} is low — pick an alternative</Text>
          {swaps.map(item => (
            <TouchableOpacity key={item.id} style={s.swapItem}>
              <Text style={{ fontSize:28, width:44, textAlign:'center' }}>{item.emoji}</Text>
              <View style={{ flex:1 }}>
                <Text style={s.swapName}>{item.name}</Text>
                <Text style={s.swapTag}>{item.tag}</Text>
              </View>
              <Text style={s.swapPrice}>₹{item.price}</Text>
              <TouchableOpacity style={s.addBtn}><Text style={s.addBtnTxt}>Add</Text></TouchableOpacity>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={s.cancelBtn} onPress={() => setSwapModal(null)}>
            <Text style={s.cancelTxt}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  header:       { backgroundColor:'#0c831f', paddingHorizontal:16, paddingBottom:10 },
  locRow:       { flexDirection:'row', alignItems:'center', gap:6 },
  delivering:   { color:'#fff', fontSize:11 },
  logoWrap:     { flex:1 },
  logo:         { color:'#F8C300', fontSize:22, fontWeight:'900', fontStyle:'italic' },
  iconBtn:      { padding:6 },
  locVal:       { color:'#fff', fontSize:13, fontWeight:'600', marginTop:2 },
  searchBar:    { flexDirection:'row', alignItems:'center', margin:12, backgroundColor:'#f5f5f5', borderRadius:10, padding:10, gap:8, borderWidth:1, borderColor:'#e0e0e0' },
  searchIcon:   { fontSize:16 },
  searchPh:     { flex:1, color:'#aaa', fontSize:13 },
  scanBtn:      { backgroundColor:'#0c831f', borderRadius:8, paddingHorizontal:10, paddingVertical:5 },
  scanTxt:      { color:'#fff', fontSize:12, fontWeight:'600' },
  essBanner:    { flexDirection:'row', alignItems:'center', justifyContent:'space-between', marginHorizontal:12, marginBottom:8, backgroundColor:'#f0faf0', borderRadius:12, padding:10, borderWidth:1, borderColor:'#c8e6c9' },
  essLeft:      { flexDirection:'row', alignItems:'center', gap:8 },
  essTitle:     { fontSize:13, fontWeight:'700', color:'#1a1a1a' },
  essSub:       { fontSize:11, color:'#888' },
  guaranteeRow: { flexDirection:'row', gap:8, paddingHorizontal:12, marginBottom:10, flexWrap:'wrap' },
  guaranteeTxt: { fontSize:11, color:'#0c831f', fontWeight:'500' },
  promoBanner:  { marginHorizontal:12, backgroundColor:'#0c831f', borderRadius:14, padding:14, flexDirection:'row', alignItems:'center', justifyContent:'space-between', marginBottom:8 },
  promoLabel:   { color:'#F8C300', fontSize:10, fontWeight:'700' },
  promoTitle:   { color:'#fff', fontSize:20, fontWeight:'900' },
  promoSub:     { color:'#c8e6c9', fontSize:11 },
  grabBtn:      { backgroundColor:'#F8C300', borderRadius:10, paddingHorizontal:16, paddingVertical:10 },
  grabTxt:      { color:'#000', fontSize:13, fontWeight:'700' },
  sectionHead:  { flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingHorizontal:16, paddingTop:8, paddingBottom:6 },
  sectionTitle: { fontSize:15, fontWeight:'700', color:'#1a1a1a' },
  seeAll:       { color:'#0c831f', fontSize:12, fontWeight:'600' },
  buyAgainCard: { width:90, backgroundColor:'#f9f9f9', borderRadius:12, padding:8, alignItems:'center', borderWidth:1, borderColor:'#eee' },
  buyAgainName: { fontSize:10, textAlign:'center', color:'#333', marginVertical:4 },
  addSmallBtn:  { backgroundColor:'#0c831f', borderRadius:6, paddingHorizontal:8, paddingVertical:3 },
  addSmallTxt:  { color:'#fff', fontSize:10, fontWeight:'700' },
  catChip:      { backgroundColor:'#f5f5f5', borderRadius:20, paddingHorizontal:14, paddingVertical:7, borderWidth:1, borderColor:'#e0e0e0' },
  catActive:    { backgroundColor:'#0c831f', borderColor:'#0c831f' },
  catTxt:       { fontSize:12, color:'#555', fontWeight:'500' },
  catActiveTxt: { color:'#fff' },
  grid:         { flexDirection:'row', flexWrap:'wrap', paddingHorizontal:12, paddingBottom:16 },
  prodCard:     { width:'50%', backgroundColor:'#fff', borderRadius:14, padding:12, borderWidth:1, borderColor:'#eee', marginBottom:10, elevation:1 },
  prodImg:      { aspectRatio:1, backgroundColor:'#f9f9f9', borderRadius:10, alignItems:'center', justifyContent:'center', marginBottom:8, position:'relative' },
  lowBadge:     { position:'absolute', top:6, left:6, backgroundColor:'#ff6b35', borderRadius:6, paddingHorizontal:6, paddingVertical:2, overflow:'hidden' },
  prodName:     { fontSize:12, fontWeight:'600', color:'#1a1a1a', marginBottom:3, lineHeight:16 },
  prodQty:      { fontSize:11, color:'#888', marginBottom:8 },
  prodFooter:   { flexDirection:'row', alignItems:'center', justifyContent:'space-between' },
  prodPrice:    { fontSize:13, fontWeight:'700', color:'#1a1a1a' },
  addBtn:       { backgroundColor:'#0c831f', borderRadius:8, paddingHorizontal:12, paddingVertical:5 },
  addBtnTxt:    { color:'#fff', fontSize:12, fontWeight:'700' },
  swapBtn:      { backgroundColor:'#fff3e0', borderRadius:8, paddingHorizontal:10, paddingVertical:5 },
  swapBtnTxt:   { color:'#e65100', fontSize:11, fontWeight:'700' },
  overlay:      { flex:1, backgroundColor:'rgba(0,0,0,0.5)' },
  sheet:        { backgroundColor:'#fff', borderTopLeftRadius:20, borderTopRightRadius:20, padding:20, maxHeight:'70%' },
  sheetHandle:  { width:40, height:4, backgroundColor:'#ddd', borderRadius:2, alignSelf:'center', marginBottom:14 },
  sheetTitle:   { fontSize:16, fontWeight:'700', color:'#1a1a1a', marginBottom:4 },
  sheetSub:     { fontSize:12, color:'#888', marginBottom:14 },
  swapItem:     { flexDirection:'row', alignItems:'center', gap:10, padding:12, backgroundColor:'#f9f9f9', borderRadius:12, marginBottom:8 },
  swapName:     { fontSize:13, fontWeight:'600', color:'#1a1a1a' },
  swapTag:      { fontSize:11, color:'#0c831f', marginTop:2 },
  swapPrice:    { fontSize:13, fontWeight:'700', color:'#1a1a1a' },
  cancelBtn:    { backgroundColor:'#f5f5f5', borderRadius:12, padding:13, alignItems:'center', marginTop:4 },
  cancelTxt:    { color:'#888', fontSize:13 },
});