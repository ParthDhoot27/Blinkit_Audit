import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  Switch, StyleSheet, Modal, Pressable, FlatList
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const PRODUCTS = [
  { id: '1', name: 'Amul Full Cream Milk', qty: '500ml', price: '₹30', emoji: '🥛', lowStock: true },
  { id: '2', name: 'Banana (Elaichi)',      qty: '250g',  price: '₹29', emoji: '🍌', lowStock: false },
  { id: '3', name: 'Britannia Wheat Bread', qty: '400g',  price: '₹45', emoji: '🍞', lowStock: true },
  { id: '4', name: 'Farm Fresh Eggs',       qty: '6 pcs', price: '₹72', emoji: '🥚', lowStock: false },
  { id: '5', name: 'Amul Cheese Slices',    qty: '200g',  price: '₹110',emoji: '🧀', lowStock: false },
  { id: '6', name: 'Coca-Cola Zero',        qty: '750ml', price: '₹55', emoji: '🥤', lowStock: true },
];

const SWAPS = {
  '1': [
    { id:'s1', emoji:'🥛', name:'Amul Toned Milk 500ml',       price:'₹28', tag:'Similar nutrition' },
    { id:'s2', emoji:'🧋', name:'Mother Dairy Full Cream 500ml',price:'₹32', tag:'Same fat content'  },
    { id:'s3', emoji:'🫙', name:'Nestle UHT Milk 200ml ×2',    price:'₹38', tag:'No refrigeration'  },
  ],
  '3': [
    { id:'s4', emoji:'🍞', name:'Modern Harvest Brown 400g',   price:'₹42', tag:'Same wheat'        },
    { id:'s5', emoji:'🥖', name:'Bonn Multi Grain 400g',       price:'₹48', tag:'Higher fiber'      },
    { id:'s6', emoji:'🫓', name:'Britannia White Bread 400g',  price:'₹38', tag:'In stock now'      },
  ],
  '6': [
    { id:'s7', emoji:'🥤', name:'Pepsi Black 750ml',           price:'₹50', tag:'Zero sugar'        },
    { id:'s8', emoji:'🫗', name:'Thums Up Charged 750ml',      price:'₹48', tag:'Strong cola'       },
    { id:'s9', emoji:'💧', name:'Kinley Soda 750ml',           price:'₹20', tag:'Plain sparkling'   },
  ],
};

