import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const BAGS = {
  1: {
    driver:'Ravi Kumar', eta:'Arriving in 4 mins',
    steps:[
      { label:'Order Placed',        time:'9:38 AM',                  state:'done'    },
      { label:'Store Packed',        time:'9:42 AM',                  state:'done'    },
      { label:'Out for Delivery',    time:'9:46 AM · 0.4 km away',   state:'active'  },
      { label:'Delivered',           time:'Est. 9:50 AM',             state:'pending' },
    ],
    items:[
      { emoji:'🍌', name:'Banana (Elaichi)',  status:'Packed',  statusType:'done'    },
      { emoji:'🥚', name:'Farm Fresh Eggs',   status:'Packed',  statusType:'done'    },
      { emoji:'🍞', name:'Brown Bread',       status:'Packed',  statusType:'done'    },
    ],
  },
  2: {
    driver:'Suresh Yadav', eta:'Arriving in 11 mins',
    steps:[
      { label:'Order Placed',               time:'9:38 AM',   state:'done'    },
      { label:'Being Packed (Cold Storage)',time:'9:45 AM',   state:'active'  },
      { label:'Out for Delivery',           time:'Est. 9:50', state:'pending' },
      { label:'Delivered',                  time:'Est. 9:57', state:'pending' },
    ],
    items:[
      { emoji:'🧀', name:'Amul Cheese Slices', status:'Packing', statusType:'packing' },
      { emoji:'🥛', name:'Amul Butter',         status:'Packing', statusType:'packing' },
      { emoji:'🍦', name:"Kwality Wall's Cone", status:'Packing', statusType:'packing' },
    ],
  },
};

const DOT_STYLE = { done:'#F8C300', active:'transparent', pending:'transparent' };
const DOT_BORDER = { done:'#F8C300', active:'#F8C300', pending:'#333' };
const LABEL_COLOR = { done:'#fff', active:'#F8C300', pending:'#444' };

export default function TrackScreen() {
  const insets = useSafeAreaInsets();
  const [activeBag, setActiveBag] = useState(1);
  const bag = BAGS[activeBag];

  return (
    <View style={{ flex:1, backgroundColor:'#0f0f0f' }}>
      <View style={[s.header, { paddingTop: insets.top + 10 }]}>
        <Text style={s.pageTitle}>Order #BL2891</Text>
        <Text style={s.pageSub}>Split into 2 bags · Both on the way</Text>
      </View>

      {/* Bag tabs */}
      <View style={s.tabRow}>
        {[1,2].map(n => (
          <TouchableOpacity key={n} style={[s.tab, activeBag===n && s.tabActive]} onPress={() => setActiveBag(n)}>
            <Text style={[s.tabTxt, activeBag===n && s.tabTxtActive]}>
              {n===1 ? 'Bag 1 — Grocery' : 'Bag 2 — Cold Items'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Driver card */}
        <View style={s.card}>
          <View style={s.driverRow}>
            <View style={s.driverAvatar}><Text style={{ fontSize:22 }}>🛵</Text></View>
            <View style={{ flex:1 }}>
              <Text style={s.driverName}>{bag.driver}</Text>
              <Text style={s.driverEta}>{bag.eta}</Text>
            </View>
            <TouchableOpacity style={s.callBtn}><Text>📞</Text></TouchableOpacity>
          </View>
          {/* Steps */}
          {bag.steps.map((step, i) => (
            <View key={i} style={s.stepRow}>
              <View style={{ alignItems:'center' }}>
                <View style={[s.dot, { backgroundColor: DOT_STYLE[step.state], borderColor: DOT_BORDER[step.state] }]}>
                  {step.state === 'done' && <Text style={{ color:'#000', fontSize:11, fontWeight:'700' }}>✓</Text>}
                  {step.state === 'active' && <View style={s.activeDotInner} />}
                </View>
                {i < bag.steps.length - 1 && <View style={s.stepLine} />}
              </View>
              <View style={{ flex:1, paddingBottom: i < bag.steps.length-1 ? 20 : 0 }}>
                <Text style={[s.stepLabel, { color: LABEL_COLOR[step.state] }]}>{step.label}</Text>
                <Text style={s.stepTime}>{step.time}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Items in bag */}
        <View style={s.card}>
          <Text style={s.sectionLabel}>ITEMS IN THIS BAG</Text>
          {bag.items.map((item, i) => (
            <View key={i} style={[s.bagItemRow, i < bag.items.length-1 && { borderBottomWidth:1, borderBottomColor:'#2a2a2a' }]}>
              <Text style={{ fontSize:20, width:32, textAlign:'center' }}>{item.emoji}</Text>
              <Text style={{ color:'#ccc', fontSize:12, flex:1 }}>{item.name}</Text>
              <View style={item.statusType==='done' ? s.badgeDone : s.badgePacking}>
                <Text style={item.statusType==='done' ? s.badgeDoneTxt : s.badgePackingTxt}>{item.status}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  header:        { backgroundColor:'#0f0f0f', paddingHorizontal:16, paddingBottom:10 },
  pageTitle:     { color:'#fff', fontSize:20, fontWeight:'700' },
  pageSub:       { color:'#888', fontSize:12, marginTop:2 },
  tabRow:        { flexDirection:'row', gap:8, paddingHorizontal:16, paddingBottom:12 },
  tab:           { backgroundColor:'#1e1e1e', borderWidth:1.5, borderColor:'#2a2a2a', borderRadius:20, paddingHorizontal:16, paddingVertical:8 },
  tabActive:     { backgroundColor:'#F8C300', borderColor:'#F8C300' },
  tabTxt:        { color:'#888', fontSize:12, fontWeight:'600' },
  tabTxtActive:  { color:'#000' },
  card:          { backgroundColor:'#1e1e1e', borderRadius:18, borderWidth:1, borderColor:'#2a2a2a', padding:16, marginHorizontal:16, marginBottom:12 },
  driverRow:     { flexDirection:'row', alignItems:'center', gap:12, marginBottom:16 },
  driverAvatar:  { width:44, height:44, borderRadius:22, backgroundColor:'#F8C300', alignItems:'center', justifyContent:'center' },
  driverName:    { color:'#fff', fontSize:14, fontWeight:'600' },
  driverEta:     { color:'#F8C300', fontSize:12, marginTop:2 },
  callBtn:       { backgroundColor:'#2a2a2a', borderRadius:10, padding:10 },
  stepRow:       { flexDirection:'row', gap:12 },
  dot:           { width:24, height:24, borderRadius:12, borderWidth:2, alignItems:'center', justifyContent:'center' },
  activeDotInner:{ width:8, height:8, borderRadius:4, backgroundColor:'#F8C300' },
  stepLine:      { width:2, flex:1, backgroundColor:'#2a2a2a', marginVertical:2 },
  stepLabel:     { fontSize:13, fontWeight:'600' },
  stepTime:      { color:'#666', fontSize:11, marginTop:2 },
  sectionLabel:  { color:'#888', fontSize:11, fontWeight:'700', letterSpacing:.5, marginBottom:10 },
  bagItemRow:    { flexDirection:'row', alignItems:'center', gap:10, paddingVertical:8 },
  badgeDone:     { backgroundColor:'#0f2a0f', borderRadius:6, paddingHorizontal:8, paddingVertical:3 },
  badgeDoneTxt:  { color:'#4CAF50', fontSize:10, fontWeight:'700' },
  badgePacking:  { backgroundColor:'#2a2200', borderRadius:6, paddingHorizontal:8, paddingVertical:3 },
  badgePackingTxt:{ color:'#F8C300', fontSize:10, fontWeight:'700' },
});