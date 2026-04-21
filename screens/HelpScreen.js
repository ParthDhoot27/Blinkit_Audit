import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ISSUES = [
  { id:'missing',  label:'Item missing',    emoji:'📦' },
  { id:'wrong',    label:'Wrong item',      emoji:'❌' },
  { id:'expired',  label:'Expired product', emoji:'🚫' },
  { id:'damaged',  label:'Damaged item',    emoji:'💔' },
  { id:'weight',   label:'Wrong weight',    emoji:'⚖️' },
  { id:'late',     label:'Late delivery',   emoji:'⏰' },
];

const PIPELINE = [
  { label:'Issue reported',   sub:'2:11 PM · Auto-verified',               state:'done'    },
  { label:'Refund approved',  sub:'2:12 PM · Took 1 minute',               state:'done'    },
  { label:'Refund to UPI',    sub:'Expected by 4:15 PM',                   state:'active'  },
  { label:'Amount credited',  sub:'Within 2 hours',                        state:'pending' },
];

export default function HelpScreen({ user }) {
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState(null);
  const order = user?.orders?.find(o => o.status === 'refund_pending');

  return (
    <View style={{ flex:1, backgroundColor:'#fff' }}>
      <View style={[s.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity><Text style={s.back}>←</Text></TouchableOpacity>
        <View>
          <Text style={s.pageTitle}>Help & Support</Text>
          <Text style={s.orderNum}>Order #{order?.id || 'BL2773'} · Delivered 2 hrs ago</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={s.sectionTitle}>What went wrong?</Text>
        <View style={s.issueGrid}>
          {ISSUES.map(issue => (
            <TouchableOpacity key={issue.id}
              style={[s.issueCard, selected===issue.id && s.issueCardActive]}
              onPress={() => setSelected(issue.id)}>
              <Text style={{ fontSize:28 }}>{issue.emoji}</Text>
              <Text style={[s.issueLabel, selected===issue.id && s.issueLabelActive]}>{issue.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Refund pipeline — AUDIT FEATURE 3 */}
        <View style={s.pipelineCard}>
          <Text style={s.pipelineTitle}>Refund status · ₹{order?.refund?.amount || 328}</Text>
          {PIPELINE.map((step, i) => (
            <View key={i} style={s.pipeStep}>
              <View style={{ alignItems:'center' }}>
                <View style={[s.dot,
                  step.state==='done'    && s.dotDone,
                  step.state==='active'  && s.dotActive,
                  step.state==='pending' && s.dotPending,
                ]}>
                  {step.state==='done' && <Text style={{ color:'#fff', fontSize:10 }}>✓</Text>}
                  {step.state==='active' && <View style={s.dotPulse} />}
                </View>
                {i < PIPELINE.length-1 && <View style={[s.pipeLine, step.state==='done' && s.pipeLineDone]} />}
              </View>
              <View style={{ flex:1, paddingBottom: i < PIPELINE.length-1 ? 18 : 0 }}>
                <Text style={[s.stepLabel,
                  step.state==='done'    && { color:'#1a1a1a' },
                  step.state==='active'  && { color:'#0c831f', fontWeight:'700' },
                  step.state==='pending' && { color:'#ccc' },
                ]}>{step.label}</Text>
                <Text style={[s.stepSub, step.state==='pending' && { color:'#ddd' }]}>{step.sub}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Support buttons */}
        <TouchableOpacity style={s.supportBtn}>
          <Text style={s.supportIcon}>💬</Text>
          <View>
            <Text style={s.supportTitle}>Live chat</Text>
            <Text style={s.supportSub}>avg. 2 min wait</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={[s.supportBtn, { borderColor:'#eee', backgroundColor:'#f9f9f9' }]}>
          <Text style={s.supportIcon}>📞</Text>
          <View>
            <Text style={s.supportTitle}>Call support (voice)</Text>
            <Text style={s.supportSub}>Available 24/7</Text>
          </View>
        </TouchableOpacity>

        {/* Coupon */}
        <View style={s.couponCard}>
          <Text style={s.couponEmoji}>😊</Text>
          <View style={{ flex:1 }}>
            <Text style={s.couponTitle}>We're sorry about this experience</Text>
            <Text style={s.couponCode}>SORRY50 · ₹50 off your next order</Text>
          </View>
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
  sectionTitle:   { fontSize:15, fontWeight:'700', color:'#1a1a1a', paddingHorizontal:16, paddingTop:14, paddingBottom:10 },
  issueGrid:      { flexDirection:'row', flexWrap:'wrap', paddingHorizontal:12, gap:10, marginBottom:16 },
  issueCard:      { width:'30%', backgroundColor:'#f9f9f9', borderRadius:14, padding:12, alignItems:'center', gap:6, borderWidth:1, borderColor:'#eee' },
  issueCardActive:{ backgroundColor:'#e8f5e9', borderColor:'#0c831f' },
  issueLabel:     { fontSize:11, color:'#555', textAlign:'center', fontWeight:'500' },
  issueLabelActive:{ color:'#0c831f', fontWeight:'700' },
  pipelineCard:   { marginHorizontal:12, backgroundColor:'#f9f9f9', borderRadius:16, padding:16, marginBottom:12 },
  pipelineTitle:  { fontSize:14, fontWeight:'700', color:'#1a1a1a', marginBottom:16 },
  pipeStep:       { flexDirection:'row', gap:12 },
  dot:            { width:22, height:22, borderRadius:11, alignItems:'center', justifyContent:'center', borderWidth:2 },
  dotDone:        { backgroundColor:'#0c831f', borderColor:'#0c831f' },
  dotActive:      { backgroundColor:'#fff', borderColor:'#0c831f' },
  dotPending:     { backgroundColor:'#fff', borderColor:'#e0e0e0' },
  dotPulse:       { width:8, height:8, borderRadius:4, backgroundColor:'#0c831f' },
  pipeLine:       { width:2, flex:1, backgroundColor:'#e0e0e0', marginVertical:2 },
  pipeLineDone:   { backgroundColor:'#0c831f' },
  stepLabel:      { fontSize:13, fontWeight:'500' },
  stepSub:        { fontSize:11, color:'#888', marginTop:2 },
  supportBtn:     { flexDirection:'row', alignItems:'center', gap:12, marginHorizontal:12, marginBottom:10, backgroundColor:'#fff', borderRadius:14, padding:14, borderWidth:1, borderColor:'#0c831f' },
  supportIcon:    { fontSize:24 },
  supportTitle:   { fontSize:13, fontWeight:'700', color:'#1a1a1a' },
  supportSub:     { fontSize:11, color:'#888', marginTop:2 },
  couponCard:     { flexDirection:'row', alignItems:'center', gap:12, marginHorizontal:12, marginBottom:24, backgroundColor:'#e8f5e9', borderRadius:14, padding:14 },
  couponEmoji:    { fontSize:28 },
  couponTitle:    { fontSize:12, color:'#1a1a1a', fontWeight:'600' },
  couponCode:     { fontSize:12, color:'#0c831f', fontWeight:'700', marginTop:2 },
});