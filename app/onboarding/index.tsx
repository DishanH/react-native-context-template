import { FontAwesome5 } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { Dimensions, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../../contexts';
import { storage } from '../../lib/storage';

// Define custom colors for onboarding screen
const ONBOARDING_COLORS = {
  primary: '#52616B',
  secondary: '#1E2022',
  background: '#FFFFFF',
  surface: '#F0F5F9',
  accent: '#C9D6DF',
  text: '#1E2022',
  textSecondary: '#52616B',
  border: '#C9D6DF',
};

// Simple onboarding screen without storage dependencies
export default function OnboardingScreen() {
  const { colors: themeColors, setTheme } = useTheme();
  const [currentPage, setCurrentPage] = React.useState(0);
  
  // Force light theme for onboarding screen
  useEffect(() => {
    setTheme('light');
  }, []);
  
  const handleDone = async () => {
    try {
      // Mark onboarding as complete in storage
      await storage.setOnboardingStatus(true);
      // Navigate to the auth sign-in page
      router.replace('/auth/sign-in' as any);
    } catch (error) {
      console.error('Error saving onboarding status:', error);
      // Still navigate even if storage fails
      router.replace('/auth/sign-in' as any);
    }
  };

  const pages = [
    {
      icon: "mobile-alt",
      title: "Welcome to the App",
      subtitle: "A modern, intuitive mobile experience designed just for you"
    },
    {
      icon: "layer-group",
      title: "Powerful Features",
      subtitle: "Access all the tools you need in one convenient place"
    },
    {
      icon: "palette",
      title: "Personalize Your Experience",
      subtitle: "Customize the app to match your preferences and style"
    }
  ];

  const nextPage = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      handleDone();
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: ONBOARDING_COLORS.background }]}>
      <StatusBar style="dark" backgroundColor={ONBOARDING_COLORS.background} />
      
      {/* Content area with image and text */}
      <View style={styles.contentWrapper}>
        {/* Image container with border */}
        <View style={styles.imageWrapper}>
          <View style={[styles.imageContainer, { 
            backgroundColor: ONBOARDING_COLORS.surface,
            borderColor: ONBOARDING_COLORS.border
          }]}>
            <FontAwesome5 
              name={pages[currentPage].icon} 
              size={80} 
              color={ONBOARDING_COLORS.primary} 
            />
          </View>
        </View>
        
        <View style={styles.contentContainer}>
          <View style={styles.titleContainer}>
            <Text style={[styles.title, { color: ONBOARDING_COLORS.text }]}>
              {pages[currentPage].title}
            </Text>
          </View>
          
          <View style={styles.subtitleContainer}>
            <Text style={[styles.subtitle, { color: ONBOARDING_COLORS.textSecondary }]}>
              {pages[currentPage].subtitle}
            </Text>
          </View>
        
          <View style={styles.dotContainer}>
            {pages.map((_, index) => (
              <View 
                key={index}
                style={[
                  styles.dot, 
                  { backgroundColor: index === currentPage ? ONBOARDING_COLORS.primary : ONBOARDING_COLORS.border }
                ]}
              />
            ))}
          </View>
        </View>
      </View>
      
      {/* Navigation buttons */}
      <View style={styles.buttonContainer}>
        <View style={styles.buttonsRow}>
          {currentPage === 0 ? (
            <TouchableOpacity 
              style={[styles.skipButton]} 
              onPress={handleDone}
            >
              <Text style={[styles.skipText, { color: ONBOARDING_COLORS.primary }]}>Skip</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={[styles.button, { borderColor: ONBOARDING_COLORS.border }]} 
              onPress={prevPage}
            >
              <Text style={[styles.buttonText, { color: ONBOARDING_COLORS.primary }]}>Back</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            style={[
              styles.button, 
              { 
                backgroundColor: ONBOARDING_COLORS.primary,
                paddingHorizontal: currentPage === pages.length - 1 ? 35 : 30
              }
            ]} 
            onPress={currentPage === pages.length - 1 ? handleDone : nextPage}
          >
            <Text style={[styles.buttonText, { color: '#FFFFFF' }]}>
              {currentPage === pages.length - 1 ? 'Get Started' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const { width, height } = Dimensions.get('window');
const imageSize = Math.min(width, height * 0.4);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 30,
  },
  imageWrapper: {
    paddingHorizontal: 15,
    paddingVertical: 15,
    width: '100%',
    alignItems: 'center',
  },
  imageContainer: {
    width: width - 30,
    height: imageSize,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    ...Platform.select({
      web: {
        boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.05)',
      },
      android: {
        elevation: 3,
      },
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
      },
    }),
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingTop: 30,
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
  },
  titleContainer: {
    minHeight: 42,
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitleContainer: {
    minHeight: 72,
    justifyContent: 'center',
    marginBottom: 32,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 600,
  },
  dotContainer: {
    flexDirection: 'row',
    marginTop: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 20,
    width: '100%',
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 24,
    borderWidth: 1,
    minWidth: 120,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      web: {
        boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
      },
      android: {
        elevation: 2,
      },
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
    }),
  },
  skipButton: {
    padding: 10,
    minWidth: 120,
    justifyContent: 'center',
  },
  emptyButton: {
    minWidth: 120,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  skipText: {
    fontSize: 16,
    fontWeight: '500',
  },
}); 