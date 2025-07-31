import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '../contexts';

const SupabaseSetupScreen = () => {
  const { colors } = useTheme();

  const setupSteps = [
    {
      title: 'Create Supabase Project',
      description: 'Go to supabase.com and create a new project',
      icon: 'globe-outline',
    },
    {
      title: 'Get API Keys',
      description: 'Copy your project URL and anon key from Settings > API',
      icon: 'key-outline',
    },
    {
      title: 'Update Environment',
      description: 'Create .env file and add your Supabase credentials',
      icon: 'document-text-outline',
    },
    {
      title: 'Setup Google OAuth',
      description: 'Configure Google OAuth in Google Cloud Console and Supabase',
      icon: 'logo-google',
    },
    {
      title: 'Test Authentication',
      description: 'Try signing in with Google or email/password',
      icon: 'checkmark-circle-outline',
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.text }]}>
            Supabase Setup
          </Text>
        </View>

        {/* Instructions */}
        <View style={styles.instructions}>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Follow these steps to configure Supabase authentication:
          </Text>

          {setupSteps.map((step, index) => (
            <View 
              key={index}
              style={[
                styles.stepCard,
                { 
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                }
              ]}
            >
              <View style={styles.stepHeader}>
                <View style={[styles.stepIcon, { backgroundColor: colors.primary + '20' }]}>
                  <Ionicons name={step.icon as any} size={24} color={colors.primary} />
                </View>
                <View style={styles.stepContent}>
                  <Text style={[styles.stepTitle, { color: colors.text }]}>
                    {index + 1}. {step.title}
                  </Text>
                  <Text style={[styles.stepDescription, { color: colors.textSecondary }]}>
                    {step.description}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              { 
                backgroundColor: colors.surface,
                borderColor: colors.border,
                borderWidth: 1,
              }
            ]}
            onPress={() => router.push('/auth' as any)}
          >
            <Ionicons name="log-in-outline" size={20} color={colors.text} />
            <Text style={[styles.actionButtonText, { color: colors.text }]}>
              Test Authentication
            </Text>
          </TouchableOpacity>
        </View>

        {/* Links */}
        <View style={styles.links}>
          <Text style={[styles.linksTitle, { color: colors.text }]}>
            Helpful Links:
          </Text>
          <Text style={[styles.link, { color: colors.primary }]}>
            • Supabase Documentation
          </Text>
          <Text style={[styles.link, { color: colors.primary }]}>
            • Google Cloud Console
          </Text>
          <Text style={[styles.link, { color: colors.primary }]}>
            • Complete Setup Guide (SUPABASE_SETUP.md)
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    marginRight: 16,
    padding: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  instructions: {
    marginBottom: 32,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
    lineHeight: 22,
  },
  stepCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  actions: {
    gap: 12,
    marginBottom: 32,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  links: {
    marginBottom: 32,
  },
  linksTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  link: {
    fontSize: 14,
    marginBottom: 8,
    textDecorationLine: 'underline',
  },
});

export default SupabaseSetupScreen;