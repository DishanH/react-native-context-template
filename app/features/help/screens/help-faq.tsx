import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import PageWithAnimatedHeader from '../../../../src/shared/components/layout/PageWithAnimatedHeader';
import { useTheme, useHeader } from '../../../../contexts';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'general' | 'account' | 'technical' | 'privacy';
}

const faqData: FAQItem[] = [
  {
    id: '1',
    question: 'How do I change between light and dark mode?',
    answer: 'Go to Settings > Appearance and toggle the theme switch.',
    category: 'general'
  },
  {
    id: '2',
    question: 'How do I edit my profile?',
    answer: 'Navigate to Settings > Edit Profile to update your information.',
    category: 'account'
  },
  {
    id: '3',
    question: 'Is my data safe?',
    answer: 'Yes, all data is stored securely on your device and encrypted.',
    category: 'privacy'
  },
  {
    id: '4',
    question: 'The app is running slowly, what can I do?',
    answer: 'Try going to Settings > Storage & Data > Clear Cache to free up space.',
    category: 'technical'
  },
  {
    id: '5',
    question: 'How do I sign out?',
    answer: 'Go to Settings and tap "Sign Out" at the bottom.',
    category: 'account'
  },
  {
    id: '6',
    question: 'How do I reset the app?',
    answer: 'Go to Settings > Storage & Data > Clear All Data to reset everything.',
    category: 'technical'
  }
];

const categoryIcons = {
  general: 'info-circle',
  account: 'user',
  technical: 'cog',
  privacy: 'shield-alt'
};

// Category colors will be theme-based now

function HelpFAQContent() {
  const { colors } = useTheme();
  const { headerHeight, handleScroll } = useHeader();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Theme-based category colors
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'general': return colors.primary;
      case 'account': return colors.success;
      case 'technical': return colors.warning;
      case 'privacy': return colors.error;
      default: return colors.primary;
    }
  };

  const toggleExpanded = (id: string) => {
    setExpandedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const filteredFAQs = selectedCategory === 'all' 
    ? faqData 
    : faqData.filter(item => item.category === selectedCategory);

  const categories = [
    { id: 'all', label: 'All', icon: 'list' },
    { id: 'general', label: 'General', icon: 'info-circle' },
    { id: 'account', label: 'Account', icon: 'user' },
    { id: 'technical', label: 'Technical', icon: 'cog' }
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
        {/* Welcome Section */}
        <View style={[styles.welcomeCard, { backgroundColor: colors.primary + '15', borderColor: colors.primary + '30' }]}>
          <FontAwesome5 name="life-ring" size={28} color={colors.primary} />
          <Text style={[styles.welcomeTitle, { color: colors.text }]}>Need Help?</Text>
          <Text style={[styles.welcomeText, { color: colors.textSecondary }]}>
            Find quick answers to common questions
          </Text>
        </View>

        {/* Category Filter */}
        <View style={styles.categorySection}>
          <View style={styles.categoryGrid}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryButton,
                  {
                    backgroundColor: selectedCategory === category.id ? colors.primary + '15' : colors.background,
                    borderColor: selectedCategory === category.id ? colors.primary + '30' : colors.border,
                  }
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <FontAwesome5 
                  name={category.icon as any} 
                  size={14} 
                  color={selectedCategory === category.id ? colors.primary : colors.textSecondary} 
                />
                <Text style={[
                  styles.categoryText,
                  {
                    color: selectedCategory === category.id ? colors.primary : colors.textSecondary
                  }
                ]}>
                  {category.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* FAQ Items */}
        <View style={styles.faqSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Questions & Answers
          </Text>
          
          {filteredFAQs.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.faqItem, { backgroundColor: colors.surface, borderColor: colors.border }]}
              onPress={() => toggleExpanded(item.id)}
            >
              <View style={styles.faqHeader}>
                <View style={styles.faqTitleContainer}>
                  <Text style={[styles.faqQuestion, { color: colors.text }]}>
                    {item.question}
                  </Text>
                </View>
                <Ionicons 
                  name={expandedItems.includes(item.id) ? "chevron-up" : "chevron-down"} 
                  size={18} 
                  color={colors.textSecondary} 
                />
              </View>
              
              {expandedItems.includes(item.id) && (
                <View style={styles.faqAnswer}>
                  <Text style={[styles.answerText, { color: colors.textSecondary }]}>
                    {item.answer}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>


      </ScrollView>
    </View>
  );
}

export default function HelpFAQScreen() {
  return (
    <PageWithAnimatedHeader title="Help & FAQ" showBackButton={true}>
      <HelpFAQContent />
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
  welcomeCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    alignItems: 'center',
    marginBottom: 24,
  },
  welcomeTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  categorySection: {
    marginBottom: 24,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '48%',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '500',
    marginLeft: 6,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    letterSpacing: 0.3,
  },
  faqSection: {
    marginBottom: 24,
  },
  faqItem: {
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
    overflow: 'hidden',
    ...(Platform.OS === 'ios' ? {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
    } : {
      elevation: 2,
    }),
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    minHeight: 56,
  },
  faqTitleContainer: {
    flex: 1,
    marginRight: 12,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  faqAnswer: {
    paddingHorizontal: 14,
    paddingBottom: 14,
    paddingTop: 0,
  },
  answerText: {
    fontSize: 13,
    opacity: 0.8,
    lineHeight: 18,
  },

}); 