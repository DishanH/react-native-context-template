import { FontAwesome5 } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import PageWithAnimatedHeader from '../../../../src/shared/components/layout/PageWithAnimatedHeader';
import { useTheme, useHeader } from '../../../../contexts';
import { feedback } from '../../../../lib/feedback';

function TermsOfServiceContent() {
  const { colors } = useTheme();
  const { headerHeight, handleScroll } = useHeader();

  const sections = [
    {
      title: "Acceptance of Terms",
      icon: "handshake",
      content: [
        "By downloading, installing, or using the SimpleAI mobile application, you agree to be bound by these Terms of Service.",
        "If you do not agree to these terms, please do not use our application.",
        "We reserve the right to modify these terms at any time with notice to users."
      ]
    },
    {
      title: "Use of the Service",
      icon: "mobile-alt",
      content: [
        "You must be at least 13 years old to use this application",
        "You are responsible for maintaining the confidentiality of your account",
        "You agree not to use the service for any unlawful or prohibited activities",
        "We reserve the right to suspend or terminate accounts that violate these terms"
      ]
    },
    {
      title: "Subscription and Billing",
      icon: "credit-card",
      content: [
        "Subscription fees are billed in advance on a recurring basis",
        "Free trials may be offered, which automatically convert to paid subscriptions",
        "You can cancel your subscription at any time through your account settings",
        "Refunds are provided according to the app store's policies"
      ]
    },
    {
      title: "Intellectual Property",
      icon: "copyright",
      content: [
        "The app and its content are protected by copyright and other intellectual property laws",
        "You may not copy, modify, distribute, or reverse engineer any part of the application",
        "User-generated content remains your property, but you grant us a license to use it"
      ]
    },
    {
      title: "Limitation of Liability",
      icon: "exclamation-triangle",
      content: [
        "The service is provided 'as is' without warranties of any kind",
        "We are not liable for any indirect, incidental, or consequential damages",
        "Our total liability shall not exceed the amount paid by you for the service",
        "Some jurisdictions may not allow certain limitations, so these may not apply to you"
      ]
    },
    {
      title: "Termination",
      icon: "ban",
      content: [
        "You may terminate your account at any time by contacting us",
        "We may terminate or suspend your account for violations of these terms",
        "Upon termination, your right to use the service will cease immediately",
        "Certain provisions of these terms will survive termination"
      ]
    }
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
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.warning + '10', borderColor: colors.warning + '30' }]}>
          <View style={[styles.headerIcon, { backgroundColor: colors.warning + '20' }]}>
            <FontAwesome5 name="file-contract" size={24} color={colors.warning} />
          </View>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Terms of Service</Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
            Last updated: December 2024
          </Text>
        </View>

        {/* Introduction */}
        <View style={[styles.introCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.introText, { color: colors.textSecondary }]}>
            Welcome to SimpleAI! These Terms of Service govern your use of our mobile application and services. 
            Please read these terms carefully before using our app.
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

        {/* Important Notice */}
        <View style={[styles.noticeSection, { backgroundColor: colors.error + '10', borderColor: colors.error + '30' }]}>
          <View style={[styles.noticeIcon, { backgroundColor: colors.error + '20' }]}>
            <FontAwesome5 name="info-circle" size={20} color={colors.error} />
          </View>
          <Text style={[styles.noticeTitle, { color: colors.text }]}>Important Notice</Text>
          <Text style={[styles.noticeText, { color: colors.textSecondary }]}>
            These terms constitute a legally binding agreement. If you have questions about any of these terms, 
            please contact us before using the application.
          </Text>
        </View>

        {/* Contact Information */}
        <View style={[styles.contactSection, { backgroundColor: colors.info + '10', borderColor: colors.info + '30' }]}>
          <View style={[styles.contactIcon, { backgroundColor: colors.info + '20' }]}>
            <FontAwesome5 name="envelope" size={20} color={colors.info} />
          </View>
          <Text style={[styles.contactTitle, { color: colors.text }]}>Questions About Terms?</Text>
          <Text style={[styles.contactText, { color: colors.textSecondary }]}>
            If you have any questions about these Terms of Service, please contact us at:
          </Text>
          <Text style={[styles.contactEmail, { color: colors.info }]}>legal@simpleai.com</Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            By continuing to use SimpleAI, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

export default function TermsOfServiceScreen() {
  const { colors } = useTheme();
  
  const handleBackPress = () => {
    feedback.back();
    router.push('/about' as any);
  };

  const CustomBackToAbout = () => (
    <TouchableOpacity
      style={[
        styles.backButton,
        { 
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.border,
        },
      ]}
      onPress={handleBackPress}
    >
      <FontAwesome5 name="arrow-left" size={18} color={colors.primary} />
    </TouchableOpacity>
  );

  return (
    <PageWithAnimatedHeader 
      title="Terms of Service" 
      headerLeft={<CustomBackToAbout />}
    >
      <TermsOfServiceContent />
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
  noticeSection: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  noticeIcon: {
    width: 50,
    height: 50,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  noticeTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  noticeText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  contactSection: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    alignItems: 'center',
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
  backButton: {
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
}); 