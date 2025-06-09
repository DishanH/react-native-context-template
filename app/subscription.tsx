import { FontAwesome5 } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme, useSubscription } from '../contexts';
import type { SubscriptionPlan } from '../contexts';

const SubscriptionScreen = () => {
  const { colors } = useTheme();
  const {
    subscription,
    isLoading,
    availablePlans,
    upgradeToPlan,
    startFreeTrial,
    cancelSubscription,
    renewSubscription,
    toggleAutoRenew,
    isTrialActive,
    getDaysUntilExpiry,
  } = useSubscription();

  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const handleUpgrade = async (planId: SubscriptionPlan) => {
    setActionLoading(planId);
    
    try {
      const success = await upgradeToPlan(planId);
      if (success) {
        Alert.alert('Success', 'Subscription upgraded successfully!');
      } else {
        Alert.alert('Error', 'Failed to upgrade subscription. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleStartTrial = async (planId: SubscriptionPlan) => {
    setActionLoading(`trial-${planId}`);
    
    try {
      const success = await startFreeTrial(planId);
      if (success) {
        Alert.alert('Success', 'Free trial started successfully!');
      } else {
        Alert.alert('Error', 'Failed to start trial. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancel = async () => {
    Alert.alert(
      'Cancel Subscription',
      'Are you sure you want to cancel your subscription? You will lose access to premium features.',
      [
        { text: 'Keep Subscription', style: 'cancel' },
        {
          text: 'Cancel',
          style: 'destructive',
          onPress: async () => {
            setActionLoading('cancel');
            const success = await cancelSubscription();
            if (success) {
              Alert.alert('Success', 'Subscription canceled successfully.');
            } else {
              Alert.alert('Error', 'Failed to cancel subscription. Please try again.');
            }
            setActionLoading(null);
          },
        },
      ]
    );
  };

  const handleRenew = async () => {
    setActionLoading('renew');
    
    try {
      const success = await renewSubscription();
      if (success) {
        Alert.alert('Success', 'Subscription renewed successfully!');
      } else {
        Alert.alert('Error', 'Failed to renew subscription. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleAutoRenew = async () => {
    setActionLoading('auto-renew');
    
    try {
      const success = await toggleAutoRenew();
      if (success) {
        Alert.alert('Success', 'Auto-renewal settings updated!');
      } else {
        Alert.alert('Error', 'Failed to update auto-renewal. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return colors.success;
      case 'trial':
        return colors.warning;
      case 'canceled':
      case 'expired':
        return colors.error;
      default:
        return colors.textSecondary;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return 'check-circle';
      case 'trial':
        return 'clock';
      case 'canceled':
      case 'expired':
        return 'times-circle';
      default:
        return 'question-circle';
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.text }]}>
            Loading subscription...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Subscription Plans */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Subscription Plans</Text>
          
          {availablePlans.map((plan) => {
            const isCurrentPlan = subscription?.plan === plan.id;
            const showActions = subscription && !isCurrentPlan;
            
            return (
              <View
                key={plan.id}
                style={[
                  styles.planCard,
                  { 
                    backgroundColor: plan.isPopular ? colors.primary + '10' : colors.background,
                    borderColor: isCurrentPlan 
                      ? colors.success 
                      : plan.isPopular 
                        ? colors.primary 
                        : colors.border,
                  },
                ]}
              >
                <View style={styles.planHeader}>
                  <View>
                    <Text style={[styles.planCardName, { color: colors.text }]}>
                      {plan.name}
                      {plan.isPopular && (
                        <Text style={[styles.popularBadge, { color: colors.primary }]}> • Most Popular</Text>
                      )}
                    </Text>
                    <Text style={[styles.planCardPrice, { color: colors.primary }]}>
                      {plan.price === 0 ? 'Free' : `$${plan.price}/${plan.interval}`}
                    </Text>
                  </View>
                  
                  {isCurrentPlan && (
                    <View style={styles.currentSection}>
                      <View style={[styles.currentBadge, { backgroundColor: colors.success }]}>
                        <Text style={styles.currentBadgeText}>Current Plan</Text>
                      </View>
                      
                      {subscription && (
                        <View style={styles.statusInfo}>
                          <View style={styles.statusRow}>
                            <FontAwesome5
                              name={getStatusIcon(subscription.status)}
                              size={12}
                              color={getStatusColor(subscription.status)}
                            />
                            <Text style={[styles.statusText, { color: getStatusColor(subscription.status) }]}>
                              {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                            </Text>
                          </View>
                          
                          {isTrialActive() && (
                            <Text style={[styles.infoText, { color: colors.warning }]}>
                              Trial expires in {getDaysUntilExpiry()} days
                            </Text>
                          )}
                          
                          {subscription.status === 'canceled' && (
                            <Text style={[styles.infoText, { color: colors.error }]}>
                              Expires in {getDaysUntilExpiry()} days
                            </Text>
                          )}
                          
                          {subscription.plan !== 'free' && subscription.status === 'active' && !isTrialActive() && (
                            <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                              Renews in {getDaysUntilExpiry()} days
                            </Text>
                          )}
                        </View>
                      )}
                    </View>
                  )}
                </View>

                <View style={styles.planFeatures}>
                  {plan.features.map((feature, index) => (
                    <View key={index} style={styles.featureRow}>
                      <FontAwesome5 name="check" size={12} color={colors.success} />
                      <Text style={[styles.featureText, { color: colors.textSecondary }]}>{feature}</Text>
                    </View>
                  ))}
                </View>

                {/* Plan Actions */}
                {showActions && (
                  <View style={styles.planActions}>
                    {plan.trialDays && subscription?.plan === 'free' && (
                      <TouchableOpacity
                        style={[styles.trialButton, { borderColor: colors.warning }]}
                        onPress={() => handleStartTrial(plan.id)}
                        disabled={actionLoading === `trial-${plan.id}`}
                      >
                        {actionLoading === `trial-${plan.id}` ? (
                          <ActivityIndicator size="small" color={colors.warning} />
                        ) : (
                          <Text style={[styles.trialButtonText, { color: colors.warning }]}>
                            Start {plan.trialDays}-day trial
                          </Text>
                        )}
                      </TouchableOpacity>
                    )}
                    
                    <TouchableOpacity
                      style={[styles.upgradeButton, { backgroundColor: colors.primary }]}
                      onPress={() => handleUpgrade(plan.id)}
                      disabled={actionLoading === plan.id}
                    >
                      {actionLoading === plan.id ? (
                        <ActivityIndicator size="small" color="white" />
                      ) : (
                        <Text style={styles.upgradeButtonText}>
                          {plan.price === 0 ? 'Downgrade' : 'Upgrade'}
                        </Text>
                      )}
                    </TouchableOpacity>
                  </View>
                )}

                {/* Current Plan Management */}
                {isCurrentPlan && subscription && subscription.plan !== 'free' && (
                  <View style={styles.managementActions}>
                    {subscription.status === 'active' && (
                      <>
                        <TouchableOpacity
                          style={[styles.managementButton, { backgroundColor: colors.error + '20', borderColor: colors.error }]}
                          onPress={handleCancel}
                          disabled={actionLoading === 'cancel'}
                        >
                          {actionLoading === 'cancel' ? (
                            <ActivityIndicator size="small" color={colors.error} />
                          ) : (
                            <>
                              <FontAwesome5 name="times" size={14} color={colors.error} />
                              <Text style={[styles.managementButtonText, { color: colors.error }]}>Cancel</Text>
                            </>
                          )}
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={[styles.managementButton, { backgroundColor: colors.primary + '20', borderColor: colors.primary }]}
                          onPress={handleToggleAutoRenew}
                          disabled={actionLoading === 'auto-renew'}
                        >
                          {actionLoading === 'auto-renew' ? (
                            <ActivityIndicator size="small" color={colors.primary} />
                          ) : (
                            <>
                              <FontAwesome5 name="sync" size={14} color={colors.primary} />
                              <Text style={[styles.managementButtonText, { color: colors.primary }]}>
                                {subscription.autoRenew ? 'Disable' : 'Enable'} Auto-Renewal
                              </Text>
                            </>
                          )}
                        </TouchableOpacity>
                      </>
                    )}

                    {subscription.status === 'canceled' && (
                      <TouchableOpacity
                        style={[styles.managementButton, { backgroundColor: colors.success + '20', borderColor: colors.success }]}
                        onPress={handleRenew}
                        disabled={actionLoading === 'renew'}
                      >
                        {actionLoading === 'renew' ? (
                          <ActivityIndicator size="small" color={colors.success} />
                        ) : (
                          <>
                            <FontAwesome5 name="redo" size={14} color={colors.success} />
                            <Text style={[styles.managementButtonText, { color: colors.success }]}>Renew</Text>
                          </>
                        )}
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    marginBottom: 16,
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
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
  },
  planCard: {
    borderRadius: 12,
    borderWidth: 2,
    padding: 16,
    marginBottom: 16,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  planCardName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  popularBadge: {
    fontSize: 14,
    fontWeight: '600',
  },
  planCardPrice: {
    fontSize: 16,
    fontWeight: '600',
  },
  currentSection: {
    alignItems: 'flex-end',
  },
  currentBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 8,
  },
  currentBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  statusInfo: {
    alignItems: 'flex-end',
    gap: 4,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  infoText: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'right',
  },
  planFeatures: {
    gap: 8,
    marginBottom: 16,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureText: {
    fontSize: 14,
    flex: 1,
  },
  planActions: {
    gap: 8,
  },
  trialButton: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    minHeight: 44,
    justifyContent: 'center',
  },
  trialButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  upgradeButton: {
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    minHeight: 44,
    justifyContent: 'center',
  },
  upgradeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  managementActions: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
    marginTop: 8,
  },
  managementButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    minHeight: 40,
    flex: 1,
    justifyContent: 'center',
  },
  managementButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },
});

export default SubscriptionScreen; 