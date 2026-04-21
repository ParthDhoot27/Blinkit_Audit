import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ORDERS = [
  { id:'BL2773', date:'Apr 15, 2025 · 3 items', items:'🍞 Bread · 🥛 Amul Dahi · 🥤 Sprite 750ml', total:'₹183', status:'refund', statusLabel:'Refund Pending' },
  { id:'BL2891', date:'Apr 20, 2025 · 6 items', items:'🍌 Banana · 🥚 Eggs · 🧀 Cheese · +3 more', total:'₹398', status:'delivered', statusLabel:'Delivered' },
  { id:'BL2610', date:'Apr 12, 2025 · 4 items', items:'🧴 Shampoo · 🪥 Toothbrush · 🧼 Soap · +1', total:'₹210', status:'delivered', statusLabel:'Delivered' },
];

const PIPELINE = [
  { icon:'✓', label:'Refund Initiated',  sub:'Apr 15 · Your request was confirmed',      state:'done'    },
  { icon:'✓', label:'Blinkit Approved',  sub:'Apr 15 · Approved within 2 hours',         state:'done'    },
  { icon:'⟳', label:'Bank Processing',   sub:'In progress · Typically 1–2 working days', state:'active'  },
  { icon:'○', label:'Amount Credited',   sub:'Est. Apr 17–18',                            state:'pending' },
];

