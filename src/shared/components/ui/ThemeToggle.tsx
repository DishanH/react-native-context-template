import { FontAwesome5 } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../../../contexts';

// Define palette colors for the theme previews
const LIGHT_COLORS = {
  background: '#FFFFFF',
  text: '#1E2022',
  medium: '#C9D6DF'
};

const DARK_COLORS = {
  background: '#06141B',
  text: '#CCD0CF',
  medium: '#253745'
};

interface ThemeToggleProps {
  containerStyle?: object;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ containerStyle }) => {
  const { theme, setTheme, colors: themeColors } = useTheme();
  
  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.themeOptions}>
        <TouchableOpacity
          style={[
            styles.themeBox,
            { 
              backgroundColor: LIGHT_COLORS.background,
              borderColor: theme === 'light' ? themeColors.primary : themeColors.border,
              borderWidth: theme === 'light' ? 2 : 1,
            }
          ]}
          onPress={() => setTheme('light')}
        >
          <View style={styles.themeContent}>
            <View style={styles.themeColorCircles}>
              <View style={[styles.colorCircle, { backgroundColor: LIGHT_COLORS.text }]} />
              <View style={[styles.colorCircle, { backgroundColor: LIGHT_COLORS.medium }]} />
            </View>
            <Text style={[styles.themeLabel, { color: LIGHT_COLORS.text }]}>Light</Text>
            {theme === 'light' && (
              <FontAwesome5 
                name="check-circle" 
                size={16} 
                color={themeColors.primary}
                style={styles.checkIcon}
              />
            )}
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.themeBox,
            { 
              backgroundColor: DARK_COLORS.background,
              borderColor: theme === 'dark' ? themeColors.primary : themeColors.border,
              borderWidth: theme === 'dark' ? 2 : 1,
            }
          ]}
          onPress={() => setTheme('dark')}
        >
          <View style={styles.themeContent}>
            <View style={styles.themeColorCircles}>
              <View style={[styles.colorCircle, { backgroundColor: DARK_COLORS.text }]} />
              <View style={[styles.colorCircle, { backgroundColor: DARK_COLORS.medium }]} />
            </View>
            <Text style={[styles.themeLabel, { color: DARK_COLORS.text }]}>Dark</Text>
            {theme === 'dark' && (
              <FontAwesome5 
                name="check-circle" 
                size={16} 
                color={themeColors.primary}
                style={styles.checkIcon}
              />
            )}
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  themeOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  themeBox: {
    width: '48%',
    height: 120,
    borderRadius: 12,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  themeContent: {
    padding: 12,
    position: 'relative',
  },
  themeColorCircles: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  colorCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 6,
  },
  themeLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  checkIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
  }
});

export default ThemeToggle; 