const CATS = ['All','Fruits & Veg','Dairy','Snacks','Beverages','Personal Care'];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [essentials, setEssentials] = useState(false);
  const [activeCat, setActiveCat]   = useState('All');
  const [swapModal, setSwapModal]   = useState(null); // product id

  return (
    <View style={{ flex:1, backgroundColor:'#0f0f0f' }}>
      {/* ── HEADER ── */}
      <View style={[s.header, { paddingTop: insets.top + 10 }]}>
        <View style={s.locRow}>
          <Text style={s.locTag}>DELIVER TO</Text>
          <Text style={s.locVal}>Malviya Nagar ▾</Text>
        </View>
        {/* Essentials Mode toggle */}
        <View style={s.essBanner}>
          <View>
            <Text style={s.essTitle}>Essentials Mode</Text>
            <Text style={s.essSub}>
              {essentials ? 'Ads hidden · Essentials only' : 'Show only essentials, hide ads'}
            </Text>
          </View>
          <Switch
            value={essentials}
            onValueChange={setEssentials}
            trackColor={{ false:'#444', true:'#F8C300' }}
            thumbColor="#fff"
          />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Search bar */}
        <View style={s.searchBar}>
          <Text style={{ color:'#666', fontSize:13 }}>🔍  Search for groceries...</Text>
        </View>

        {/* Delivery pill */}
        <View style={s.deliveryPill}>
          <View style={s.greenDot} />
          <Text style={s.deliveryText}>Delivery in 10 minutes</Text>
        </View>

        {/* Ad banners — hidden when essentials ON */}
        {!essentials && (
          <>
            <View style={s.adBanner}>
              <View>
                <Text style={s.adTitle}>Big Saving Days!</Text>
                <Text style={s.adSub}>Up to 50% off on snacks &amp; beverages</Text>
              </View>
              <TouchableOpacity style={s.adBtn}><Text style={s.adBtnTxt}>Shop Now</Text></TouchableOpacity>
            </View>
            <View style={[s.adBanner, { backgroundColor:'#1a0a1a', borderColor:'#3a1a3a', marginTop:8 }]}>
              <View>
                <Text style={[s.adTitle, { color:'#e040fb' }]}>Flash Sale: Chocolates</Text>
                <Text style={s.adSub}>Ending in 2:34:11</Text>
              </View>
              <TouchableOpacity style={[s.adBtn, { backgroundColor:'#e040fb' }]}>
                <Text style={s.adBtnTxt}>Grab Now</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* Category chips */}
        <View style={s.sectionHead}>
          <Text style={s.sectionTitle}>Categories</Text>
          <Text style={s.seeAll}>See all</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.catRow}>
          {CATS.map(c => (
            <TouchableOpacity
              key={c}
              style={[s.catChip, activeCat === c && s.catChipActive]}
              onPress={() => setActiveCat(c)}
            >
              <Text style={[s.catChipTxt, activeCat === c && s.catChipTxtActive]}>{c}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Product grid */}
        <View style={s.sectionHead}>
          <Text style={s.sectionTitle}>Fresh Picks</Text>
          <Text style={s.seeAll}>See all</Text>
        </View>
        <View style={s.prodGrid}>
          {PRODUCTS.map((p, i) => (
            <TouchableOpacity
              key={p.id}
              style={[s.prodCard, i % 2 === 0 ? { marginRight: 5 } : { marginLeft: 5 }]}
              activeOpacity={0.85}
              onPress={() => p.lowStock && setSwapModal(p.id)}
            >
              <View style={s.prodImg}>
                <Text style={{ fontSize: 38 }}>{p.emoji}</Text>
                {p.lowStock && <Text style={s.lowBadge}>Low Stock</Text>}
              </View>
              <Text style={s.prodName} numberOfLines={2}>{p.name}</Text>
              <Text style={s.prodQty}>{p.qty}</Text>
              <View style={s.prodFooter}>
                <Text style={s.prodPrice}>{p.price}</Text>
                {p.lowStock
                  ? <TouchableOpacity style={s.notifyBtn} onPress={() => setSwapModal(p.id)}>
                      <Text style={s.notifyTxt}>Swap</Text>
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

      {/* ── SMART-SWAP MODAL ── */}
      <Modal visible={!!swapModal} transparent animationType="slide" onRequestClose={() => setSwapModal(null)}>
        <Pressable style={s.overlay} onPress={() => setSwapModal(null)} />
        <View style={s.sheet}>
          <View style={s.sheetHandle} />
          <Text style={s.sheetTitle}>🤖 Smart-Swap Suggestions</Text>
          <Text style={s.sheetSub}>Out-of-stock alternatives picked for you</Text>
          {(SWAPS[swapModal] || []).map(item => (
            <TouchableOpacity key={item.id} style={s.swapItem} activeOpacity={0.8}>
              <View style={s.swapEmoji}><Text style={{ fontSize:28 }}>{item.emoji}</Text></View>
              <View style={{ flex:1 }}>
                <Text style={s.swapName}>{item.name}</Text>
                <Text style={s.swapPrice}>{item.price}</Text>
                <Text style={s.swapTag}>{item.tag}</Text>
              </View>
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
  header:       { backgroundColor:'#0f0f0f', paddingHorizontal:16, paddingBottom:10 },
  locRow:       { flexDirection:'row', alignItems:'center', gap:8, marginBottom:10 },
  locTag:       { color:'#F8C300', fontSize:11, fontWeight:'700' },
  locVal:       { color:'#fff', fontSize:15, fontWeight:'700' },
  essBanner:    { backgroundColor:'#1a1a1a', borderRadius:12, padding:12, flexDirection:'row', alignItems:'center', justifyContent:'space-between' },
  essTitle:     { color:'#fff', fontSize:14, fontWeight:'600' },
  essSub:       { color:'#888', fontSize:11, marginTop:2 },
  searchBar:    { margin:12, marginTop:12, backgroundColor:'#1e1e1e', borderRadius:12, padding:12, borderWidth:1, borderColor:'#2a2a2a' },
  deliveryPill: { marginHorizontal:16, backgroundColor:'#0f2a0f', borderRadius:10, padding:9, flexDirection:'row', alignItems:'center', gap:8 },
  greenDot:     { width:8, height:8, borderRadius:4, backgroundColor:'#4CAF50' },
  deliveryText: { color:'#7fba7f', fontSize:12, fontWeight:'600' },
  adBanner:     { marginHorizontal:16, marginTop:12, backgroundColor:'#1a1000', borderWidth:1, borderColor:'#3a2800', borderRadius:14, padding:14, flexDirection:'row', alignItems:'center', justifyContent:'space-between' },
  adTitle:      { color:'#F8C300', fontSize:13, fontWeight:'700' },
  adSub:        { color:'#888', fontSize:11, marginTop:2 },
  adBtn:        { backgroundColor:'#F8C300', borderRadius:8, paddingHorizontal:12, paddingVertical:6 },
  adBtnTxt:     { color:'#000', fontSize:11, fontWeight:'700' },
  sectionHead:  { paddingHorizontal:16, paddingTop:14, paddingBottom:8, flexDirection:'row', alignItems:'center', justifyContent:'space-between' },
  sectionTitle: { color:'#fff', fontSize:15, fontWeight:'700' },
  seeAll:       { color:'#F8C300', fontSize:12, fontWeight:'600' },
  catRow:       { paddingHorizontal:16, paddingBottom:12, gap:10 },
  catChip:      { backgroundColor:'#1e1e1e', borderWidth:1, borderColor:'#2a2a2a', borderRadius:20, paddingHorizontal:15, paddingVertical:7 },
  catChipActive:{ backgroundColor:'#F8C300', borderColor:'#F8C300' },
  catChipTxt:   { color:'#ccc', fontSize:12, fontWeight:'500' },
  catChipTxtActive:{ color:'#000' },
  prodGrid:     { flexDirection:'row', flexWrap:'wrap', paddingHorizontal:16, paddingBottom:16 },
  prodCard:     { width:'50%', backgroundColor:'#1e1e1e', borderRadius:14, padding:12, borderWidth:1, borderColor:'#2a2a2a', marginBottom:10 },
  prodImg:      { aspectRatio:1, backgroundColor:'#2a2a2a', borderRadius:10, alignItems:'center', justifyContent:'center', marginBottom:8, position:'relative' },
  lowBadge:     { position:'absolute', top:6, left:6, backgroundColor:'#c0392b', color:'#fff', fontSize:9, fontWeight:'700', paddingHorizontal:7, paddingVertical:3, borderRadius:6, overflow:'hidden' },
  prodName:     { color:'#fff', fontSize:12, fontWeight:'600', marginBottom:3, lineHeight:16 },
  prodQty:      { color:'#888', fontSize:11, marginBottom:8 },
  prodFooter:   { flexDirection:'row', alignItems:'center', justifyContent:'space-between' },
  prodPrice:    { color:'#fff', fontSize:13, fontWeight:'700' },
  addBtn:       { backgroundColor:'#F8C300', borderRadius:8, paddingHorizontal:12, paddingVertical:5 },
  addBtnTxt:    { color:'#000', fontSize:12, fontWeight:'700' },
  notifyBtn:    { backgroundColor:'#2a2000', borderRadius:8, paddingHorizontal:10, paddingVertical:5 },
  notifyTxt:    { color:'#F8C300', fontSize:11, fontWeight:'700' },
  overlay:      { flex:1, backgroundColor:'rgba(0,0,0,0.75)' },
  sheet:        { backgroundColor:'#1a1a1a', borderTopLeftRadius:22, borderTopRightRadius:22, padding:20, maxHeight:'75%' },
  sheetHandle:  { width:40, height:4, backgroundColor:'#444', borderRadius:2, alignSelf:'center', marginBottom:16 },
  sheetTitle:   { color:'#F8C300', fontSize:16, fontWeight:'700', marginBottom:4 },
  sheetSub:     { color:'#888', fontSize:12, marginBottom:16 },
  swapItem:     { backgroundColor:'#242424', borderRadius:14, padding:12, flexDirection:'row', alignItems:'center', gap:12, marginBottom:10 },
  swapEmoji:    { width:50, height:50, backgroundColor:'#2e2e2e', borderRadius:10, alignItems:'center', justifyContent:'center' },
  swapName:     { color:'#fff', fontSize:13, fontWeight:'600' },
  swapPrice:    { color:'#aaa', fontSize:12, marginTop:2 },
  swapTag:      { color:'#4CAF50', fontSize:11, marginTop:2 },
  cancelBtn:    { backgroundColor:'#2a2a2a', borderRadius:12, padding:13, alignItems:'center', marginTop:4 },
  cancelTxt:    { color:'#888', fontSize:13 },
});