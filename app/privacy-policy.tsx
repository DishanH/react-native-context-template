import { FontAwesome5 } from '@expo/vector-icons';
import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { useTheme } from '../contexts';

export default function PrivacyPolicyScreen() {
  const { colors } = useTheme();

  const sections = [
    {
      title: "Information We Collect",
      icon: "database",
      content: [
        "We collect information you provide directly to us, such as when you create an account, use our services, or contact us for support.",
        "We may automatically collect certain information about your device and usage patterns when you use our app.",
        "Location data may be collected with your explicit consent for location-based features."
      ]
    },
    {
      title: "How We Use Your Information",
      icon: "cogs",
      content: [
        "To provide, maintain, and improve our services",
        "To process transactions and send related information",
        "To send technical notices, updates, and administrative messages",
        "To respond to your comments, questions, and customer service requests"
      ]
    },
    {
      title: "Information Sharing",
      icon: "share-alt",
      content: [
        "We do not sell, trade, or rent your personal information to third parties",
        "We may share information in response to legal requests or to protect our rights",
        "We may share aggregated, non-personally identifiable information publicly"
      ]
    },
    {
      title: "Data Security",
      icon: "shield-alt",
      content: [
        "We implement appropriate security measures to protect your personal information",
        "All data transmission is encrypted using industry-standard protocols",
        "We regularly review and update our security practices"
      ]
    },
    {
      title: "Your Rights",
      icon: "user-check",
      content: [
        "You have the right to access, update, or delete your personal information",
        "You can opt-out of certain communications from us",
        "You may request a copy of your data or account deletion at any time"
      ]
    }
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.primary + '10', borderColor: colors.primary + '30' }]}>
          <View style={[styles.headerIcon, { backgroundColor: colors.primary + '20' }]}>
            <FontAwesome5 name="shield-alt" size={24} color={colors.primary} />
          </View>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Privacy Policy</Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
            Last updated: December 2024
          </Text>
        </View>

        {/* Introduction */}
        <View style={[styles.introCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.introText, { color: colors.textSecondary }]}>
            At SimpleAI Technologies, we respect your privacy and are committed to protecting your personal data. 
            This privacy policy explains how we collect, use, and safeguard your information when you use our mobile application.
          </Text>
        </View>

        {/* Sections */}
        {sections.map((section, index) => (
          <View key={index} style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionIcon, { backgroundColor: colors.accent + '20' }]}>
                <FontAwesome5 name={section.icon as any} size={16} color={colors.accent} />
              </View>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>{section.title}</Text>
            </View>
            {section.content.map((item, itemIndex) => (
              <View key={itemIndex} style={styles.contentItem}>
                <View style={[styles.bullet, { backgroundColor: colors.textSecondary }]} />
                <Text style={[styles.contentText, { color: colors.textSecondary }]}>{item}</Text>
              </View>
            ))}
          </View>
        ))}

        {/* Contact Information */}
        <View style={[styles.contactSection, { backgroundColor: colors.info + '10', borderColor: colors.info + '30' }]}>
          <View style={[styles.contactIcon, { backgroundColor: colors.info + '20' }]}>
            <FontAwesome5 name="envelope" size={20} color={colors.info} />
          </View>
          <Text style={[styles.contactTitle, { color: colors.text }]}>Questions About Privacy?</Text>
          <Text style={[styles.contactText, { color: colors.textSecondary }]}>
            If you have any questions about this Privacy Policy, please contact us at:
          </Text>
          <Text style={[styles.contactEmail, { color: colors.info }]}>privacy@simpleai.com</Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            This privacy policy is effective as of December 2024 and will remain in effect except with respect to any changes in its provisions in the future.
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
  header: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  headerIcon: {
    width: 50,
    height: 50,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 6,
  },
  headerSubtitle: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  introCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 20,
  },
  introText: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
  section: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  contentItem: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingLeft: 8,
  },
  bullet: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 8,
    marginRight: 12,
  },
  contentText: {
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  contactSection: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  contactIcon: {
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
    marginBottom: 8,
  },
  contactEmail: {
    fontSize: 15,
    fontWeight: '600',
  },
  footer: {
    paddingTop: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    opacity: 0.8,
  },
}); 