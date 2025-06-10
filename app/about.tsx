import { FontAwesome5 } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Button from './components/Button';
import { useTheme } from '../contexts';
import { feedback } from '../lib/feedback';

export default function AboutScreen() {
  const { colors } = useTheme();

  const handleNavigateToPrivacy = () => {
    router.push('/privacy-policy' as any);
  };

  const handleNavigateToTerms = () => {
    router.push('/terms-of-service' as any);
  };

  const features = [
    { icon: 'rocket', title: 'Fast & Reliable', description: 'Optimized performance for smooth user experience', color: colors.primary },
    { icon: 'shield-alt', title: 'Secure', description: 'Industry-standard security to protect your data', color: colors.success },
    { icon: 'mobile-alt', title: 'Cross-Platform', description: 'Works seamlessly on iOS and Android', color: colors.info },
    { icon: 'palette', title: 'Beautiful Design', description: 'Modern UI with light and dark themes', color: colors.accent },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* App Info Section */}
        <View style={[styles.appInfoCard, { backgroundColor: colors.primary + '15', borderColor: colors.primary + '30' }]}>
          <View style={[styles.appIcon, { backgroundColor: colors.primary }]}>
            <FontAwesome5 name="rocket" size={32} color="#fff" />
          </View>
          <Text style={[styles.appName, { color: colors.text }]}>SimpleAI</Text>
          <Text style={[styles.appTagline, { color: colors.textSecondary }]}>
            Your intelligent assistant for everyday tasks
          </Text>
          <View style={[styles.versionBadge, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.versionText, { color: colors.textSecondary }]}>Version 1.0.0</Text>
          </View>
        </View>

        {/* Features Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Features</Text>
          <View style={styles.featuresGrid}>
            {features.map((feature, index) => (
              <View 
                key={index}
                style={[styles.featureCard, { backgroundColor: feature.color + '10', borderColor: feature.color + '30' }]}
              >
                <View style={[styles.featureIconContainer, { backgroundColor: feature.color + '20' }]}>
                  <FontAwesome5 name={feature.icon as any} size={20} color={feature.color} />
                </View>
                <Text style={[styles.featureTitle, { color: colors.text }]}>{feature.title}</Text>
                <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
                  {feature.description}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Company Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Company</Text>
          <View style={[styles.companyCard, { backgroundColor: colors.accent + '10', borderColor: colors.accent + '30' }]}>
            <View style={[styles.companyIcon, { backgroundColor: colors.accent + '20' }]}>
              <FontAwesome5 name="building" size={24} color={colors.accent} />
            </View>
            <View style={styles.companyInfo}>
              <Text style={[styles.companyName, { color: colors.text }]}>SimpleAI Technologies</Text>
              <Text style={[styles.companyDescription, { color: colors.textSecondary }]}>
                Innovative solutions for modern productivity and intelligent automation
              </Text>
              <View style={styles.companyMeta}>
                <View style={styles.metaItem}>
                  <FontAwesome5 name="calendar-alt" size={12} color={colors.textSecondary} />
                  <Text style={[styles.metaText, { color: colors.textSecondary }]}>Founded 2024</Text>
                </View>
                <View style={styles.metaItem}>
                  <FontAwesome5 name="map-marker-alt" size={12} color={colors.textSecondary} />
                  <Text style={[styles.metaText, { color: colors.textSecondary }]}>Global</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Legal Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Legal & Privacy</Text>
          <View style={[styles.legalCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.legalButtonContainer}>
              <Button
                title="Privacy Policy"
                variant="outline"
                onPress={() => {
                  feedback.navigate();
                  handleNavigateToPrivacy();
                }}
                style={styles.legalButton}
              />
              <Text style={[styles.legalHint, { color: colors.textSecondary }]}>
                How we collect, use, and protect your data
              </Text>
            </View>
            
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            
            <View style={styles.legalButtonContainer}>
              <Button
                title="Terms of Service"
                variant="outline"
                onPress={() => {
                  feedback.navigate();
                  handleNavigateToTerms();
                }}
                style={styles.legalButton}
              />
              <Text style={[styles.legalHint, { color: colors.textSecondary }]}>
                Terms and conditions for using our app
              </Text>
            </View>
          </View>
        </View>

        {/* Contact Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Get in Touch</Text>
          <View style={[styles.contactCard, { backgroundColor: colors.success + '10', borderColor: colors.success + '30' }]}>
            <View style={[styles.contactIconContainer, { backgroundColor: colors.success + '20' }]}>
              <FontAwesome5 name="envelope" size={20} color={colors.success} />
            </View>
            <Text style={[styles.contactTitle, { color: colors.text }]}>Contact Us</Text>
            <Text style={[styles.contactText, { color: colors.textSecondary }]}>
              Have questions or feedback? We&apos;d love to hear from you!
            </Text>
            <Button
              title="support@simpleai.com"
              variant="primary"
              onPress={() => {
                feedback.info('Opening Email', 'Redirecting to your email client...');
                Linking.openURL('mailto:support@simpleai.com');
              }}
              style={styles.contactButton}
            />
          </View>
        </View>

        {/* App Stats Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>App Statistics</Text>
          <View style={styles.statsGrid}>
            <View style={[styles.statCard, { backgroundColor: colors.primary + '10', borderColor: colors.primary + '30' }]}>
              <FontAwesome5 name="download" size={18} color={colors.primary} />
              <Text style={[styles.statNumber, { color: colors.text }]}>10K+</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Downloads</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: colors.warning + '10', borderColor: colors.warning + '30' }]}>
              <FontAwesome5 name="star" size={18} color={colors.warning} />
              <Text style={[styles.statNumber, { color: colors.text }]}>4.8</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Rating</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: colors.info + '10', borderColor: colors.info + '30' }]}>
              <FontAwesome5 name="users" size={18} color={colors.info} />
              <Text style={[styles.statNumber, { color: colors.text }]}>5K+</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Active Users</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: colors.error + '10', borderColor: colors.error + '30' }]}>
              <FontAwesome5 name="chart-line" size={18} color={colors.error} />
              <Text style={[styles.statNumber, { color: colors.text }]}>99.9%</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Uptime</Text>
            </View>
          </View>
        </View>

        {/* Copyright */}
        <View style={styles.copyrightSection}>
          <Text style={[styles.copyrightText, { color: colors.textSecondary }]}>
            © 2024 SimpleAI Technologies. All rights reserved.
          </Text>
          <Text style={[styles.copyrightText, { color: colors.textSecondary }]}>
            Made with ❤️ using React Native & Expo
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  appInfoCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 24,
    alignItems: 'center',
    marginBottom: 32,
  },
  appIcon: {
    width: 80,
    height: 80,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  appName: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  appTagline: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 22,
  },
  versionBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
  },
  versionText: {
    fontSize: 12,
    fontWeight: '500',
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    letterSpacing: 0.3,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    width: '48%',
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  featureIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
  companyCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  companyIcon: {
    width: 50,
    height: 50,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  companyInfo: {
    flex: 1,
  },
  companyName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  companyDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  companyMeta: {
    flexDirection: 'row',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 12,
    fontWeight: '500',
  },
  legalCard: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  legalButtonContainer: {
    padding: 16,
  },
  legalButton: {
    marginBottom: 8,
  },
  legalHint: {
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
  },
  divider: {
    height: 1,
    marginLeft: 64,
  },
  contactCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    alignItems: 'center',
  },
  contactIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  contactText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  copyrightSection: {
    alignItems: 'center',
    marginTop: 20,
    paddingTop: 20,
  },
  copyrightText: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 4,
    opacity: 0.7,
  },
}); 