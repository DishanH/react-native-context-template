import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { useBottomSheet } from './components/BottomSheetProvider';
import SampleBottomSheetContent from './components/SampleBottomSheetContent';
import { useTheme } from '../contexts';

export default function ActivityScreen() {
  const { colors } = useTheme();
  const { openBottomSheet } = useBottomSheet();

  const handleOpenBottomSheet = () => {
    openBottomSheet(<SampleBottomSheetContent />, '30%');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.placeholder, { color: colors.textSecondary }]}>
          Activity Page Template
        </Text>
        
        <Button 
          title="Open Bottom Sheet" 
          onPress={handleOpenBottomSheet}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    gap: 20,
  },
  placeholder: {
    fontSize: 18,
    fontWeight: '500',
  },
}); 