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
import { feedback } from '../lib/feedback';

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
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Subscription Plans */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Choose Your Plan</Text>
          
          {availablePlans.map((plan) => {
            const isCurrentPlan = subscription?.plan === plan.id;
            
            return (
              <View key={plan.id} style={[
                styles.card, 
                { 
                  backgroundColor: colors.surface, 
                  borderColor: isCurrentPlan ? colors.success : plan.isPopular ? colors.primary : colors.border,
                  borderWidth: isCurrentPlan || plan.isPopular ? 2 : 1,
                }
              ]}>
                {/* Plan Header */}
                <View style={styles.planHeader}>
                  <View style={styles.planTitleSection}>
                    <View style={styles.planTitleRow}>
                      <Text style={[styles.planName, { color: colors.text }]}>
                        {plan.name}
                      </Text>
                      {plan.isPopular && (
                        <View style={[styles.popularBadge, { backgroundColor: colors.primary }]}>
                          <Text style={styles.popularText}>Popular</Text>
                        </View>
                      )}
                      {isCurrentPlan && (
                        <View style={[styles.currentBadge, { backgroundColor: colors.success }]}>
                          <Text style={styles.currentBadgeText}>Current</Text>
                        </View>
                      )}
                    </View>
                    <Text style={[styles.planPrice, { color: colors.text }]}>
                      {plan.price === 0 ? 'Free' : `$${plan.price}`}
                      {plan.price > 0 && <Text style={[styles.planInterval, { color: colors.textSecondary }]}>/{plan.interval}</Text>}
                    </Text>
                  </View>
                </View>

                {/* Plan Features */}
                <View style={styles.planFeatures}>
                  {plan.features.slice(0, 4).map((feature, index) => (
                    <View key={index} style={styles.featureRow}>
                      <FontAwesome5 name="check" size={12} color={colors.success} />
                      <Text style={[styles.featureText, { color: colors.textSecondary }]}>{feature}</Text>
                    </View>
                  ))}
                </View>

                {/* Action Button */}
                {!isCurrentPlan && (
                  <View style={styles.actionContainer}>
                    {plan.trialDays && subscription?.plan === 'free' ? (
                      <TouchableOpacity
                        style={[styles.actionButton, { backgroundColor: colors.info }]}
                        onPress={() => {
                          feedback.buttonPress();
                          handleStartTrial(plan.id);
                        }}
                        disabled={actionLoading === `trial-${plan.id}`}
                      >
                        {actionLoading === `trial-${plan.id}` ? (
                          <ActivityIndicator size="small" color="white" />
                        ) : (
                          <Text style={styles.actionButtonText}>Start {plan.trialDays}-day Free Trial</Text>
                        )}
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={[styles.actionButton, { backgroundColor: plan.price === 0 ? colors.textSecondary : colors.success }]}
                        onPress={() => {
                          feedback.buttonPress();
                          handleUpgrade(plan.id);
                        }}
                        disabled={actionLoading === plan.id}
                      >
                        {actionLoading === plan.id ? (
                          <ActivityIndicator size="small" color="white" />
                        ) : (
                          <Text style={styles.actionButtonText}>
                            {plan.price === 0 ? 'Switch to Free' : 'Upgrade Now'}
                          </Text>
                        )}
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              </View>
            );
          })}
        </View>

        {/* Management Actions */}
        {subscription && subscription.plan !== 'free' && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Manage Subscription</Text>
            <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              {subscription.status === 'active' && (
                <>
                  <TouchableOpacity
                    style={[styles.managementOption]}
                    onPress={() => {
                      feedback.buttonPress();
                      handleToggleAutoRenew();
                    }}
                    disabled={actionLoading === 'auto-renew'}
                  >
                    <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
                      <FontAwesome5 name="sync" size={14} color={colors.primary} />
                    </View>
                    <View style={styles.optionContent}>
                      <Text style={[styles.optionText, { color: colors.text }]}>
                        {subscription.autoRenew ? 'Disable Auto-Renewal' : 'Enable Auto-Renewal'}
                      </Text>
                      <Text style={[styles.optionSubtext, { color: colors.textSecondary }]}>
                        {subscription.autoRenew ? 'Turn off automatic billing' : 'Automatically renew your subscription'}
                      </Text>
                    </View>
                    {actionLoading === 'auto-renew' && <ActivityIndicator size="small" color={colors.primary} />}
                  </TouchableOpacity>

                  <View style={[styles.divider, { backgroundColor: colors.border }]} />

                  <TouchableOpacity
                    style={styles.managementOption}
                    onPress={() => {
                      feedback.buttonPress();
                      handleCancel();
                    }}
                    disabled={actionLoading === 'cancel'}
                  >
                    <View style={[styles.iconContainer, { backgroundColor: colors.error + '20' }]}>
                      <FontAwesome5 name="times" size={14} color={colors.error} />
                    </View>
                    <View style={styles.optionContent}>
                      <Text style={[styles.optionText, { color: colors.error }]}>Cancel Subscription</Text>
                      <Text style={[styles.optionSubtext, { color: colors.textSecondary }]}>
                        You&apos;ll keep access until your current period ends
                      </Text>
                    </View>
                    {actionLoading === 'cancel' && <ActivityIndicator size="small" color={colors.error} />}
                  </TouchableOpacity>
                </>
              )}

              {subscription.status === 'canceled' && (
                <TouchableOpacity
                  style={styles.managementOption}
                  onPress={() => {
                    feedback.buttonPress();
                    handleRenew();
                  }}
                  disabled={actionLoading === 'renew'}
                >
                  <View style={[styles.iconContainer, { backgroundColor: colors.success + '20' }]}>
                    <FontAwesome5 name="redo" size={14} color={colors.success} />
                  </View>
                  <View style={styles.optionContent}>
                    <Text style={[styles.optionText, { color: colors.text }]}>Renew Subscription</Text>
                    <Text style={[styles.optionSubtext, { color: colors.textSecondary }]}>
                      Reactivate your subscription
                    </Text>
                  </View>
                  {actionLoading === 'renew' && <ActivityIndicator size="small" color={colors.success} />}
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
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
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    letterSpacing: 0.3,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    minHeight: 56,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  optionContent: {
    flex: 1,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  optionSubtext: {
    fontSize: 13,
    opacity: 0.8,
  },
  planTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  planPrice: {
    fontSize: 14,
    fontWeight: '600',
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
    marginBottom: 16,
  },
  planTitleSection: {
    flex: 1,
  },
  planName: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  popularBadge: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  popularText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  planInterval: {
    fontSize: 16,
    fontWeight: '400',
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
  actionContainer: {
    marginTop: 16,
  },
  actionButton: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    minHeight: 48,
    justifyContent: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  managementOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 0,
  },
  divider: {
    height: 1,
    marginVertical: 0,
  },
});

export default SubscriptionScreen; 