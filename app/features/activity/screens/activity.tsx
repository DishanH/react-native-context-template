import { FontAwesome5 } from '@expo/vector-icons';
import React from 'react';
import { Button, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useBottomSheet } from '../../../../src/providers/BottomSheetProvider';
import SampleBottomSheetContent from '../../../../src/shared/components/ui/SampleBottomSheetContent';
import { useTheme, useSubscription } from '../../../../contexts';

export default function ActivityScreen() {
  const { colors } = useTheme();
  const { openBottomSheet } = useBottomSheet();
  const { subscription, isTrialActive } = useSubscription();

  const handleOpenBottomSheet = () => {
    openBottomSheet(<SampleBottomSheetContent />, '30%');
  };

  const handleViewAll = () => {
    // TODO: Implement view all activity
    console.log('View all activity functionality');
  };

  const handleFilterActivity = () => {
    // TODO: Implement activity filtering
    console.log('Filter activity functionality');
  };

  // Mock data for demonstration
  const activityStats = {
    todayTransactions: 5,
    weeklyTransactions: 28,
    totalAmount: 1247.50,
    pendingItems: 7,
    lastActivity: '2 hours ago',
    historyLimit: subscription?.plan === 'free' ? 30 : -1, // -1 = unlimited
  };

  const recentActivities = [
    {
      id: 1,
      type: 'expense',
      title: 'Coffee Shop',
      amount: 12.50,
      group: 'Work Team',
      time: '2 hours ago',
      icon: 'coffee',
    },
    {
      id: 2,
      type: 'payment',
      title: 'Payment received',
      amount: 45.00,
      group: 'Roommates',
      time: '5 hours ago',
      icon: 'money-bill-wave',
    },
    {
      id: 3,
      type: 'invite',
      title: 'Group invitation',
      amount: 0,
      group: 'Weekend Trip',
      time: '1 day ago',
      icon: 'user-plus',
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'expense':
        return 'receipt';
      case 'payment':
        return 'money-bill-wave';
      case 'invite':
        return 'user-plus';
      default:
        return 'clock';
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'expense':
        return colors.error;
      case 'payment':
        return colors.success;
      case 'invite':
        return colors.primary;
      default:
        return colors.textSecondary;
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header Info Card */}
      <View style={[styles.headerCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={styles.headerContent}>
          <View style={styles.headerMain}>
            <View style={styles.titleSection}>
              <FontAwesome5 name="history" size={24} color={colors.primary} />
              <View style={styles.titleText}>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Recent Activity</Text>
                <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
                  Track your expense history
                </Text>
              </View>
            </View>
            
            <TouchableOpacity
              style={[styles.filterButton, { borderColor: colors.border }]}
              onPress={handleFilterActivity}
            >
              <FontAwesome5 name="filter" size={16} color={colors.textSecondary} />
              <Text style={[styles.filterButtonText, { color: colors.textSecondary }]}>Filter</Text>
            </TouchableOpacity>
          </View>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.text }]}>{activityStats.todayTransactions}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Today</Text>
            </View>
            
            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
            
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.text }]}>{activityStats.weeklyTransactions}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>This Week</Text>
            </View>
            
            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
            
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.success }]}>${activityStats.totalAmount}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total</Text>
            </View>
            
            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
            
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.warning }]}>{activityStats.pendingItems}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Pending</Text>
            </View>
          </View>

          {/* Free Plan History Limit */}
          {subscription?.plan === 'free' && !isTrialActive() && (
            <View style={[styles.limitWarning, { backgroundColor: colors.warning + '15', borderColor: colors.warning + '30' }]}>
              <FontAwesome5 name="calendar-alt" size={14} color={colors.warning} />
              <Text style={[styles.limitText, { color: colors.warning }]}>
                History limited to {activityStats.historyLimit} days. 
                <Text style={{ fontWeight: '600' }}> Upgrade for full history access.</Text>
              </Text>
            </View>
          )}

          {/* Recent Activity Preview */}
          <View style={styles.recentSection}>
            <View style={styles.recentHeader}>
              <Text style={[styles.recentTitle, { color: colors.text }]}>Latest Activity</Text>
              <TouchableOpacity onPress={handleViewAll}>
                <Text style={[styles.viewAllText, { color: colors.primary }]}>View All</Text>
              </TouchableOpacity>
            </View>

            {recentActivities.map((activity) => (
              <View key={activity.id} style={styles.activityItem}>
                <View style={[styles.activityIcon, { backgroundColor: getActivityColor(activity.type) + '20' }]}>
                  <FontAwesome5 
                    name={getActivityIcon(activity.type)} 
                    size={12} 
                    color={getActivityColor(activity.type)} 
                  />
                </View>
                
                <View style={styles.activityDetails}>
                  <View style={styles.activityMain}>
                    <Text style={[styles.activityTitle, { color: colors.text }]}>{activity.title}</Text>
                    {activity.amount > 0 && (
                      <Text style={[styles.activityAmount, { color: getActivityColor(activity.type) }]}>
                        {activity.type === 'expense' ? '-' : '+'}${activity.amount.toFixed(2)}
                      </Text>
                    )}
                  </View>
                  <View style={styles.activityMeta}>
                    <Text style={[styles.activityGroup, { color: colors.textSecondary }]}>{activity.group}</Text>
                    <Text style={[styles.activityTime, { color: colors.textSecondary }]}>{activity.time}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <Text style={[styles.placeholder, { color: colors.textSecondary }]}>
          Activity Page Template
        </Text>
        
        <Button 
          title="Open Bottom Sheet" 
          onPress={handleOpenBottomSheet}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerCard: {
    margin: 16,
    borderRadius: 16,
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  headerContent: {
    padding: 20,
  },
  headerMain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  titleText: {
    marginLeft: 12,
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 30,
    marginHorizontal: 8,
  },
  limitWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 16,
  },
  limitText: {
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },
  recentSection: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  recentTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityDetails: {
    flex: 1,
  },
  activityMain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  activityAmount: {
    fontSize: 14,
    fontWeight: '700',
  },
  activityMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activityGroup: {
    fontSize: 12,
    fontWeight: '500',
  },
  activityTime: {
    fontSize: 12,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    gap: 20,
  },
  placeholder: {
    fontSize: 18,
    fontWeight: '500',
  },
}); 