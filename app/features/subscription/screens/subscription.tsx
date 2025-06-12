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
import Button from '../../../../src/shared/components/ui/Button';
import PageWithAnimatedHeader from '../../../../src/shared/components/layout/PageWithAnimatedHeader';
import { useTheme, useSubscription, useHeader } from '../../../../contexts';
import type { SubscriptionPlan } from '../../../../contexts';
import { feedback } from '../../../../lib/feedback';

const SubscriptionContent = () => {
  const { colors } = useTheme();
  const { headerHeight, handleScroll } = useHeader();
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
        contentContainerStyle={[styles.contentContainer, { paddingTop: headerHeight + 20 }]}
        onScroll={handleScroll}
        scrollEventThrottle={16}
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
                      <View style={styles.badgeContainer}>
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
                      <Button
                        title={`Start ${plan.trialDays}-day Free Trial`}
                        variant="secondary"
                        onPress={() => handleStartTrial(plan.id)}
                        disabled={actionLoading === `trial-${plan.id}`}
                        loading={actionLoading === `trial-${plan.id}`}
                        style={styles.actionButton}
                      />
                    ) : (
                      <Button
                        title={plan.price === 0 ? 'Switch to Free' : 'Upgrade Now'}
                        variant={plan.price === 0 ? 'ghost' : 'primary'}
                        onPress={() => handleUpgrade(plan.id)}
                        disabled={actionLoading === plan.id}
                        loading={actionLoading === plan.id}
                        style={styles.actionButton}
                      />
                    )}
                  </View>
                )}
              </View>
            );
          })}
        </View>

        {/* Management Actions */}
        {subscription && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Manage Subscription</Text>
            <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              
              {/* Current Plan Status */}
              <View style={styles.managementOption}>
                <View style={[styles.iconContainer, { backgroundColor: getStatusColor(subscription.status) + '20' }]}>
                  <FontAwesome5 name={getStatusIcon(subscription.status)} size={14} color={getStatusColor(subscription.status)} />
                </View>
                <View style={styles.optionContent}>
                  <Text style={[styles.optionText, { color: colors.text }]}>
                    Current Plan: {availablePlans.find(p => p.id === subscription.plan)?.name || subscription.plan}
                  </Text>
                  <Text style={[styles.optionSubtext, { color: colors.textSecondary }]}>
                    Status: {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                    {subscription.endDate && ` • Expires ${formatDate(subscription.endDate)}`}
                  </Text>
                </View>
              </View>

              {/* Paid Plan Management */}
              {subscription.plan !== 'free' && (
                <>
                  <View style={[styles.divider, { backgroundColor: colors.border }]} />
                  
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

                      <View style={styles.managementButtonContainer}>
                        <Button
                          title="Cancel Subscription"
                          variant="destructive"
                          onPress={handleCancel}
                          disabled={actionLoading === 'cancel'}
                          loading={actionLoading === 'cancel'}
                        />
                        <Text style={[styles.managementHint, { color: colors.textSecondary }]}>
                          You&apos;ll keep access until your current period ends
                        </Text>
                      </View>
                    </>
                  )}

                  {subscription.status === 'canceled' && (
                    <View style={styles.managementButtonContainer}>
                      <Button
                        title="Renew Subscription"
                        variant="primary"
                        onPress={handleRenew}
                        disabled={actionLoading === 'renew'}
                        loading={actionLoading === 'renew'}
                      />
                      <Text style={[styles.managementHint, { color: colors.textSecondary }]}>
                        Reactivate your subscription
                      </Text>
                    </View>
                  )}
                </>
              )}

              {/* Free Plan Management */}
              {subscription.plan === 'free' && (
                <>
                  <View style={[styles.divider, { backgroundColor: colors.border }]} />
                  
                  <View style={styles.managementButtonContainer}>
                    <Text style={[styles.managementHint, { color: colors.textSecondary, textAlign: 'center', marginBottom: 12 }]}>
                      Upgrade to unlock premium features and remove limitations
                    </Text>
                    <Button
                      title="View Premium Plans"
                      variant="primary"
                      onPress={() => {
                        feedback.buttonPress();
                        // Scroll to top to show plans
                      }}
                    />
                  </View>
                </>
              )}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default function SubscriptionScreen() {
  return (
    <PageWithAnimatedHeader title="Subscription">
      <SubscriptionContent />
    </PageWithAnimatedHeader>
  );
}

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
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
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
  managementButtonContainer: {
    paddingVertical: 16,
  },
  managementHint: {
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
    opacity: 0.8,
  },
});

 