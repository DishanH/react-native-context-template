import { FontAwesome5 } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import Button from '../../../../src/shared/components/ui/Button';
import PageWithAnimatedHeader from '../../../../src/shared/components/layout/PageWithAnimatedHeader';
import { useTheme, useAuth, useHeader } from '../../../../contexts';
import { feedback } from '../../../../lib/feedback';

function EditProfileContent() {
  const { colors } = useTheme();
  const { user, updateProfile } = useAuth();
  const { headerHeight, handleScroll } = useHeader();
  
  const [name, setName] = useState(user?.full_name || user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [profileImage, setProfileImage] = useState(user?.avatar_url || 'https://randomuser.me/api/portraits/men/32.jpg');
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      feedback.error('Error', 'Please enter your name');
      return;
    }

    setIsLoading(true);
    feedback.buttonPress(); // Haptic feedback for button press
    
    try {
      const success = await updateProfile({
        full_name: name,
        bio: bio || null,
        avatar_url: profileImage !== 'https://randomuser.me/api/portraits/men/32.jpg' ? profileImage : null,
      });

      if (success) {
        feedback.success('Success!', 'Profile updated successfully');
        setTimeout(() => router.push('/settings'), 500); // Small delay for user to see toast
      } else {
        feedback.error('Error', 'Failed to update profile. Please try again.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      feedback.error('Error', 'Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImagePicker = () => {
    Alert.alert(
      'Change Profile Picture',
      'Choose how you would like to update your profile picture',
      [
        {
          text: 'Camera',
          onPress: () => pickImage('camera'),
        },
        {
          text: 'Photo Library',
          onPress: () => pickImage('library'),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  const pickImage = async (source: 'camera' | 'library') => {
    try {
      const permissionResult = source === 'camera' 
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        feedback.warning('Permission Required', 'Please grant permission to access your photos');
        return;
      }

      const result = source === 'camera'
        ? await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
          })
        : await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
          });

      if (!result.canceled && result.assets[0]) {
        setProfileImage(result.assets[0].uri);
        feedback.success('Photo Updated', 'Profile picture changed successfully');
      }
    } catch (error) {
      feedback.error('Error', 'Failed to pick image');
    }
  };

  return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoid}
        >
          <ScrollView 
            style={styles.content}
            contentContainerStyle={[styles.contentContainer, { paddingTop: headerHeight + 20 }]}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
          >
          {/* Profile Picture Section */}
          <View style={styles.profileSection}>
            <View style={styles.profilePictureContainer}>
              <View style={[styles.profileImageWrapper, { borderColor: colors.primary + '30' }]}>
                <Image 
                  source={{ uri: profileImage }}
                  style={styles.profileImage}
                  resizeMode="cover"
                />
                <TouchableOpacity 
                  style={[styles.cameraButton, { backgroundColor: colors.primary }]}
                  onPress={handleImagePicker}
                >
                  <FontAwesome5 name="camera" size={14} color="#fff" />
                </TouchableOpacity>
              </View>
              <Text style={[styles.profileImageHint, { color: colors.textSecondary }]}>
                Tap to change photo
              </Text>
            </View>
          </View>

          {/* Personal Information Section */}
          <View style={styles.section}>
            <View style={[styles.formCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>Full Name</Text>
                <TextInput
                  style={[
                    styles.input,
                    { 
                      backgroundColor: colors.background,
                      borderColor: colors.border,
                      color: colors.text
                    }
                  ]}
                  placeholder="Enter your full name"
                  placeholderTextColor={colors.textSecondary}
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>Bio</Text>
                <TextInput
                  style={[
                    styles.input,
                    styles.bioInput,
                    { 
                      backgroundColor: colors.background,
                      borderColor: colors.border,
                      color: colors.text
                    }
                  ]}
                  placeholder="Tell us about yourself..."
                  placeholderTextColor={colors.textSecondary}
                  value={bio}
                  onChangeText={setBio}
                  multiline
                  numberOfLines={3}
                  maxLength={200}
                />
                <Text style={[styles.inputHint, { color: colors.textSecondary }]}>
                  {bio.length}/200 characters
                </Text>
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>Email Address</Text>
                <View style={[
                  styles.input,
                  styles.disabledInput,
                  { 
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    opacity: 0.6
                  }
                ]}>
                  <Text style={[styles.disabledText, { color: colors.textSecondary }]}>
                    {user?.email || 'email@example.com'}
                  </Text>
                  <FontAwesome5 name="lock" size={12} color={colors.textSecondary} />
                </View>
                <Text style={[styles.inputHint, { color: colors.textSecondary }]}>
                  Contact support to change email
                </Text>
              </View>
            </View>
          </View>

          {/* Tips Section */}
          <View style={[styles.tipsCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.tipsHeader}>
              <FontAwesome5 name="info-circle" size={14} color={colors.textSecondary} />
              <Text style={[styles.tipsTitle, { color: colors.textSecondary }]}>Profile Tips</Text>
            </View>
            <Text style={[styles.tipsText, { color: colors.textSecondary }]}>
              Use a clear, recent photo • Keep your name professional • Help others identify you
            </Text>
          </View>

          {/* Save Button */}
          <Button
            title="Save Changes"
            variant="primary"
            onPress={handleSave}
            disabled={isLoading}
            loading={isLoading}
            style={styles.saveButton}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

export default function EditProfileScreen() {
  return (
    <PageWithAnimatedHeader title="Edit Profile" showBackButton={true}>
      <EditProfileContent />
    </PageWithAnimatedHeader>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },

  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 32,
  },
  profileSection: {
    marginBottom: 40,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    letterSpacing: 0.3,
  },
  profilePictureContainer: {
    alignItems: 'center',
  },
  profileImageWrapper: {
    position: 'relative',
    borderWidth: 3,
    borderRadius: 70,
    padding: 3,
  },
  profileImage: {
    width: 130,
    height: 130,
    borderRadius: 65,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  profileImageHint: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 16,
    opacity: 0.7,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    ...(Platform.OS === 'ios' ? {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
    } : {
      elevation: 3,
    }),
  },
  formCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 24,
    ...(Platform.OS === 'ios' ? {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
    } : {
      elevation: 4,
    }),
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
  },
  bioInput: {
    height: 80,
    paddingTop: 12,
    textAlignVertical: 'top',
  },
  disabledInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  disabledText: {
    fontSize: 16,
    flex: 1,
  },
  inputHint: {
    fontSize: 12,
    marginTop: 6,
    opacity: 0.8,
  },
  tipsCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginTop: 8,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  tipsText: {
    fontSize: 13,
    lineHeight: 18,
    opacity: 0.9,
  },
  saveButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
}); 