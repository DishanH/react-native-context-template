import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useTheme } from '../../../../contexts';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'general' | 'account' | 'technical' | 'privacy';
}

const faqData: FAQItem[] = [
  {
    id: '1',
    question: 'How do I change my profile picture?',
    answer: 'Go to Settings > Edit Profile, then tap the camera icon on your profile picture to choose a new photo from your camera or photo library.',
    category: 'account'
  },
  {
    id: '2',
    question: 'How do I switch between light and dark mode?',
    answer: 'Navigate to Settings > Appearance and toggle the theme switch. The app will automatically switch between light and dark mode.',
    category: 'general'
  },
  {
    id: '3',
    question: 'Is my data secure?',
    answer: 'Yes, we use industry-standard encryption to protect your data. All information is stored securely and we never share your personal data with third parties.',
    category: 'privacy'
  },
  {
    id: '4',
    question: 'How do I change my password?',
    answer: 'Go to Settings > Privacy & Security > Change Password. You\'ll need to enter your current password and then create a new one.',
    category: 'account'
  },
  {
    id: '5',
    question: 'The app is running slowly, what should I do?',
    answer: 'Try closing and reopening the app. If the issue persists, restart your device. Make sure you have the latest version of the app installed.',
    category: 'technical'
  },
  {
    id: '6',
    question: 'How do I sign out of my account?',
    answer: 'Go to Settings and scroll to the bottom. Tap "Sign Out" and confirm your choice in the popup dialog.',
    category: 'account'
  },
  {
    id: '7',
    question: 'Can I use the app offline?',
    answer: 'Some features work offline, but most functionality requires an internet connection. We recommend using the app with a stable internet connection for the best experience.',
    category: 'technical'
  },
  {
    id: '8',
    question: 'How do I delete my account?',
    answer: 'Account deletion is permanent and cannot be undone. Contact our support team through the app or email support@simpleai.com to request account deletion.',
    category: 'privacy'
  }
];

const categoryIcons = {
  general: 'info-circle',
  account: 'user',
  technical: 'cog',
  privacy: 'shield-alt'
};

// Category colors will be theme-based now

export default function HelpFAQScreen() {
  const { colors } = useTheme();
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
    { id: 'technical', label: 'Technical', icon: 'cog' },
    { id: 'privacy', label: 'Privacy', icon: 'shield-alt' }
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Section */}
        <View style={[styles.welcomeCard, { backgroundColor: colors.primary + '15', borderColor: colors.primary + '30' }]}>
          <FontAwesome5 name="question-circle" size={24} color={colors.primary} />
          <Text style={[styles.welcomeTitle, { color: colors.text }]}>How can we help you?</Text>
          <Text style={[styles.welcomeText, { color: colors.textSecondary }]}>
            Find answers to common questions below, or visit About page to contact support.
          </Text>
        </View>

        {/* Category Filter */}
        <View style={styles.categorySection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Categories</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryContainer}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryButton,
                  {
                    backgroundColor: selectedCategory === category.id ? colors.primary : colors.surface,
                    borderColor: selectedCategory === category.id ? colors.primary : colors.border,
                  }
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <FontAwesome5 
                  name={category.icon as any} 
                  size={14} 
                  color={selectedCategory === category.id ? '#fff' : colors.textSecondary} 
                />
                <Text style={[
                  styles.categoryText,
                  {
                    color: selectedCategory === category.id ? '#fff' : colors.textSecondary
                  }
                ]}>
                  {category.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* FAQ Items */}
        <View style={styles.faqSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Frequently Asked Questions
          </Text>
          
          {filteredFAQs.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.faqItem, { backgroundColor: colors.surface, borderColor: colors.border }]}
              onPress={() => toggleExpanded(item.id)}
            >
              <View style={styles.faqHeader}>
                <View style={styles.faqTitleContainer}>
                  <FontAwesome5 
                    name={categoryIcons[item.category] as any} 
                    size={14} 
                    color={getCategoryColor(item.category)} 
                    style={styles.categoryIcon}
                  />
                  <Text style={[styles.faqQuestion, { color: colors.text }]}>
                    {item.question}
                  </Text>
                </View>
                <Ionicons 
                  name={expandedItems.includes(item.id) ? "chevron-up" : "chevron-down"} 
                  size={20} 
                  color={colors.textSecondary} 
                />
              </View>
              
              {expandedItems.includes(item.id) && (
                <View style={[styles.faqAnswer, { borderTopColor: colors.border }]}>
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  categoryContainer: {
    paddingRight: 20,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 12,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '500',
    marginLeft: 6,
  },
  faqSection: {
    marginBottom: 24,
  },
  faqItem: {
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    overflow: 'hidden',
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  faqTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  categoryIcon: {
    marginRight: 10,
  },
  faqQuestion: {
    fontSize: 15,
    fontWeight: '500',
    flex: 1,
  },
  faqAnswer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
  },
  answerText: {
    fontSize: 14,
    lineHeight: 20,
    paddingTop: 12,
  },

}); 