import * as React from "react";
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { useTheme, useHeader } from '../../contexts';
import SubscriptionStatus from '../features/subscription/components/SubscriptionStatus';

export default function DashboardTabScreen() {
  const { colors } = useTheme();
  const { headerHeight, handleScroll } = useHeader();

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={[styles.content, { paddingTop: headerHeight + 20 }]}
      onScroll={handleScroll}
      scrollEventThrottle={16}
      showsVerticalScrollIndicator={false}
    >
      {/* Subscription Status Card */}
      <SubscriptionStatus />
      
      {/* Dashboard Content */}
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>Dashboard</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Your main dashboard content goes here. Scroll up and down to see the header blur effect.
        </Text>
      </View>

      {/* Additional content to demonstrate scrolling and blur effect */}
      {Array.from({ length: 8 }, (_, index) => (
        <View key={index} style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>
            Sample Card {index + 1}
          </Text>
          <Text style={[styles.cardContent, { color: colors.textSecondary }]}>
            This is sample content to demonstrate the header blur effect. 
            As you scroll, the header will gradually blur, creating a beautiful depth effect.
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  cardContent: {
    fontSize: 14,
    lineHeight: 20,
  },
}); 