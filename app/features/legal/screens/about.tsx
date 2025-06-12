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
      icon: 'cogs', 
      title: 'Context-Driven', 
      description: 'Advanced state management using React Context patterns for scalable architecture', 
      color: colors.primary 
    },
    { 
      icon: 'shield-alt', 
      title: 'Secure & Private', 
      description: 'End-to-end encryption, biometric authentication, and comprehensive security', 
      color: colors.success 
    },
    { 
      icon: 'mobile-alt', 
      title: 'Cross-Platform', 
      description: 'Seamless experience across iOS, Android, and web with responsive design', 
      color: colors.info 
    },
    { 
      icon: 'palette', 
      title: 'Beautiful Design', 
      description: 'Modern, accessible UI with dynamic themes and smooth animations', 
      color: colors.accent 
    },
    { 
      icon: 'route', 
      title: 'Smart Navigation', 
      description: 'File-based routing with drawer and tab navigation patterns', 
      color: colors.warning 
    },
    { 
      icon: 'code', 
      title: 'Developer Ready', 
      description: 'TypeScript, testing, linting, and comprehensive development tools', 
      color: colors.error 
    }
  ];

  const technologies = [
    { name: 'React Native', icon: 'react', color: '#61DAFB' },
    { name: 'TypeScript', icon: 'code', color: '#3178C6' },
    { name: 'Expo', icon: 'mobile-alt', color: '#000020' },
    { name: 'Context API', icon: 'cogs', color: '#61DAFB' },
    { name: 'Expo Router', icon: 'route', color: '#000020' },
    { name: 'Jest Testing', icon: 'vial', color: '#C21325' }
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView 
        style={styles.content}
        contentContainerStyle={[styles.contentContainer, { paddingTop: headerHeight + 20 }]}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        {/* App Info Section */}
        <View style={[styles.appInfoCard, { backgroundColor: colors.primary + '15', borderColor: colors.primary + '30' }]}>
          <View style={[styles.appIcon, { backgroundColor: colors.primary }]}>
            <FontAwesome5 name="layer-group" size={36} color="#fff" />
          </View>
          <Text style={[styles.appName, { color: colors.text }]}>React Native Context Template</Text>
          <Text style={[styles.appTagline, { color: colors.textSecondary }]}>
            Production-ready template with Context patterns
          </Text>
          <Text style={[styles.appDescription, { color: colors.textSecondary }]}>
            A comprehensive React Native template featuring advanced Context-based state management, 
            authentication, theming, and navigation. Built for developers who want to create 
            scalable, maintainable mobile applications.
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

        {/* Technology Stack */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Built With</Text>
          <View style={styles.techGrid}>
            {technologies.map((tech, index) => (
              <View 
                key={index}
                style={[styles.techCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
              >
                <FontAwesome5 name={tech.icon as any} size={16} color={tech.color} />
                <Text style={[styles.techName, { color: colors.text }]}>{tech.name}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Company Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>About This Template</Text>
          <View style={[styles.companyCard, { backgroundColor: colors.accent + '10', borderColor: colors.accent + '30' }]}>
            <View style={[styles.companyIcon, { backgroundColor: colors.accent + '20' }]}>
              <FontAwesome5 name="users" size={24} color={colors.accent} />
            </View>
            <View style={styles.companyInfo}>
              <Text style={[styles.companyName, { color: colors.text }]}>React Native Context Template</Text>
              <Text style={[styles.companyDescription, { color: colors.textSecondary }]}>
                Created by the React Native community to provide developers with a robust, 
                production-ready template that showcases best practices for Context-based state management, 
                authentication, theming, and navigation in modern mobile applications.
              </Text>
              <View style={styles.companyMeta}>
                <View style={styles.metaItem}>
                  <FontAwesome5 name="calendar-alt" size={12} color={colors.textSecondary} />
                  <Text style={[styles.metaText, { color: colors.textSecondary }]}>Released 2024</Text>
                </View>
                <View style={styles.metaItem}>
                  <FontAwesome5 name="globe" size={12} color={colors.textSecondary} />
                  <Text style={[styles.metaText, { color: colors.textSecondary }]}>Open Source</Text>
                </View>
                <View style={styles.metaItem}>
                  <FontAwesome5 name="heart" size={12} color={colors.textSecondary} />
                  <Text style={[styles.metaText, { color: colors.textSecondary }]}>Community Driven</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* App Stats Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Template Usage</Text>
          <View style={styles.statsGrid}>
            <View style={[styles.statCard, { backgroundColor: colors.primary + '10', borderColor: colors.primary + '30' }]}>
              <FontAwesome5 name="download" size={18} color={colors.primary} />
              <Text style={[styles.statNumber, { color: colors.text }]}>10K+</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Downloads</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: colors.warning + '10', borderColor: colors.warning + '30' }]}>
              <FontAwesome5 name="star" size={18} color={colors.warning} />
              <Text style={[styles.statNumber, { color: colors.text }]}>4.9</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>GitHub Stars</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: colors.info + '10', borderColor: colors.info + '30' }]}>
              <FontAwesome5 name="code-branch" size={18} color={colors.info} />
              <Text style={[styles.statNumber, { color: colors.text }]}>500+</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Forks</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: colors.success + '10', borderColor: colors.success + '30' }]}>
              <FontAwesome5 name="users" size={18} color={colors.success} />
              <Text style={[styles.statNumber, { color: colors.text }]}>2K+</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Developers</Text>
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
                  How we collect, use, and protect your data with complete transparency
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
                  Terms and conditions for using this template and its features
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
              Have questions about the template, need help with implementation, or want to contribute? 
              Our community is here to help you succeed.
            </Text>
            <View style={styles.contactActions}>
              <Button
                title="support@react-native-context-template.dev"
                variant="primary"
                onPress={() => {
                  feedback.info('Opening Email', 'Redirecting to your email client...');
                  Linking.openURL('mailto:support@react-native-context-template.dev?subject=React Native Context Template Support');
                }}
                style={styles.contactButton}
              />
              <TouchableOpacity 
                style={[styles.socialButton, { backgroundColor: colors.info + '20' }]}
                onPress={() => {
                  feedback.info('Opening Discord', 'Joining our community...');
                  Linking.openURL('https://discord.gg/react-native-context-template');
                }}
              >
                <FontAwesome5 name="discord" size={16} color={colors.info} />
                <Text style={[styles.socialText, { color: colors.info }]}>Join Discord</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Open Source Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Open Source</Text>
          <View style={[styles.openSourceCard, { backgroundColor: colors.accent + '10', borderColor: colors.accent + '30' }]}>
            <View style={[styles.openSourceIcon, { backgroundColor: colors.accent + '20' }]}>
              <FontAwesome5 name="code-branch" size={20} color={colors.accent} />
            </View>
            <Text style={[styles.openSourceTitle, { color: colors.text }]}>Community Driven</Text>
            <Text style={[styles.openSourceText, { color: colors.textSecondary }]}>
              This template is open source and maintained by the React Native community. 
              Check out our GitHub repository to see the code, report issues, or contribute new features.
            </Text>
            <TouchableOpacity 
              style={[styles.githubButton, { backgroundColor: colors.text + '10', borderColor: colors.text + '30' }]}
              onPress={() => {
                feedback.info('Opening GitHub', 'Redirecting to our repository...');
                Linking.openURL('https://github.com/react-native-community/react-native-context-template');
              }}
            >
              <FontAwesome5 name="github" size={16} color={colors.text} />
              <Text style={[styles.githubText, { color: colors.text }]}>View on GitHub</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Copyright */}
        <View style={styles.copyrightSection}>
          <Text style={[styles.copyrightText, { color: colors.textSecondary }]}>
            © 2024 React Native Context Template. MIT License.
          </Text>
          <Text style={[styles.copyrightText, { color: colors.textSecondary }]}>
            Made with ❤️ using React Native, Expo & Context API
          </Text>
          <View style={styles.socialLinks}>
            <TouchableOpacity 
              onPress={() => Linking.openURL('https://twitter.com/rncontexttemplate')}
              style={[styles.socialLink, { backgroundColor: colors.surface }]}
            >
              <FontAwesome5 name="twitter" size={14} color={colors.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => Linking.openURL('https://github.com/react-native-community/react-native-context-template')}
              style={[styles.socialLink, { backgroundColor: colors.surface }]}
            >
              <FontAwesome5 name="github" size={14} color={colors.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => Linking.openURL('https://discord.gg/react-native-context-template')}
              style={[styles.socialLink, { backgroundColor: colors.surface }]}
            >
              <FontAwesome5 name="discord" size={14} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

export default function AboutScreen() {
  return (
    <PageWithAnimatedHeader title="About" showBackButton={true}>
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
}); 