import { FontAwesome5 } from '@expo/vector-icons';
import React from 'react';
import { Button, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useBottomSheet } from '../../../../src/providers/BottomSheetProvider';
import SampleBottomSheetContent from '../../../../src/shared/components/ui/SampleBottomSheetContent';
import { useTheme, useSubscription } from '../../../../contexts';

export default function GroupsScreen() {
  const { colors } = useTheme();
  const { openBottomSheet } = useBottomSheet();
  const { subscription, isTrialActive } = useSubscription();

  const handleOpenBottomSheet = () => {
    openBottomSheet(<SampleBottomSheetContent />, '60%');
  };

  const handleCreateGroup = () => {
    // TODO: Implement group creation
    console.log('Create group functionality');
  };

  // Mock data for demonstration
  const groupStats = {
    totalGroups: subscription?.plan === 'free' ? 2 : 8,
    activeMembers: 12,
    totalExpenses: 247,
    pendingInvites: 3,
    groupsLimit: subscription?.plan === 'free' ? 3 : -1, // -1 = unlimited
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header Info Card */}
      <View style={[styles.headerCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={styles.headerContent}>
          <View style={styles.headerMain}>
            <View style={styles.titleSection}>
              <FontAwesome5 name="users" size={24} color={colors.primary} />
              <View style={styles.titleText}>
                <Text style={[styles.headerTitle, { color: colors.text }]}>My Groups</Text>
                <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
                  Manage your expense groups
                </Text>
              </View>
            </View>
            
            <TouchableOpacity
              style={[styles.createButton, { backgroundColor: colors.primary }]}
              onPress={handleCreateGroup}
            >
              <FontAwesome5 name="plus" size={16} color="white" />
              <Text style={styles.createButtonText}>Create</Text>
            </TouchableOpacity>
          </View>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.text }]}>{groupStats.totalGroups}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Groups {groupStats.groupsLimit > 0 ? `(${groupStats.groupsLimit} max)` : ''}
              </Text>
            </View>
            
            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
            
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.text }]}>{groupStats.activeMembers}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Members</Text>
            </View>
            
            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
            
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.text }]}>${groupStats.totalExpenses}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total</Text>
            </View>
            
            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
            
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.warning }]}>{groupStats.pendingInvites}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Pending</Text>
            </View>
          </View>

          {/* Free Plan Limit Warning */}
          {subscription?.plan === 'free' && !isTrialActive() && (
            <View style={[styles.limitWarning, { backgroundColor: colors.warning + '15', borderColor: colors.warning + '30' }]}>
              <FontAwesome5 name="exclamation-triangle" size={14} color={colors.warning} />
              <Text style={[styles.limitText, { color: colors.warning }]}>
                You're using {groupStats.totalGroups} of {groupStats.groupsLimit} groups. 
                <Text style={{ fontWeight: '600' }}> Upgrade for unlimited groups.</Text>
              </Text>
            </View>
          )}

          {/* Trial Active Info */}
          {isTrialActive() && (
            <View style={[styles.trialInfo, { backgroundColor: colors.success + '15', borderColor: colors.success + '30' }]}>
              <FontAwesome5 name="crown" size={14} color={colors.success} />
              <Text style={[styles.trialText, { color: colors.success }]}>
                Trial active - enjoying unlimited groups!
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <Text style={[styles.placeholder, { color: colors.textSecondary }]}>
          Groups Page Template
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
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  createButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
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
  },
  limitText: {
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },
  trialInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  trialText: {
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
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