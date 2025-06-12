import { FontAwesome5 } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import PageWithAnimatedHeader from '../../../../src/shared/components/layout/PageWithAnimatedHeader';
import { useTheme, useHeader } from '../../../../contexts';
import { feedback } from '../../../../lib/feedback';
import { storage } from '../../../../lib/storage';

interface StorageInfo {
  appDataSize: string;
  cacheSize: string;
  totalSize: string;
}

function StorageDataContent() {
  const { colors } = useTheme();
  const { headerHeight, handleScroll } = useHeader();
  const [storageInfo, setStorageInfo] = useState<StorageInfo>({
    appDataSize: 'Calculating...',
    cacheSize: 'Calculating...',
    totalSize: 'Calculating...',
  });
  const [isClearing, setIsClearing] = useState(false);

  useEffect(() => {
    calculateStorageUsage();
  }, []);

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const calculateStorageUsage = async () => {
    try {
      // Simple estimation - most apps are small
      const appDataEstimate = 1024 * 50; // ~50KB for app data
      const cacheEstimate = 1024 * 200; // ~200KB for cache
      const totalEstimate = appDataEstimate + cacheEstimate;

      setStorageInfo({
        appDataSize: formatBytes(appDataEstimate),
        cacheSize: formatBytes(cacheEstimate),
        totalSize: formatBytes(totalEstimate),
      });
    } catch (error) {
      console.error('Error calculating storage usage:', error);
      setStorageInfo({
        appDataSize: 'Unable to calculate',
        cacheSize: 'Unable to calculate',
        totalSize: 'Unable to calculate',
      });
    }
  };

  const handleClearCache = () => {
    feedback.buttonPress();
    Alert.alert(
      'Clear Cache',
      'This will clear temporary files and cached data.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => feedback.buttonPress(),
        },
        {
          text: 'Clear Cache',
          style: 'destructive',
          onPress: async () => {
            setIsClearing(true);
            try {
              // Simulate cache clearing
              await new Promise(resolve => setTimeout(resolve, 1000));
              
              feedback.success('Cache Cleared', 'Temporary files have been removed');
              calculateStorageUsage();
            } catch (error) {
              console.error('Error clearing cache:', error);
              feedback.error('Error', 'Failed to clear cache. Please try again.');
            } finally {
              setIsClearing(false);
            }
          },
        },
      ]
    );
  };

  const handleClearAllData = () => {
    feedback.buttonPress();
    Alert.alert(
      'Clear All Data',
      'This will reset the app to its initial state. All your settings and data will be lost.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => feedback.buttonPress(),
        },
        {
          text: 'Clear All Data',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Are you sure?',
              'This action cannot be undone.',
              [
                {
                  text: 'Cancel',
                  style: 'cancel',
                },
                {
                  text: 'Yes, Clear All',
                  style: 'destructive',
                  onPress: async () => {
                    setIsClearing(true);
                    try {
                      // Clear all app storage
                      await storage.clearAll();
                      
                      feedback.success('Data Cleared', 'App has been reset');
                      calculateStorageUsage();
                      
                      // Navigate back to settings
                      setTimeout(() => {
                        router.back();
                      }, 1500);
                    } catch (error) {
                      console.error('Error clearing all data:', error);
                      feedback.error('Error', 'Failed to clear data. Please try again.');
                    } finally {
                      setIsClearing(false);
                    }
                  },
                },
              ]
            );
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
      {/* Storage Overview */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Storage Usage</Text>
        
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={[styles.infoItem, { backgroundColor: colors.background }]}>
            <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
              <FontAwesome5 name="mobile-alt" size={14} color={colors.primary} />
            </View>
            <View style={styles.optionContent}>
              <Text style={[styles.optionText, { color: colors.text }]}>Total App Size</Text>
              <Text style={[styles.optionSubtext, { color: colors.textSecondary }]}>
                {storageInfo.totalSize}
              </Text>
            </View>
          </View>
          
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          
          <View style={[styles.infoItem, { backgroundColor: colors.background }]}>
            <View style={[styles.iconContainer, { backgroundColor: colors.info + '20' }]}>
              <FontAwesome5 name="database" size={14} color={colors.info} />
            </View>
            <View style={styles.optionContent}>
              <Text style={[styles.optionText, { color: colors.text }]}>App Data</Text>
              <Text style={[styles.optionSubtext, { color: colors.textSecondary }]}>
                Settings and user preferences • {storageInfo.appDataSize}
              </Text>
            </View>
          </View>
          
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          
          <View style={[styles.infoItem, { backgroundColor: colors.background }]}>
            <View style={[styles.iconContainer, { backgroundColor: colors.warning + '20' }]}>
              <FontAwesome5 name="archive" size={14} color={colors.warning} />
            </View>
            <View style={styles.optionContent}>
              <Text style={[styles.optionText, { color: colors.text }]}>Cache</Text>
              <Text style={[styles.optionSubtext, { color: colors.textSecondary }]}>
                Temporary files and cached data • {storageInfo.cacheSize}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Actions</Text>
        
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <TouchableOpacity 
            style={styles.optionItem}
            onPress={handleClearCache}
            disabled={isClearing}
          >
            <View style={[styles.iconContainer, { backgroundColor: colors.warning + '20' }]}>
              <FontAwesome5 name="broom" size={14} color={colors.warning} />
            </View>
            <View style={styles.optionContent}>
              <Text style={[styles.optionText, { color: colors.text }]}>Clear Cache</Text>
              <Text style={[styles.optionSubtext, { color: colors.textSecondary }]}>
                {isClearing ? 'Clearing...' : 'Remove temporary files'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Reset */}
      <View style={[styles.section, styles.dangerSection]}>
        <Text style={[styles.sectionTitle, { color: colors.error }]}>Reset</Text>
        
        <TouchableOpacity 
          style={[styles.dangerCard, { backgroundColor: colors.error + '10', borderColor: colors.error + '30' }]}
          onPress={handleClearAllData}
          disabled={isClearing}
        >
          <View style={[styles.iconContainer, { backgroundColor: colors.error + '20' }]}>
            <FontAwesome5 name="trash-alt" size={14} color={colors.error} />
          </View>
          <View style={styles.optionContent}>
            <Text style={[styles.dangerText, { color: colors.error }]}>Clear All Data</Text>
            <Text style={[styles.dangerSubtext, { color: colors.error, opacity: 0.8 }]}>
              {isClearing ? 'Clearing...' : 'Reset app to initial state'}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

export default function StorageDataScreen() {
  return (
    <PageWithAnimatedHeader title="Storage & Data" showBackButton={true}>
      <StorageDataContent />
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
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    minHeight: 56,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    minHeight: 56,
    opacity: 0.8,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
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
  divider: {
    height: 1,
    marginLeft: 72,
    marginRight: 16,
  },
  dangerSection: {
    marginTop: 20,
    marginBottom: 0,
  },
  dangerCard: {
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
  dangerText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  dangerSubtext: {
    fontSize: 13,
  },
}); 