import { FontAwesome5 } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
    Linking,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Button from '../../../../src/shared/components/ui/Button';
import PageWithAnimatedHeader from '../../../../src/shared/components/layout/PageWithAnimatedHeader';
import { useTheme, useHeader } from '../../../../contexts';
import { feedback } from '../../../../lib/feedback';

function AboutContent() {
  const { colors } = useTheme();
  const { headerHeight, handleScroll } = useHeader();

  const handleNavigateToPrivacy = () => {
    router.push('/privacy-policy' as any);
  };

  const handleNavigateToTerms = () => {
    router.push('/terms-of-service' as any);
  };

  const features = [
    { 
      icon: 'heart', 
      title: 'Supportive Community', 
      description: 'Connect with fellow parents and caregivers for guidance, support, and shared experiences', 
      color: colors.primary 
    },
    { 
      icon: 'book-open', 
      title: 'Real Stories', 
      description: 'Learn from authentic parent experiences and stories from real families', 
      color: colors.success 
    },
    { 
      icon: 'map', 
      title: 'Practical Playbooks', 
      description: 'Situation-specific guides to navigate common parenting challenges with confidence', 
      color: colors.info 
    },
    { 
      icon: 'spa', 
      title: 'Self-Care Tools', 
      description: 'Mindfulness exercises, breathing techniques, and wellness tools for parent well-being', 
      color: colors.accent 
    },
    { 
      icon: 'shield-alt', 
      title: 'Safe Space', 
      description: 'Secure, judgment-free environment where you can share and seek support', 
      color: colors.warning 
    },
    { 
      icon: 'lightbulb', 
      title: 'Daily Insights', 
      description: 'Evidence-based tips and gentle reminders to support your parenting journey', 
      color: colors.error 
    }
  ];

  const values = [
    { name: 'Empathy', icon: 'heart', color: '#EF4444' },
    { name: 'Growth', icon: 'seedling', color: '#10B981' },
    { name: 'Support', icon: 'hands-helping', color: '#6366F1' },
    { name: 'Authenticity', icon: 'user-check', color: '#F59E0B' },
    { name: 'Balance', icon: 'yin-yang', color: '#8B5CF6' },
    { name: 'Connection', icon: 'link', color: '#06B6D4' }
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView 
        style={styles.content}
        contentContainerStyle={[styles.contentContainer, { paddingTop: headerHeight }]}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        {/* App Info Section */}
        <View style={[styles.appInfoCard, { backgroundColor: colors.primary + '15', borderColor: colors.primary + '30' }]}>
          <View style={[styles.appIcon, { backgroundColor: colors.primary }]}>
            <FontAwesome5 name="heart" size={36} color="#fff" />
          </View>
          <Text style={[styles.appName, { color: colors.text }]}>RaisingHuman</Text>
          <Text style={[styles.appTagline, { color: colors.textSecondary }]}>
            Supporting parents and caregivers on their journey
          </Text>
          <Text style={[styles.appDescription, { color: colors.textSecondary }]}>
            RaisingHuman is a community and learning app designed for parents and caregivers. 
            We provide evidence-based guidance, curated content, and supportive connections 
            to help you raise confident, compassionate, and resilient children.
          </Text>
          <View style={[styles.versionBadge, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <FontAwesome5 name="tag" size={10} color={colors.textSecondary} style={styles.versionIcon} />
            <Text style={[styles.versionText, { color: colors.textSecondary }]}>Version 1.0.0</Text>
          </View>
        </View>

        {/* Features Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Key Features</Text>
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

        {/* Our Values */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Our Values</Text>
          <View style={styles.techGrid}>
            {values.map((value, index) => (
              <View 
                key={index}
                style={[styles.techCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
              >
                <FontAwesome5 name={value.icon as any} size={16} color={value.color} />
                <Text style={[styles.techName, { color: colors.text }]}>{value.name}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Our Mission */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Our Mission</Text>
          <View style={[styles.companyCard, { backgroundColor: colors.accent + '10', borderColor: colors.accent + '30' }]}>
            <View style={[styles.companyIcon, { backgroundColor: colors.accent + '20' }]}>
              <FontAwesome5 name="compass" size={24} color={colors.accent} />
            </View>
            <View style={styles.companyInfo}>
              <Text style={[styles.companyName, { color: colors.text }]}>Empowering Every Parent</Text>
              <Text style={[styles.companyDescription, { color: colors.textSecondary }]}>
                We believe every parent deserves support, guidance, and connection. RaisingHuman creates a safe, 
                judgment-free space where caregivers can learn, grow, and find the confidence to navigate 
                their unique parenting journey with wisdom and compassion.
              </Text>
              <View style={styles.companyMeta}>
                <View style={styles.metaItem}>
                  <FontAwesome5 name="calendar-alt" size={12} color={colors.textSecondary} />
                  <Text style={[styles.metaText, { color: colors.textSecondary }]}>Launched 2024</Text>
                </View>
                <View style={styles.metaItem}>
                  <FontAwesome5 name="users" size={12} color={colors.textSecondary} />
                  <Text style={[styles.metaText, { color: colors.textSecondary }]}>Community First</Text>
                </View>
                <View style={styles.metaItem}>
                  <FontAwesome5 name="shield-alt" size={12} color={colors.textSecondary} />
                  <Text style={[styles.metaText, { color: colors.textSecondary }]}>Safe & Secure</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Community Impact */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Our Community</Text>
          <View style={styles.statsGrid}>
            <View style={[styles.statCard, { backgroundColor: colors.primary + '10', borderColor: colors.primary + '30' }]}>
              <FontAwesome5 name="heart" size={18} color={colors.primary} />
              <Text style={[styles.statNumber, { color: colors.text }]}>5K+</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Parents Helped</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: colors.warning + '10', borderColor: colors.warning + '30' }]}>
              <FontAwesome5 name="book-open" size={18} color={colors.warning} />
              <Text style={[styles.statNumber, { color: colors.text }]}>200+</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Stories Shared</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: colors.info + '10', borderColor: colors.info + '30' }]}>
              <FontAwesome5 name="map" size={18} color={colors.info} />
              <Text style={[styles.statNumber, { color: colors.text }]}>50+</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Playbooks</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: colors.success + '10', borderColor: colors.success + '30' }]}>
              <FontAwesome5 name="comments" size={18} color={colors.success} />
              <Text style={[styles.statNumber, { color: colors.text }]}>1K+</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Discussions</Text>
            </View>
          </View>
        </View>

        {/* Legal Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Legal & Privacy</Text>
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <TouchableOpacity 
              style={styles.optionItem}
              onPress={() => {
                feedback.navigate();
                handleNavigateToPrivacy();
              }}
            >
              <View style={[styles.iconContainer, { backgroundColor: colors.info + '20' }]}>
                <FontAwesome5 name="shield-alt" size={14} color={colors.info} />
              </View>
              <View style={styles.optionContent}>
                <Text style={[styles.optionText, { color: colors.text }]}>Privacy Policy</Text>
                <Text style={[styles.optionSubtext, { color: colors.textSecondary }]}>
                  How we protect your family's privacy and keep your data secure
                </Text>
              </View>
              <FontAwesome5 name="chevron-right" size={12} color={colors.textSecondary} />
            </TouchableOpacity>
            
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            
            <TouchableOpacity 
              style={styles.optionItem}
              onPress={() => {
                feedback.navigate();
                handleNavigateToTerms();
              }}
            >
              <View style={[styles.iconContainer, { backgroundColor: colors.warning + '20' }]}>
                <FontAwesome5 name="file-contract" size={14} color={colors.warning} />
              </View>
              <View style={styles.optionContent}>
                <Text style={[styles.optionText, { color: colors.text }]}>Terms of Service</Text>
                <Text style={[styles.optionSubtext, { color: colors.textSecondary }]}>
                  Terms and conditions for using RaisingHuman app and community features
                </Text>
              </View>
              <FontAwesome5 name="chevron-right" size={12} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Contact Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Get Support</Text>
          <View style={[styles.contactCard, { backgroundColor: colors.success + '10', borderColor: colors.success + '30' }]}>
            <View style={[styles.contactIconContainer, { backgroundColor: colors.success + '20' }]}>
              <FontAwesome5 name="question-circle" size={20} color={colors.success} />
            </View>
            <Text style={[styles.contactTitle, { color: colors.text }]}>Need Help?</Text>
            <Text style={[styles.contactText, { color: colors.textSecondary }]}>
              Have questions about the app, need support with parenting challenges, or want to connect 
              with other parents? We're here to help you on your parenting journey.
            </Text>
            <View style={styles.contactActions}>
              <Button
                title="support@raisinghuman.app"
                variant="primary"
                onPress={() => {
                  feedback.info('Opening Email', 'Redirecting to your email client...');
                  Linking.openURL('mailto:support@raisinghuman.app?subject=RaisingHuman Support');
                }}
                style={styles.contactButton}
              />
              <TouchableOpacity 
                style={[styles.socialButton, { backgroundColor: colors.info + '20' }]}
                onPress={() => {
                  feedback.info('Opening Community', 'Joining our parent community...');
                  Linking.openURL('https://community.raisinghuman.app');
                }}
              >
                <FontAwesome5 name="users" size={16} color={colors.info} />
                <Text style={[styles.socialText, { color: colors.info }]}>Join Community</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Evidence-Based Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Evidence-Based Guidance</Text>
          <View style={[styles.openSourceCard, { backgroundColor: colors.accent + '10', borderColor: colors.accent + '30' }]}>
            <View style={[styles.openSourceIcon, { backgroundColor: colors.accent + '20' }]}>
              <FontAwesome5 name="graduation-cap" size={20} color={colors.accent} />
            </View>
            <Text style={[styles.openSourceTitle, { color: colors.text }]}>Research-Backed Content</Text>
            <Text style={[styles.openSourceText, { color: colors.textSecondary }]}>
              All our playbooks, tips, and guidance are based on current research in child development, 
              psychology, and parenting. We work with experts to ensure you get reliable, science-backed advice.
            </Text>
            <TouchableOpacity 
              style={[styles.githubButton, { backgroundColor: colors.text + '10', borderColor: colors.text + '30' }]}
              onPress={() => {
                feedback.info('Opening Resources', 'Viewing our research sources...');
                Linking.openURL('https://raisinghuman.app/research');
              }}
            >
              <FontAwesome5 name="external-link-alt" size={16} color={colors.text} />
              <Text style={[styles.githubText, { color: colors.text }]}>View Research</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Copyright */}
        <View style={styles.copyrightSection}>
          <Text style={[styles.copyrightText, { color: colors.textSecondary }]}>
            © 2024 RaisingHuman. All rights reserved.
          </Text>
          <Text style={[styles.copyrightText, { color: colors.textSecondary }]}>
            Supporting parents and caregivers with love and evidence ❤️
          </Text>
          <View style={styles.socialLinks}>
            <TouchableOpacity 
              onPress={() => Linking.openURL('https://twitter.com/raisinghuman')}
              style={[styles.socialLink, { backgroundColor: colors.surface }]}
            >
              <FontAwesome5 name="twitter" size={14} color={colors.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => Linking.openURL('https://instagram.com/raisinghuman')}
              style={[styles.socialLink, { backgroundColor: colors.surface }]}
            >
              <FontAwesome5 name="instagram" size={14} color={colors.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => Linking.openURL('https://facebook.com/raisinghumanapp')}
              style={[styles.socialLink, { backgroundColor: colors.surface }]}
            >
              <FontAwesome5 name="facebook" size={14} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

export default function AboutScreen() {
  const { colors } = useTheme();

  // Custom back button to navigate to settings
  const customBackButton = (
    <TouchableOpacity
      style={[styles.headerBackButton, { backgroundColor: colors.surface }]}
      onPress={() => router.push('/settings')}
    >
      <FontAwesome5 name="arrow-left" size={18} color={colors.text} />
    </TouchableOpacity>
  );


  return (
    <PageWithAnimatedHeader title="About" headerLeft={customBackButton}>
      <AboutContent />
    </PageWithAnimatedHeader>
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
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  appTagline: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 22,
  },
  appDescription: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  versionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
  },
  versionIcon: {
    marginRight: 6,
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
  card: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    ...(Platform.OS === 'ios' ? {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
    } : {
      elevation: 3,
    }),
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    minHeight: 64,
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
    lineHeight: 18,
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
  techGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  techCard: {
    width: '31%',
    borderRadius: 10,
    borderWidth: 1,
    padding: 12,
    marginBottom: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  techName: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 6,
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
    marginBottom: 8,
  },
  companyDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  companyMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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
  divider: {
    height: 1,
    marginLeft: 50,
    marginRight: 16,
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
  contactActions: {
    gap: 12,
    alignItems: 'center',
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  socialText: {
    fontSize: 14,
    fontWeight: '500',
  },
  openSourceCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    alignItems: 'center',
  },
  openSourceIcon: {
    width: 50,
    height: 50,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  openSourceTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  openSourceText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  githubButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  githubText: {
    fontSize: 14,
    fontWeight: '500',
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
  socialLinks: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 12,
  },
  socialLink: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerBackButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
}); 