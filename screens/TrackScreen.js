import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const BAGS = {
  1: {
    driver:'Rahul Kumar', rating:'4.6', dist:'1 stop before you · 42 m left',
    eta:'7 min away', steps:[
      { label:'Order placed',      time:'',         state:'done'    },
      { label:'Packed & checked',  time:'',         state:'done'    },
      { label:'Out for delivery',  time:'',         state:'active'  },
      { label:'Delivered',         time:'',         state:'pending' },
    ],
    items:[
      { emoji:'🥛', name:'Amul Taza Milk', status:'Packed' },
      { emoji:'🥚', name:'Farm Fresh Eggs', status:'Packed' },
    ],
    warning:'Rahul has 1 order before yours. If delivery exceeds 15 min, you get ₹20 off automatically.',
  },
  2: {
    driver:'Suresh Yadav', rating:'4.3', dist:'En route to cold storage',
    eta:'15 min away', steps:[
      { label:'Order placed',      time:'', state:'done'    },
      { label:'Packed & checked',  time:'', state:'active'  },
      { label:'Out for delivery',  time:'', state:'pending' },
      { label:'Delivered',         time:'', state:'pending' },
    ],
    items:[
      { emoji:'🧀', name:'Amul Cheese', status:'Packing' },
      { emoji:'🥛', name:'Amul Dahi',   status:'Packing' },
    ],
    warning: null,
  },
};

