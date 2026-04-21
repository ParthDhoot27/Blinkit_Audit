import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { getCurrentUser } from './db';

import LoginScreen   from './screens/LoginScreen';
import HomeScreen    from './screens/HomeScreen';
import CartScreen    from './screens/CartScreen';
import TrackScreen   from './screens/TrackScreen';
import HelpScreen    from './screens/HelpScreen';
import ProfileScreen from './screens/ProfileScreen';

const Tab   = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const ICONS = { Home:'🏠', Cart:'🛒', Track:'📍', Help:'🆘', Profile:'👤' };

function Tabs({ user, setUser }) {
  return (
    <Tab.Navigator screenOptions={({ route }) => ({
      headerShown: false,
      tabBarStyle: { backgroundColor:'#fff', borderTopColor:'#eee', height:60, paddingBottom:8 },
      tabBarActiveTintColor: '#0c831f',
      tabBarInactiveTintColor: '#999',
      tabBarLabelStyle: { fontSize:10, fontWeight:'600' },
      tabBarIcon: ({ focused }) => (
        <Text style={{ fontSize:20 }}>{ICONS[route.name]}</Text>
      ),
    })}>
      <Tab.Screen name="Home"    children={() => <HomeScreen    user={user} setUser={setUser} />} />
      <Tab.Screen name="Cart"    children={() => <CartScreen    user={user} setUser={setUser} />} />
      <Tab.Screen name="Track"   children={() => <TrackScreen   user={user} />} />
      <Tab.Screen name="Help"    children={() => <HelpScreen    user={user} />} />
      <Tab.Screen name="Profile" children={() => <ProfileScreen user={user} setUser={setUser} />} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentUser().then(u => { setUser(u); setLoading(false); });
  }, []);

  if (loading) return null;

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown:false }}>
          {user
            ? <Stack.Screen name="Main" children={() => <Tabs user={user} setUser={setUser} />} />
            : <Stack.Screen name="Login" children={() => <LoginScreen setUser={setUser} />} />
          }
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}