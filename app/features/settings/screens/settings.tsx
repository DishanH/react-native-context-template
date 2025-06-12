import { FontAwesome5 } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import ThemeToggle from '../../../../src/shared/components/ui/ThemeToggle';
import PageWithAnimatedHeader from '../../../../src/shared/components/layout/PageWithAnimatedHeader';
import { useTheme, useAuth, useHeader } from '../../../../contexts';
import { feedback } from '../../../../lib/feedback';

function SettingsContent() {
  const { colors } = useTheme();
  const { signOut, user } = useAuth();
  const { headerHeight, handleScroll } = useHeader();

  const handleLogout = () => {
    feedback.buttonPress();
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => feedback.buttonPress(),
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => {
            feedback.info('Signing Out', 'See you soon!');
            signOut();
          },
        },
      ]
    );
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={[styles.contentContainer, { paddingTop: headerHeight + 20 }]}
      onScroll={handleScroll}
      scrollEventThrottle={16}
      showsVerticalScrollIndicator={false}
    >
      {/* Profile Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Profile</Text>
        
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <TouchableOpacity 
            style={styles.optionItem}
            onPress={() => {
              feedback.navigate();
              router.push('/edit-profile' as any);
            }}
          >
            <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
              <FontAwesome5 name="user-edit" size={14} color={colors.primary} />
            </View>
            <View style={styles.optionContent}>
              <Text style={[styles.optionText, { color: colors.text }]}>Edit Profile</Text>
              <Text style={[styles.optionSubtext, { color: colors.textSecondary }]}>
                {user?.name || 'Update your personal information'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Appearance Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Appearance</Text>
        
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.optionHeader}>
            <View style={[styles.iconContainer, { backgroundColor: colors.accent + '20' }]}>
              <FontAwesome5 name="palette" size={14} color={colors.accent} />
            </View>
            <Text style={[styles.optionTitle, { color: colors.text }]}>Theme</Text>
          </View>
          <View style={styles.themeToggleContainer}>
            <ThemeToggle />
          </View>
        </View>
      </View>



      {/* App Preferences Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>App Preferences</Text>
        
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <TouchableOpacity 
            style={styles.optionItem}
            onPress={() => {
              feedback.navigate();
              router.push('/storage-data' as any);
            }}
          >
            <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
              <FontAwesome5 name="download" size={14} color={colors.primary} />
            </View>
            <View style={styles.optionContent}>
              <Text style={[styles.optionText, { color: colors.text }]}>Storage & Data</Text>
              <Text style={[styles.optionSubtext, { color: colors.textSecondary }]}>
                Manage app data and storage
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Support Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Support</Text>
        
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <TouchableOpacity 
            style={styles.optionItem}
            onPress={() => {
              feedback.navigate();
              router.push('/help-faq' as any);
            }}
          >
            <View style={[styles.iconContainer, { backgroundColor: colors.info + '20' }]}>
              <FontAwesome5 name="question-circle" size={14} color={colors.info} />
            </View>
            <View style={styles.optionContent}>
              <Text style={[styles.optionText, { color: colors.text }]}>Help & FAQ</Text>
              <Text style={[styles.optionSubtext, { color: colors.textSecondary }]}>
                Get answers to common questions
              </Text>
            </View>
          </TouchableOpacity>
          
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          
          <TouchableOpacity 
            style={styles.optionItem}
            onPress={() => {
              feedback.navigate();
              router.push('/about' as any);
            }}
          >
            <View style={[styles.iconContainer, { backgroundColor: colors.success + '20' }]}>
              <FontAwesome5 name="info-circle" size={14} color={colors.success} />
            </View>
            <View style={styles.optionContent}>
              <Text style={[styles.optionText, { color: colors.text }]}>About App</Text>
              <Text style={[styles.optionSubtext, { color: colors.textSecondary }]}>
                Version, team, and app information
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Logout Section - Moved to Bottom */}
      <View style={[styles.section, styles.logoutSection]}>
        <TouchableOpacity 
          style={[styles.logoutCard, { backgroundColor: colors.error + '10', borderColor: colors.error + '30' }]}
          onPress={handleLogout}
        >
          <View style={[styles.iconContainer, { backgroundColor: colors.error + '20' }]}>
            <FontAwesome5 name="sign-out-alt" size={14} color={colors.error} />
          </View>
          <Text style={[styles.logoutText, { color: colors.error }]}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

export default function SettingsScreen() {
  return (
    <PageWithAnimatedHeader title="Settings">
      <SettingsContent />
    </PageWithAnimatedHeader>
  );
}

const styles = StyleSheet.create({
  container: {
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
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 12,
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
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
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
  themeToggleContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  divider: {
    height: 1,
    marginLeft: 72,
    marginRight: 16,
  },
  logoutSection: {
    marginTop: 20,
    marginBottom: 0,
  },
  logoutCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    minHeight: 56,
    ...(Platform.OS === 'ios' ? {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
    } : {
      elevation: 2,
    }),
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
}); 