export default function TrackScreen({ user }) {
  const insets = useSafeAreaInsets();
  const [activeBag, setActiveBag] = useState(1);
  const bag = BAGS[activeBag];

  return (
    <View style={{ flex:1, backgroundColor:'#fff' }}>
      <View style={[s.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity><Text style={s.back}>←</Text></TouchableOpacity>
        <View>
          <Text style={s.pageTitle}>Order tracking</Text>
          <Text style={s.orderNum}>Order #BL24036291</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ETA */}
        <View style={s.etaCard}>
          <Text style={s.etaMin}>{bag.eta}</Text>
          <View style={s.etaRow}>
            <Text style={s.etaRider}>🛵 Rahul is on the way with your order</Text>
          </View>
          <Text style={s.etaDelay}>⚠ Delayed beyond 15 min — auto ₹20 coupon</Text>
        </View>

        {/* Bag tabs — AUDIT FEATURE 2 */}
        <View style={s.tabRow}>
          {[1,2].map(n => (
            <TouchableOpacity key={n} style={[s.tab, activeBag===n && s.tabActive]} onPress={() => setActiveBag(n)}>
              <Text style={[s.tabTxt, activeBag===n && s.tabActiveTxt]}>
                {n===1 ? 'Bag 1 — Grocery' : 'Bag 2 — Cold'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Steps */}
        <View style={s.stepsCard}>
          {bag.steps.map((step, i) => (
            <View key={i} style={s.stepRow}>
              <View style={{ alignItems:'center' }}>
                <View style={[s.dot,
                  step.state==='done'    && s.dotDone,
                  step.state==='active'  && s.dotActive,
                  step.state==='pending' && s.dotPending,
                ]}>
                  {step.state==='done'   && <Text style={{ color:'#fff', fontSize:11 }}>✓</Text>}
                  {step.state==='active' && <View style={s.dotActivePulse} />}
                </View>
                {i < bag.steps.length-1 && <View style={[s.stepLine, step.state==='done' && s.stepLineDone]} />}
              </View>
              <View style={{ flex:1, paddingBottom: i < bag.steps.length-1 ? 20 : 0 }}>
                <Text style={[s.stepLabel,
                  step.state==='done'    && { color:'#1a1a1a' },
                  step.state==='active'  && { color:'#0c831f', fontWeight:'700' },
                  step.state==='pending' && { color:'#ccc' },
                ]}>{step.label}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Map placeholder */}
        <View style={s.mapBox}>
          <Text style={{ fontSize:40 }}>🗺</Text>
          <Text style={s.mapLabel}>ETA {bag.eta}</Text>
        </View>

        {/* Driver info */}
        <View style={s.driverCard}>
          <View style={s.driverAvatar}><Text style={{ fontSize:22 }}>👤</Text></View>
          <View style={{ flex:1 }}>
            <Text style={s.driverName}>{bag.driver}</Text>
            <Text style={s.driverMeta}>⭐ {bag.rating} · {bag.dist}</Text>
          </View>
          <TouchableOpacity style={s.callBtn}><Text>📞</Text></TouchableOpacity>
          <TouchableOpacity style={s.callBtn}><Text>💬</Text></TouchableOpacity>
        </View>

        {/* Warning */}
        {bag.warning && (
          <View style={s.warningCard}>
            <Text style={s.warningTxt}>⚠ {bag.warning}</Text>
          </View>
        )}

        {/* Quick messages */}
        <Text style={[s.pageTitle, { paddingHorizontal:16, marginBottom:8, fontSize:13 }]}>Quick message to rider</Text>
        <View style={s.msgRow}>
          {['Call on arrival','Leave at door','OTP required 🔒'].map(m => (
            <TouchableOpacity key={m} style={s.msgBtn}><Text style={s.msgTxt}>{m}</Text></TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  header:         { flexDirection:'row', alignItems:'center', gap:12, paddingHorizontal:16, paddingBottom:10, borderBottomWidth:1, borderBottomColor:'#eee' },
  back:           { fontSize:22, color:'#0c831f' },
  pageTitle:      { fontSize:16, fontWeight:'700', color:'#1a1a1a' },
  orderNum:       { fontSize:11, color:'#888' },
  etaCard:        { backgroundColor:'#e8f5e9', margin:12, borderRadius:14, padding:16 },
  etaMin:         { fontSize:28, fontWeight:'900', color:'#1a1a1a', marginBottom:4 },
  etaRow:         { flexDirection:'row', alignItems:'center', gap:6 },
  etaRider:       { fontSize:12, color:'#0c831f', fontWeight:'600' },
  etaDelay:       { fontSize:11, color:'#888', marginTop:6 },
  tabRow:         { flexDirection:'row', gap:8, paddingHorizontal:12, marginBottom:8 },
  tab:            { flex:1, backgroundColor:'#f5f5f5', borderRadius:20, paddingVertical:8, alignItems:'center', borderWidth:1, borderColor:'#e0e0e0' },
  tabActive:      { backgroundColor:'#0c831f', borderColor:'#0c831f' },
  tabTxt:         { fontSize:12, fontWeight:'600', color:'#888' },
  tabActiveTxt:   { color:'#fff' },
  stepsCard:      { marginHorizontal:12, backgroundColor:'#f9f9f9', borderRadius:14, padding:16, marginBottom:8 },
  stepRow:        { flexDirection:'row', gap:12 },
  dot:            { width:24, height:24, borderRadius:12, alignItems:'center', justifyContent:'center', borderWidth:2 },
  dotDone:        { backgroundColor:'#0c831f', borderColor:'#0c831f' },
  dotActive:      { backgroundColor:'#fff', borderColor:'#0c831f' },
  dotPending:     { backgroundColor:'#fff', borderColor:'#ddd' },
  dotActivePulse: { width:8, height:8, borderRadius:4, backgroundColor:'#0c831f' },
  stepLine:       { width:2, flex:1, backgroundColor:'#ddd', marginVertical:2 },
  stepLineDone:   { backgroundColor:'#0c831f' },
  stepLabel:      { fontSize:13, fontWeight:'500' },
  mapBox:         { marginHorizontal:12, backgroundColor:'#e8f5e9', borderRadius:14, height:140, alignItems:'center', justifyContent:'center', marginBottom:8 },
  mapLabel:       { color:'#0c831f', fontSize:14, fontWeight:'700', marginTop:4 },
  driverCard:     { flexDirection:'row', alignItems:'center', gap:12, marginHorizontal:12, backgroundColor:'#f9f9f9', borderRadius:14, padding:14, marginBottom:8 },
  driverAvatar:   { width:44, height:44, borderRadius:22, backgroundColor:'#e0e0e0', alignItems:'center', justifyContent:'center' },
  driverName:     { fontSize:14, fontWeight:'700', color:'#1a1a1a' },
  driverMeta:     { fontSize:11, color:'#888', marginTop:2 },
  callBtn:        { backgroundColor:'#e8f5e9', borderRadius:10, padding:10 },
  warningCard:    { marginHorizontal:12, backgroundColor:'#fff8e1', borderRadius:12, padding:12, marginBottom:8 },
  warningTxt:     { color:'#f57f17', fontSize:12 },
  msgRow:         { flexDirection:'row', gap:8, paddingHorizontal:12, paddingBottom:20, flexWrap:'wrap' },
  msgBtn:         { backgroundColor:'#f5f5f5', borderRadius:10, paddingHorizontal:14, paddingVertical:9, borderWidth:1, borderColor:'#e0e0e0' },
  msgTxt:         { fontSize:12, color:'#333' },
});