import { FontAwesome5 } from '@expo/vector-icons';
import React from 'react';
import {
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useTheme } from '../contexts';

export default function AboutScreen() {
  const { colors } = useTheme();

  const handleLinkPress = (url: string) => {
    Linking.openURL(url);
  };

  const features = [
    { icon: 'rocket', title: 'Fast & Reliable', description: 'Optimized performance for smooth user experience' },
    { icon: 'shield-alt', title: 'Secure', description: 'Industry-standard security to protect your data' },
    { icon: 'mobile-alt', title: 'Cross-Platform', description: 'Works seamlessly on iOS and Android' },
    { icon: 'palette', title: 'Beautiful Design', description: 'Modern UI with light and dark themes' },
  ];

  const teamMembers = [
    { name: 'Alex Johnson', role: 'Lead Developer', icon: 'code' },
    { name: 'Sarah Chen', role: 'UI/UX Designer', icon: 'paint-brush' },
    { name: 'Mike Rodriguez', role: 'Product Manager', icon: 'clipboard-list' },
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
                style={[styles.featureCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
              >
                <FontAwesome5 name={feature.icon as any} size={20} color={colors.primary} />
                <Text style={[styles.featureTitle, { color: colors.text }]}>{feature.title}</Text>
                <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
                  {feature.description}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Team Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Our Team</Text>
          {teamMembers.map((member, index) => (
            <View 
              key={index}
              style={[styles.teamMember, { backgroundColor: colors.surface, borderColor: colors.border }]}
            >
              <View style={[styles.memberIcon, { backgroundColor: colors.accent + '20' }]}>
                <FontAwesome5 name={member.icon as any} size={16} color={colors.accent} />
              </View>
              <View style={styles.memberInfo}>
                <Text style={[styles.memberName, { color: colors.text }]}>{member.name}</Text>
                <Text style={[styles.memberRole, { color: colors.textSecondary }]}>{member.role}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Legal Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Legal</Text>
          <View style={[styles.legalCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <TouchableOpacity 
              style={styles.legalItem}
              onPress={() => handleLinkPress('https://example.com/privacy')}
            >
              <FontAwesome5 name="shield-alt" size={16} color={colors.info} />
              <Text style={[styles.legalText, { color: colors.text }]}>Privacy Policy</Text>
              <FontAwesome5 name="external-link-alt" size={12} color={colors.textSecondary} />
            </TouchableOpacity>
            
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            
            <TouchableOpacity 
              style={styles.legalItem}
              onPress={() => handleLinkPress('https://example.com/terms')}
            >
              <FontAwesome5 name="file-contract" size={16} color={colors.warning} />
              <Text style={[styles.legalText, { color: colors.text }]}>Terms of Service</Text>
              <FontAwesome5 name="external-link-alt" size={12} color={colors.textSecondary} />
            </TouchableOpacity>
            
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            
            <TouchableOpacity 
              style={styles.legalItem}
              onPress={() => handleLinkPress('https://example.com/licenses')}
            >
              <FontAwesome5 name="balance-scale" size={16} color={colors.success} />
              <Text style={[styles.legalText, { color: colors.text }]}>Open Source Licenses</Text>
              <FontAwesome5 name="external-link-alt" size={12} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Contact Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Get in Touch</Text>
          <View style={[styles.contactCard, { backgroundColor: colors.primary + '15', borderColor: colors.primary + '30' }]}>
            <FontAwesome5 name="envelope" size={20} color={colors.primary} />
            <Text style={[styles.contactTitle, { color: colors.text }]}>Contact Us</Text>
            <Text style={[styles.contactText, { color: colors.textSecondary }]}>
              Have questions or feedback? We&apos;d love to hear from you!
            </Text>
            <TouchableOpacity 
              style={[styles.contactButton, { backgroundColor: colors.primary }]}
              onPress={() => handleLinkPress('mailto:support@simpleai.com')}
            >
              <Text style={styles.contactButtonText}>support@simpleai.com</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Copyright */}
        <View style={styles.copyrightSection}>
          <Text style={[styles.copyrightText, { color: colors.textSecondary }]}>
            © 2024 SimpleAI. All rights reserved.
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
  featureTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 6,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
  teamMember: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  memberIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  memberRole: {
    fontSize: 14,
  },
  legalCard: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  legalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  legalText: {
    fontSize: 15,
    fontWeight: '500',
    flex: 1,
    marginLeft: 12,
  },
  divider: {
    height: 1,
    marginLeft: 44,
  },
  contactCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    alignItems: 'center',
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 8,
  },
  contactText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  contactButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  contactButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
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