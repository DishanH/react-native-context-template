import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from './theme/ThemeContext';

export default function HomeScreen() {
  const navigation = useNavigation();
  const { colors } = useTheme();

  const goToDashboard = () => {
    navigation.navigate('tabs' as never);
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Welcome</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Your complete app solution
        </Text>
      </View>

      <View style={styles.featuresContainer}>
        {/* Feature Card 1 */}
        <View style={[styles.featureCard, { backgroundColor: colors.surface }]}>
          <View style={[styles.iconContainer, { backgroundColor: colors.primary + '15' }]}>
            <FontAwesome5 name="chart-line" size={24} color={colors.primary} />
          </View>
          <Text style={[styles.featureTitle, { color: colors.text }]}>Dashboard</Text>
          <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
            View your stats and track your progress
          </Text>
        </View>

        {/* Feature Card 2 */}
        <View style={[styles.featureCard, { backgroundColor: colors.surface }]}>
          <View style={[styles.iconContainer, { backgroundColor: colors.secondary + '15' }]}>
            <FontAwesome5 name="users" size={24} color={colors.secondary} />
          </View>
          <Text style={[styles.featureTitle, { color: colors.text }]}>Groups</Text>
          <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
            Manage your teams and collaborations
          </Text>
        </View>

        {/* Feature Card 3 */}
        <View style={[styles.featureCard, { backgroundColor: colors.surface }]}>
          <View style={[styles.iconContainer, { backgroundColor: colors.success + '15' }]}>
            <FontAwesome5 name="history" size={24} color={colors.success} />
          </View>
          <Text style={[styles.featureTitle, { color: colors.text }]}>Activity</Text>
          <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
            Track your recent activities and updates
          </Text>
        </View>

        {/* Feature Card 4 */}
        <View style={[styles.featureCard, { backgroundColor: colors.surface }]}>
          <View style={[styles.iconContainer, { backgroundColor: colors.info + '15' }]}>
            <FontAwesome5 name="cog" size={24} color={colors.info} />
          </View>
          <Text style={[styles.featureTitle, { color: colors.text }]}>Settings</Text>
          <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
            Customize your app experience
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.getStartedButton, { backgroundColor: colors.primary }]}
        onPress={goToDashboard}
      >
        <Text style={styles.getStartedButtonText}>Get Started</Text>
        <FontAwesome5 name="arrow-right" size={16} color="#FFFFFF" style={styles.buttonIcon} />
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  header: {
    marginBottom: 30,
    marginTop: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 24,
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  featureCard: {
    width: '48%',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    ...(Platform.OS === 'ios' ? {
      boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)'
    } : {
      elevation: 2,
    }),
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  getStartedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 10,
  },
  getStartedButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonIcon: {
    marginLeft: 8,
  },
}); 