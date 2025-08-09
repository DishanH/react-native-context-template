import { FontAwesome5 } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { Image } from 'expo-image';
import PageWithAnimatedHeader from '../../../../src/shared/components/layout/PageWithAnimatedHeader';
import { useTheme, useHeader } from '../../../../contexts';
import { feedback } from '../../../../lib/feedback';
import { storage, StorageHelper, STORAGE_KEYS } from '../../../../lib/storage';
import { database } from '../../../../lib/database';

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
    if (bytes <= 0 || Number.isNaN(bytes)) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.min(sizes.length - 1, Math.floor(Math.log(bytes) / Math.log(k)));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const getDirectorySize = async (directoryUri?: string): Promise<number> => {
    try {
      if (!directoryUri) return 0;
      const entries = await FileSystem.readDirectoryAsync(directoryUri);
      let total = 0;
      for (const name of entries) {
        const child = directoryUri + name;
        const info = await FileSystem.getInfoAsync(child);
        if (info.exists) {
          if ((info as any).isDirectory) {
            total += await getDirectorySize(child + '/');
          } else if (info.size) {
            total += info.size;
          }
        }
      }
      return total;
    } catch {
      return 0;
    }
  };

  const getSecureStoreSize = async (): Promise<number> => {
    try {
      if (Platform.OS === 'web') {
        // localStorage total size
        let bytes = 0;
        try {
          for (let i = 0; i < (localStorage?.length || 0); i++) {
            const key = localStorage.key(i);
            if (!key) continue;
            const value = localStorage.getItem(key) ?? '';
            bytes += storage.getByteSize(key) + storage.getByteSize(value);
          }
        } catch {}
        return bytes;
      }

      const allKeysJson = await StorageHelper.getItem(STORAGE_KEYS.ALL_SECURE_STORE_KEYS);
      if (!allKeysJson) return 0;
      const keys: string[] = JSON.parse(allKeysJson);
      let total = 0;
      for (const key of keys) {
        const value = (await StorageHelper.getItem(key)) ?? '';
        total += storage.getByteSize(key) + storage.getByteSize(value);
      }
      return total;
    } catch {
      return 0;
    }
  };

  const calculateStorageUsage = async () => {
    try {
      const [secureBytes, cacheBytes, docsBytes] = await Promise.all([
        getSecureStoreSize(),
        getDirectorySize(FileSystem.cacheDirectory || undefined),
        getDirectorySize(FileSystem.documentDirectory || undefined),
      ]);

      const appDataBytes = secureBytes + docsBytes;
      const totalBytes = appDataBytes + cacheBytes;

      setStorageInfo({
        appDataSize: formatBytes(appDataBytes),
        cacheSize: formatBytes(cacheBytes),
        totalSize: formatBytes(totalBytes),
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

  const clearCacheFiles = async () => {
    try {
      // Clear expo-image caches
      try {
        await Image.clearDiskCache?.();
        Image.clearMemoryCache?.();
      } catch {}

      const cacheDir = FileSystem.cacheDirectory;
      if (!cacheDir) return;
      const items = await FileSystem.readDirectoryAsync(cacheDir);
      await Promise.all(
        items.map(async (name) => {
          const target = cacheDir + name;
          try {
            const info = await FileSystem.getInfoAsync(target);
            if (info.exists) {
              await FileSystem.deleteAsync(target, { idempotent: true });
            }
          } catch {}
        })
      );
    } catch (e) {
      console.error('Error clearing cache files:', e);
      throw e;
    }
  };

  const clearDocumentFiles = async () => {
    try {
      const docsDir = FileSystem.documentDirectory;
      if (!docsDir) return;
      const items = await FileSystem.readDirectoryAsync(docsDir);
      await Promise.all(
        items.map(async (name) => {
          const target = docsDir + name;
          try {
            const info = await FileSystem.getInfoAsync(target);
            if (info.exists) {
              await FileSystem.deleteAsync(target, { idempotent: true });
            }
          } catch {}
        })
      );
    } catch (e) {
      console.error('Error clearing document files:', e);
      throw e;
    }
  };

  const handleClearCache = () => {
    feedback.buttonPress();
    Alert.alert(
      'Clear Cache',
      'This will clear temporary files and cached media. Your saved data will remain intact.',
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
              await clearCacheFiles();
              feedback.success('Cache Cleared', 'Temporary files have been removed');
              await calculateStorageUsage();
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
      'This will sign you out and reset the app to its initial state. All app data and settings stored on this device will be removed.',
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
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Yes, Clear All',
                  style: 'destructive',
                  onPress: async () => {
                    setIsClearing(true);
                    try {
                      // Sign out and clear secure storage (sessions, user data, preferences)
                      await database.signOut();
                      await storage.clearAll();
                      // Clear app files (documents) and caches
                      await Promise.all([clearDocumentFiles(), clearCacheFiles()]);
                      feedback.success('Data Cleared', 'App has been reset');
                      await calculateStorageUsage();
                      setTimeout(() => {
                        router.back();
                      }, 1200);
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
              <Text style={[styles.optionSubtext, { color: colors.textSecondary }]}>{storageInfo.totalSize}              
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
              <Text style={[styles.optionSubtext, { color: colors.textSecondary }]}>Secure storage and saved files • {storageInfo.appDataSize}              
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
              <Text style={[styles.optionSubtext, { color: colors.textSecondary }]}>Temporary files and cached media • {storageInfo.cacheSize}              
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
              <Text style={[styles.optionSubtext, { color: colors.textSecondary }]}>{isClearing ? 'Clearing...' : 'Remove temporary files'}              
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
            <Text style={[styles.dangerSubtext, { color: colors.error, opacity: 0.8 }]}>{isClearing ? 'Clearing...' : 'Reset app to initial state'}            
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
    marginLeft: 50,
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