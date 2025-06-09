import { FontAwesome5 } from '@expo/vector-icons';
import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { useTheme, useSubscription } from '../../contexts';

interface SubscriptionStatusProps {
  showUpgradeButton?: boolean;
  compact?: boolean;
}

const SubscriptionStatus: React.FC<SubscriptionStatusProps> = ({ 
  showUpgradeButton = true, 
  compact = false 
}) => {
  const { colors } = useTheme();
  const { subscription, isTrialActive, getDaysUntilExpiry, isPremiumUser } = useSubscription();

  if (!subscription) return null;

  const navigateToSubscription = () => {
    router.push('/subscription' as any);
  };

  const getStatusColor = () => {
    switch (subscription.status) {
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

  const getStatusIcon = () => {
    switch (subscription.status) {
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

  const getPlanDisplayName = () => {
    switch (subscription.plan) {
      case 'free':
        return 'Free Plan';
      case 'pro':
        return 'Pro Plan';
      case 'premium':
        return 'Premium Plan';
      default:
        return subscription.plan;
    }
  };

  if (compact) {
    return (
      <TouchableOpacity 
        style={[styles.compactContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}
        onPress={navigateToSubscription}
      >
        <View style={styles.compactContent}>
          <FontAwesome5
            name={subscription.plan === 'free' ? 'star' : 'crown'}
            size={16}
            color={subscription.plan === 'free' ? colors.textSecondary : colors.primary}
          />
          <Text style={[styles.compactText, { color: colors.text }]}>
            {getPlanDisplayName()}
          </Text>
        </View>
        <FontAwesome5 name="chevron-right" size={12} color={colors.textSecondary} />
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.header}>
        <View style={styles.planInfo}>
          <View style={styles.planNameContainer}>
            <FontAwesome5
              name={subscription.plan === 'free' ? 'star' : 'crown'}
              size={18}
              color={subscription.plan === 'free' ? colors.textSecondary : colors.primary}
            />
            <Text style={[styles.planName, { color: colors.text }]}>
              {getPlanDisplayName()}
            </Text>
          </View>
          
          <View style={styles.statusContainer}>
            <FontAwesome5
              name={getStatusIcon()}
              size={12}
              color={getStatusColor()}
            />
            <Text style={[styles.statusText, { color: getStatusColor() }]}>
              {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
            </Text>
          </View>
        </View>

        {showUpgradeButton && subscription.plan === 'free' && (
          <TouchableOpacity
            style={[styles.upgradeButton, { backgroundColor: colors.primary }]}
            onPress={navigateToSubscription}
          >
            <FontAwesome5 name="arrow-up" size={12} color="white" />
            <Text style={styles.upgradeButtonText}>Upgrade</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Additional Info */}
      <View style={styles.additionalInfo}>
        {isTrialActive() && (
          <Text style={[styles.infoText, { color: colors.warning }]}>
            <FontAwesome5 name="clock" size={12} color={colors.warning} />
            {' '}Trial expires in {getDaysUntilExpiry()} days
          </Text>
        )}
        
        {subscription.status === 'canceled' && (
          <Text style={[styles.infoText, { color: colors.error }]}>
            <FontAwesome5 name="exclamation-triangle" size={12} color={colors.error} />
            {' '}Subscription canceled - expires in {getDaysUntilExpiry()} days
          </Text>
        )}
        
        {subscription.plan !== 'free' && subscription.status === 'active' && !isTrialActive() && (
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            <FontAwesome5 name="calendar" size={12} color={colors.textSecondary} />
            {' '}Renews in {getDaysUntilExpiry()} days
          </Text>
        )}
        
        {subscription.plan === 'free' && (
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            <FontAwesome5 name="info-circle" size={12} color={colors.textSecondary} />
            {' '}Limited features available
          </Text>
        )}
      </View>

      {/* Feature Highlights for Free Users */}
      {subscription.plan === 'free' && showUpgradeButton && (
        <View style={styles.featureHighlights}>
          <Text style={[styles.featureTitle, { color: colors.text }]}>Unlock Premium Features:</Text>
          <View style={styles.featureList}>
            <View style={styles.featureItem}>
              <FontAwesome5 name="users" size={10} color={colors.primary} />
              <Text style={[styles.featureText, { color: colors.textSecondary }]}>Unlimited groups</Text>
            </View>
            <View style={styles.featureItem}>
              <FontAwesome5 name="chart-line" size={10} color={colors.primary} />
              <Text style={[styles.featureText, { color: colors.textSecondary }]}>Advanced analytics</Text>
            </View>
            <View style={styles.featureItem}>
              <FontAwesome5 name="download" size={10} color={colors.primary} />
              <Text style={[styles.featureText, { color: colors.textSecondary }]}>Export reports</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
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
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  compactContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  compactText: {
    fontSize: 14,
    fontWeight: '500',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  planInfo: {
    flex: 1,
  },
  planNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  planName: {
    fontSize: 18,
    fontWeight: '700',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  upgradeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  upgradeButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  additionalInfo: {
    marginBottom: 12,
  },
  infoText: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 4,
  },
  featureHighlights: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  featureList: {
    gap: 6,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureText: {
    fontSize: 12,
    fontWeight: '500',
  },
});

export default SubscriptionStatus; 