export default function OrdersScreen() {
  const insets = useSafeAreaInsets();
  const [refundOpen, setRefundOpen] = useState(false);

  if (refundOpen) {
    return <RefundPipeline insets={insets} onBack={() => setRefundOpen(false)} />;
  }

  return (
    <View style={{ flex:1, backgroundColor:'#0f0f0f' }}>
      <View style={[s.header, { paddingTop: insets.top + 10 }]}>
        <Text style={s.pageTitle}>My Orders</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {ORDERS.map(order => (
          <TouchableOpacity
            key={order.id}
            style={s.orderCard}
            activeOpacity={0.85}
            onPress={() => order.status === 'refund' && setRefundOpen(true)}
          >
            <View style={s.orderTop}>
              <View>
                <Text style={s.orderNum}>Order #{order.id}</Text>
                <Text style={s.orderDate}>{order.date}</Text>
              </View>
              <View style={order.status === 'refund' ? s.badgeOrange : s.badgeGreen}>
                <Text style={order.status === 'refund' ? s.badgeOrangeTxt : s.badgeGreenTxt}>
                  {order.statusLabel}
                </Text>
              </View>
            </View>
            <Text style={s.orderItems}>{order.items}</Text>
            <View style={s.orderBottom}>
              <Text style={s.orderTotal}>{order.total}</Text>
              {order.status === 'refund'
                ? <Text style={s.trackRefund}>Track Refund →</Text>
                : <Text style={s.rateOrder}>Rate Order</Text>
              }
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

function RefundPipeline({ insets, onBack }) {
  return (
    <View style={{ flex:1, backgroundColor:'#0f0f0f' }}>
      <View style={[s.header, { paddingTop: insets.top + 10, flexDirection:'row', alignItems:'center', gap:12 }]}>
        <TouchableOpacity onPress={onBack}><Text style={s.backBtn}>←</Text></TouchableOpacity>
        <Text style={s.pageTitle}>Refund Pipeline</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Amount card */}
        <View style={s.amountCard}>
          <Text style={s.amountLabel}>Refund Amount</Text>
          <Text style={s.amountValue}>₹183</Text>
          <Text style={s.amountSub}>Order #BL2773 · Missing items refund</Text>
        </View>

        {/* Pipeline */}
        <View style={s.pipelineCard}>
          <Text style={[s.orderDate, { marginBottom:16, letterSpacing:.5, fontWeight:'700' }]}>REFUND STATUS</Text>
          {PIPELINE.map((step, i) => (
            <View key={i} style={s.pipeStep}>
              <View style={{ alignItems:'center' }}>
                <View style={[s.pipeIcon,
                  step.state==='done'    && { backgroundColor:'#0f2a0f', borderColor:'#4CAF50' },
                  step.state==='active'  && { backgroundColor:'#2a1a00', borderColor:'#F8C300' },
                  step.state==='pending' && { backgroundColor:'#2a2a2a', borderColor:'#333'    },
                ]}>
                  <Text style={{ color: step.state==='done' ? '#4CAF50' : step.state==='active' ? '#F8C300' : '#444', fontSize:14 }}>
                    {step.icon}
                  </Text>
                </View>
                {i < PIPELINE.length - 1 && <View style={s.pipeLine} />}
              </View>
              <View style={{ flex:1, paddingBottom: i < PIPELINE.length-1 ? 22 : 0 }}>
                <Text style={{ color: step.state==='done' ? '#fff' : step.state==='active' ? '#F8C300' : '#444', fontSize:13, fontWeight:'600' }}>
                  {step.label}
                </Text>
                <Text style={{ color: step.state==='pending' ? '#333' : '#666', fontSize:11, marginTop:3 }}>
                  {step.sub}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* ETA */}
        <View style={s.etaCard}>
          <Text style={{ fontSize:20 }}>📅</Text>
          <View>
            <Text style={s.etaText}>Expected by Apr 18, 2025</Text>
            <Text style={s.etaSub}>Credited to your original payment method</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  header:        { backgroundColor:'#0f0f0f', paddingHorizontal:16, paddingBottom:12 },
  pageTitle:     { color:'#fff', fontSize:20, fontWeight:'700' },
  backBtn:       { color:'#F8C300', fontSize:22 },
  orderCard:     { backgroundColor:'#1e1e1e', borderRadius:18, borderWidth:1, borderColor:'#2a2a2a', padding:16, marginHorizontal:16, marginBottom:12 },
  orderTop:      { flexDirection:'row', alignItems:'flex-start', justifyContent:'space-between', marginBottom:10 },
  orderNum:      { color:'#fff', fontSize:14, fontWeight:'700' },
  orderDate:     { color:'#666', fontSize:11, marginTop:2 },
  orderItems:    { color:'#888', fontSize:12, marginBottom:10 },
  orderBottom:   { flexDirection:'row', alignItems:'center', justifyContent:'space-between' },
  orderTotal:    { color:'#F8C300', fontSize:14, fontWeight:'700' },
  trackRefund:   { color:'#ff9800', fontSize:12, fontWeight:'600' },
  rateOrder:     { color:'#4CAF50', fontSize:12, fontWeight:'600' },
  badgeOrange:   { backgroundColor:'#2a1a00', borderRadius:8, paddingHorizontal:10, paddingVertical:4 },
  badgeOrangeTxt:{ color:'#ff9800', fontSize:11, fontWeight:'700' },
  badgeGreen:    { backgroundColor:'#0f2a0f', borderRadius:8, paddingHorizontal:10, paddingVertical:4 },
  badgeGreenTxt: { color:'#4CAF50', fontSize:11, fontWeight:'700' },
  amountCard:    { marginHorizontal:16, marginBottom:12, backgroundColor:'#2a1a00', borderWidth:1, borderColor:'#4a3000', borderRadius:18, padding:20, alignItems:'center' },
  amountLabel:   { color:'#888', fontSize:12, marginBottom:4 },
  amountValue:   { color:'#F8C300', fontSize:36, fontWeight:'700' },
  amountSub:     { color:'#aaa', fontSize:12, marginTop:4 },
  pipelineCard:  { backgroundColor:'#1e1e1e', borderRadius:18, borderWidth:1, borderColor:'#2a2a2a', padding:18, marginHorizontal:16, marginBottom:12 },
  pipeStep:      { flexDirection:'row', gap:14 },
  pipeIcon:      { width:32, height:32, borderRadius:16, borderWidth:2, alignItems:'center', justifyContent:'center' },
  pipeLine:      { width:2, flex:1, backgroundColor:'#2a2a2a', marginVertical:3 },
  etaCard:       { backgroundColor:'#0f2a0f', borderWidth:1, borderColor:'#1a3a1a', borderRadius:14, padding:14, marginHorizontal:16, marginBottom:20, flexDirection:'row', alignItems:'center', gap:12 },
  etaText:       { color:'#7fba7f', fontSize:13, fontWeight:'600' },
  etaSub:        { color:'#4a6a4a', fontSize:11, marginTop:2 },
});