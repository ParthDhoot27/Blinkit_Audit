import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppContext } from '../context/AppContext';
import { ArrowLeft, Wallet, TrendingUp, History } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';

export default function WalletScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { currentUser, theme } = useAppContext();
  const isDark = theme === 'dark';

  const walletBalance = currentUser?.walletBalance || 0;
  const transactions = currentUser?.transactions || [];

  const renderTransaction = ({ item }) => (
    <View style={[styles.transactionCard, isDark && styles.cardDark]}>
      <View style={styles.txIconContainer}>
        <TrendingUp size={20} color="#1C8A3B" />
      </View>
      <View style={styles.txDetails}>
        <Text style={[styles.txTitle, isDark && styles.textLight]}>{item.itemName}</Text>
        <Text style={styles.txDate}>{new Date(item.date).toLocaleDateString()}</Text>
      </View>
      <View style={styles.txAmountContainer}>
        <Text style={[styles.txAmount, { color: '#1C8A3B' }]}>+₹{item.amount}</Text>
        <Text style={styles.txStatus}>{item.status}</Text>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, isDark && styles.bgDark]}>
      <StatusBar style={isDark ? "light" : "dark"} />
      
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft size={24} color={isDark ? '#fff' : '#000'} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, isDark && styles.textLight]}>Blinkit Wallet</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Balance Card */}
        <View style={styles.balanceContainer}>
          <View style={styles.balanceCard}>
            <View style={styles.balanceInfo}>
              <Wallet size={32} color="#fff" />
              <View style={{ marginLeft: 15 }}>
                <Text style={styles.balanceLabel}>Total Balance</Text>
                <Text style={styles.balanceAmount}>₹{walletBalance}</Text>
              </View>
            </View>
            <View style={styles.balanceActions}>
              <TouchableOpacity style={styles.addMoneyBtn}>
                <Text style={styles.addMoneyText}>+ ADD MONEY</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Transactions Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <History size={20} color={isDark ? "#fff" : "#333"} />
            <Text style={[styles.sectionTitle, isDark && styles.textLight]}>Recent Transactions</Text>
          </View>

          {transactions.length > 0 ? (
            <FlatList
              data={transactions}
              keyExtractor={item => item.id}
              renderItem={renderTransaction}
              scrollEnabled={false}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No recent transactions</Text>
            </View>
          )}
        </View>

        {/* Refund Status Section */}
        {currentUser?.orders?.some(o => o.status === 'Refund Processing') && (
           <View style={styles.section}>
             <Text style={[styles.sectionTitle, isDark && styles.textLight, { marginBottom: 15 }]}>Ongoing Refunds</Text>
             {currentUser.orders.filter(o => o.status === 'Refund Processing').map(order => (
                <View key={order.id} style={[styles.refundCard, isDark && styles.cardDark]}>
                   <View style={styles.refundHeader}>
                      <Text style={[styles.refundId, isDark && styles.textLight]}>Order {order.id.substring(0, 8)}</Text>
                      <View style={styles.processingBadge}>
                         <Text style={styles.processingText}>PROCESSING</Text>
                      </View>
                   </View>
                   <Text style={styles.refundAmount}>Refund Amount: ₹{order.refundAmount}</Text>
                   <Text style={styles.refundEstimate}>Expected within 30 seconds</Text>
                </View>
             ))}
           </View>
        )}
      </ScrollView>
    </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },
  backBtn: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 15,
  },
  balanceContainer: {
    padding: 20,
  },
  balanceCard: {
    backgroundColor: '#1C8A3B',
    borderRadius: 20,
    padding: 25,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  balanceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  balanceLabel: {
    color: '#e8f5e9',
    fontSize: 14,
    fontWeight: '600',
  },
  balanceAmount: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '900',
  },
  balanceActions: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
    paddingTop: 15,
  },
  addMoneyBtn: {
    alignSelf: 'center',
  },
  addMoneyText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    gap: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  transactionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  cardDark: {
    backgroundColor: '#1e1e1e',
    borderColor: '#333',
  },
  textLight: {
    color: '#fff',
  },
  txIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e8f5e9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  txDetails: {
    flex: 1,
  },
  txTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
  },
  txDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  txAmountContainer: {
    alignItems: 'flex-end',
  },
  txAmount: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  txStatus: {
    fontSize: 10,
    color: '#999',
    marginTop: 2,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    color: '#999',
    fontSize: 14,
  },
  refundCard: {
    backgroundColor: '#fff8e1',
    borderRadius: 16,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ffe082',
    marginBottom: 15,
  },
  refundHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  refundId: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  processingBadge: {
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  processingText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#f57c00',
  },
  refundAmount: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  refundEstimate: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    fontStyle: 'italic',
  }
});
