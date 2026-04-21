import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Switch, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { logout, updateUser } from '../db';

export default function ProfileScreen({ user, setUser }) {
  const insets = useSafeAreaInsets();
  const [darkMode, setDarkMode] = useState(user?.darkMode || false);
  const [accessibility, setAccessibility] = useState(false);

  async function handleLogout() {
    Alert.alert('Log out', 'Are you sure?', [
      { text:'Cancel', style:'cancel' },
      { text:'Log out', style:'destructive', onPress: async () => {
        await logout();
        setUser(null);
      }},
    ]);
  }

  async function toggleDark(val) {
    setDarkMode(val);
    await updateUser(user.id, { darkMode: val });
  }

  const addr = user?.addresses?.[0];

  return (
    <View style={{ flex:1, backgroundColor:'#fff' }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom:40 }}>
        {/* Profile header */}
        <View style={[s.profileHeader, { paddingTop: insets.top + 20 }]}>
          <View style={s.avatar}><Text style={s.avatarTxt}>{user?.name?.[0] || 'A'}</Text></View>
          <Text style={s.userName}>{user?.name || 'User'}</Text>
          <Text style={s.userPhone}>+91 {user?.phone}</Text>
          {addr && <Text style={s.userAddr}>{addr.building}, {addr.lane}, {addr.city}</Text>}
          <View style={s.goldBadge}><Text style={s.goldBadgeTxt}>⭐ Gold member</Text></View>
        </View>

        {/* Stats */}
        <View style={s.statsRow}>
          <View style={s.statBox}><Text style={s.statNum}>{user?.orders?.length || 0}</Text><Text style={s.statLabel}>Orders</Text></View>
          <View style={s.statDivider} />
          <View style={s.statBox}><Text style={s.statNum}>₹{user?.orders?.reduce((s,o) => s + (o.total||0), 0) || 0}</Text><Text style={s.statLabel}>Total saved</Text></View>
          <View style={s.statDivider} />
          <View style={s.statBox}><Text style={s.statNum}>4.9</Text><Text style={s.statLabel}>Avg rating given</Text></View>
        </View>

        {/* Menu items */}
        {[
          { icon:'📍', label:'Saved addresses', sub: addr ? `${addr.label}, ${addr.city}` : 'Add address' },
          { icon:'📦', label:'Order history',   sub:`${user?.orders?.length || 0} orders` },
          { icon:'👛', label:'Blinkit wallet',  sub:`₹${user?.wallet || 0} balance` },
          { icon:'🔄', label:'Smart subscriptions', sub:'Milk, curd — auto-reorder' },
          { icon:'❤️', label:'Wishlist',        sub:'0 saved items' },
        ].map(item => (
          <TouchableOpacity key={item.label} style={s.menuItem}>
            <Text style={s.menuIcon}>{item.icon}</Text>
            <View style={{ flex:1 }}>
              <Text style={s.menuLabel}>{item.label}</Text>
              <Text style={s.menuSub}>{item.sub}</Text>
            </View>
            <Text style={s.menuArrow}>›</Text>
          </TouchableOpacity>
        ))}

        {/* Toggles */}
        <View style={s.menuItem}>
          <Text style={s.menuIcon}>♿</Text>
          <View style={{ flex:1 }}>
            <Text style={s.menuLabel}>Accessibility mode</Text>
            <Text style={s.menuSub}>Large font & voice ordering</Text>
          </View>
          <Switch value={accessibility} onValueChange={setAccessibility}
            trackColor={{ false:'#ddd', true:'#0c831f' }} thumbColor="#fff" />
        </View>
        <View style={s.menuItem}>
          <Text style={s.menuIcon}>🌙</Text>
          <View style={{ flex:1 }}>
            <Text style={s.menuLabel}>Dark mode</Text>
            <Text style={s.menuSub}>Easy on the eyes</Text>
          </View>
          <Switch value={darkMode} onValueChange={toggleDark}
            trackColor={{ false:'#ddd', true:'#0c831f' }} thumbColor="#fff" />
        </View>

        {[
          { icon:'👨‍👩‍👧', label:'Family account', sub:'Add up to 4 members' },
          { icon:'🔔', label:'Notifications',    sub:'Deals, order updates' },
          { icon:'❓', label:'Help & Support',   sub:'Refunds, issues, chat' },
        ].map(item => (
          <TouchableOpacity key={item.label} style={s.menuItem}>
            <Text style={s.menuIcon}>{item.icon}</Text>
            <View style={{ flex:1 }}>
              <Text style={s.menuLabel}>{item.label}</Text>
              <Text style={s.menuSub}>{item.sub}</Text>
            </View>
            <Text style={s.menuArrow}>›</Text>
          </TouchableOpacity>
        ))}

        {/* Logout */}
        <TouchableOpacity style={s.logoutBtn} onPress={handleLogout}>
          <Text style={s.logoutTxt}>🚪  Log out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  profileHeader: { backgroundColor:'#fff', alignItems:'center', paddingBottom:20, borderBottomWidth:1, borderBottomColor:'#eee' },
  avatar:        { width:72, height:72, borderRadius:36, backgroundColor:'#0c831f', alignItems:'center', justifyContent:'center', marginBottom:10 },
  avatarTxt:     { color:'#fff', fontSize:28, fontWeight:'700' },
  userName:      { fontSize:20, fontWeight:'700', color:'#1a1a1a' },
  userPhone:     { fontSize:13, color:'#888', marginTop:2 },
  userAddr:      { fontSize:12, color:'#aaa', marginTop:2, textAlign:'center', paddingHorizontal:20 },
  goldBadge:     { backgroundColor:'#fff8e1', borderRadius:20, paddingHorizontal:14, paddingVertical:5, marginTop:8 },
  goldBadgeTxt:  { color:'#f57f17', fontSize:12, fontWeight:'700' },
  statsRow:      { flexDirection:'row', paddingVertical:16, borderBottomWidth:1, borderBottomColor:'#eee' },
  statBox:       { flex:1, alignItems:'center' },
  statNum:       { fontSize:18, fontWeight:'700', color:'#0c831f' },
  statLabel:     { fontSize:11, color:'#888', marginTop:2 },
  statDivider:   { width:1, backgroundColor:'#eee' },
  menuItem:      { flexDirection:'row', alignItems:'center', paddingHorizontal:16, paddingVertical:14, borderBottomWidth:1, borderBottomColor:'#f5f5f5', gap:12 },
  menuIcon:      { fontSize:22, width:32, textAlign:'center' },
  menuLabel:     { fontSize:14, fontWeight:'600', color:'#1a1a1a' },
  menuSub:       { fontSize:11, color:'#888', marginTop:2 },
  menuArrow:     { fontSize:20, color:'#ccc' },
  logoutBtn:     { margin:16, marginTop:24, backgroundColor:'#fff0f0', borderRadius:14, padding:15, alignItems:'center', borderWidth:1, borderColor:'#ffcdd2' },
  logoutTxt:     { color:'#c62828', fontSize:15, fontWeight:'700' },
});