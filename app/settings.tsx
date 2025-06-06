import { FontAwesome5 } from '@expo/vector-icons';
import React from 'react';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ThemeToggle from './components/ThemeToggle';
import { useTheme } from './theme/ThemeContext';
import { useAuth } from './utils/authContext';

export default function SettingsScreen() {
  const { colors } = useTheme();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Appearance Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Appearance</Text>
        <Text style={[styles.sectionDescription, { color: colors.textSecondary }]}>
          Customize how the app looks and feels
        </Text>
        
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.optionHeader}>
            <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
              <FontAwesome5 name="palette" size={16} color={colors.primary} />
            </View>
            <Text style={[styles.optionTitle, { color: colors.text }]}>Theme</Text>
          </View>
          <ThemeToggle />
        </View>
      </View>

      {/* Account Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Account</Text>
        <Text style={[styles.sectionDescription, { color: colors.textSecondary }]}>
          Manage your profile and account settings
        </Text>
        
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.optionItem}>
            <View style={[styles.iconContainer, { backgroundColor: colors.info + '20' }]}>
              <FontAwesome5 name="user" size={16} color={colors.info} />
            </View>
            <Text style={[styles.optionText, { color: colors.text }]}>Profile</Text>
            <FontAwesome5 name="chevron-right" size={14} color={colors.textSecondary} style={styles.chevron} />
          </View>
          
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          
          <View style={styles.optionItem}>
            <View style={[styles.iconContainer, { backgroundColor: colors.warning + '20' }]}>
              <FontAwesome5 name="bell" size={16} color={colors.warning} />
            </View>
            <Text style={[styles.optionText, { color: colors.text }]}>Notifications</Text>
            <FontAwesome5 name="chevron-right" size={14} color={colors.textSecondary} style={styles.chevron} />
          </View>
          
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          
          <View style={styles.optionItem}>
            <View style={[styles.iconContainer, { backgroundColor: colors.secondary + '20' }]}>
              <FontAwesome5 name="lock" size={16} color={colors.secondary} />
            </View>
            <Text style={[styles.optionText, { color: colors.text }]}>Privacy & Security</Text>
            <FontAwesome5 name="chevron-right" size={14} color={colors.textSecondary} style={styles.chevron} />
          </View>
          
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          
          <TouchableOpacity 
            style={styles.optionItem}
            onPress={handleLogout}
          >
            <View style={[styles.iconContainer, { backgroundColor: colors.error + '20' }]}>
              <FontAwesome5 name="sign-out-alt" size={16} color={colors.error} />
            </View>
            <Text style={[styles.optionText, { color: colors.error }]}>Logout</Text>
            <FontAwesome5 name="chevron-right" size={14} color={colors.textSecondary} style={styles.chevron} />
          </TouchableOpacity>
        </View>
      </View>

      {/* About Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>About</Text>
        <Text style={[styles.sectionDescription, { color: colors.textSecondary }]}>
          App information and support resources
        </Text>
        
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.optionItem}>
            <View style={[styles.iconContainer, { backgroundColor: colors.success + '20' }]}>
              <FontAwesome5 name="info-circle" size={16} color={colors.success} />
            </View>
            <Text style={[styles.optionText, { color: colors.text }]}>App Information</Text>
            <FontAwesome5 name="chevron-right" size={14} color={colors.textSecondary} style={styles.chevron} />
          </View>
          
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          
          <View style={styles.optionItem}>
            <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
              <FontAwesome5 name="question-circle" size={16} color={colors.primary} />
            </View>
            <Text style={[styles.optionText, { color: colors.text }]}>Help & Support</Text>
            <FontAwesome5 name="chevron-right" size={14} color={colors.textSecondary} style={styles.chevron} />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 6,
  },
  sectionDescription: {
    fontSize: 13,
    marginBottom: 16,
    opacity: 0.8,
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    ...(Platform.OS === 'ios' ? {
      boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)'
    } : {
      elevation: 2,
    }),
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 0,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  optionText: {
    fontSize: 16,
    flex: 1,
  },
  chevron: {
    marginLeft: 'auto',
  },
  divider: {
    height: 1,
    marginHorizontal: 16,
  },
}); 