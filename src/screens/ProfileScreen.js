import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Switch, Alert, ScrollView } from 'react-native';
import { useAppContext } from '../context/AppContext';
import { Settings, Package, User, Moon, Share2, LogOut, ChevronRight, MessageCircle, Wallet } from 'lucide-react-native';

export default function ProfileScreen({ navigation }) {
  const { currentUser, logout, theme, setTheme } = useAppContext();

  const isDark = theme === 'dark';

  if (!currentUser) {
    return (
      <View style={[styles.centerContainer, isDark && styles.bgDark]}>
        <Text style={isDark && styles.textLight}>Please login to view profile</Text>
        <TouchableOpacity style={styles.loginBtn} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginBtnText}>Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleLogout = () => {
    logout();
    navigation.navigate('Home');
  };

  const menuItems = [
    {
      id: 'old_orders',
      title: 'Old Orders',
      icon: <Package size={24} color={isDark ? "#fff" : "#333"} />,
      action: () => navigation.navigate('Tracking'),
      type: 'link'
    },
    {
      id: 'wallet',
      title: 'Blinkit Wallet',
      icon: <Wallet size={24} color={isDark ? "#fff" : "#333"} />,
      action: () => navigation.navigate('Wallet'),
      type: 'link'
    },
    {
      id: 'preferences',
      title: 'Preferences',
      icon: <Settings size={24} color={isDark ? "#fff" : "#333"} />,
      action: () => Alert.alert('Preferences', 'App preferences coming soon!'),
      type: 'link'
    },
    {
      id: 'appearance',
      title: 'Dark Mode',
      icon: <Moon size={24} color={isDark ? "#fff" : "#333"} />,
      type: 'toggle',
      value: isDark,
      onToggle: (val) => setTheme(val ? 'dark' : 'light')
    },
    {
      id: 'edit_profile',
      title: 'Edit Profile',
      icon: <User size={24} color={isDark ? "#fff" : "#333"} />,
      action: () => Alert.alert('Edit Profile', 'Profile editing coming soon!'),
      type: 'link'
    },
    {
      id: 'share',
      title: 'Share the App',
      icon: <Share2 size={24} color={isDark ? "#fff" : "#333"} />,
      action: () => Alert.alert('Share', 'Share link copied to clipboard!'),
      type: 'link'
    }
  ];

  return (
    <SafeAreaView style={[styles.container, isDark && styles.bgDark]}>
      <ScrollView>
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{currentUser.name.charAt(0)}</Text>
            </View>
            <View>
              <Text style={[styles.name, isDark && styles.textLight]}>{currentUser.name}</Text>
              <Text style={[styles.email, isDark && styles.textDim]}>{currentUser.email}</Text>
            </View>
          </View>

          <View style={[styles.section, isDark && styles.cardDark]}>
            <Text style={[styles.sectionTitle, isDark && styles.textLight]}>Saved Address</Text>
            <Text style={[styles.addressText, isDark && styles.textDim]}>{currentUser.address.building}</Text>
            <Text style={[styles.addressText, isDark && styles.textDim]}>{currentUser.address.lane}</Text>
            <Text style={[styles.addressText, isDark && styles.textDim]}>{currentUser.address.city}</Text>
          </View>

          <View style={[styles.menuList, isDark && styles.cardDark]}>
            {menuItems.map((item, index) => (
              <View key={item.id}>
                {item.type === 'link' ? (
                  <TouchableOpacity style={styles.menuItem} onPress={item.action}>
                    <View style={styles.menuItemLeft}>
                      {item.icon}
                      <Text style={[styles.menuItemText, isDark && styles.textLight]}>{item.title}</Text>
                    </View>
                    <ChevronRight size={20} color="#999" />
                  </TouchableOpacity>
                ) : (
                  <View style={styles.menuItem}>
                    <View style={styles.menuItemLeft}>
                      {item.icon}
                      <Text style={[styles.menuItemText, isDark && styles.textLight]}>{item.title}</Text>
                    </View>
                    <Switch
                      value={item.value}
                      onValueChange={item.onToggle}
                      trackColor={{ false: "#767577", true: "#81b0ff" }}
                      thumbColor={item.value ? "#1C8A3B" : "#f4f3f4"}
                    />
                  </View>
                )}
                {index < menuItems.length - 1 && <View style={[styles.divider, isDark && styles.dividerDark]} />}
              </View>
            ))}
          </View>

          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <LogOut size={20} color="#e23744" style={{ marginRight: 8 }} />
            <Text style={styles.logoutBtnText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Support Chat Floating Button */}
      <TouchableOpacity 
        style={styles.supportBtn} 
        onPress={() => Alert.alert('Support', 'Connecting to support chat...')}
        activeOpacity={0.8}
      >
        <MessageCircle size={28} color="#fff" />
        <Text style={styles.supportBtnText}>Need Help?</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  bgDark: {
    backgroundColor: '#121212',
  },
  cardDark: {
    backgroundColor: '#1e1e1e',
  },
  textLight: {
    color: '#fff',
  },
  textDim: {
    color: '#aaa',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loginBtn: {
    marginTop: 20,
    backgroundColor: '#e23744',
    padding: 10,
    borderRadius: 8,
  },
  loginBtnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  content: {
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 35,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#F8CB46',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
  },
  name: {
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 5,
    color: '#000',
  },
  email: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    backgroundColor: '#f9f9f9',
    padding: 20,
    borderRadius: 20,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: '#eee',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#000',
  },
  addressText: {
    fontSize: 14,
    color: '#444',
    marginBottom: 4,
  },
  menuList: {
    backgroundColor: '#fff',
    borderRadius: 20,
    marginBottom: 35,
    borderWidth: 1,
    borderColor: '#eee',
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 18,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    marginLeft: 15,
    color: '#333',
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginLeft: 55,
  },
  dividerDark: {
    backgroundColor: '#333',
  },
  logoutBtn: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#eee',
    padding: 18,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 100,
  },
  logoutBtnText: {
    color: '#e23744',
    fontSize: 16,
    fontWeight: 'bold',
  },
  supportBtn: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#1C8A3B',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  supportBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 10,
    fontSize: 15,
  }
});
