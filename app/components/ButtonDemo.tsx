import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../../contexts';
import Button from './Button';

const ButtonDemo: React.FC = () => {
  const { colors } = useTheme();
  const [loading, setLoading] = useState<string | null>(null);

  const handleButtonPress = (variant: string) => {
    setLoading(variant);
    setTimeout(() => setLoading(null), 2000);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Button Variants Demo</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Testing all button variants with your custom color scheme
      </Text>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Primary Buttons</Text>
        <View style={styles.buttonRow}>
          <Button
            title="Primary"
            variant="primary"
            size="sm"
            onPress={() => handleButtonPress('primary-sm')}
            loading={loading === 'primary-sm'}
          />
          <Button
            title="Primary"
            variant="primary"
            size="md"
            onPress={() => handleButtonPress('primary-md')}
            loading={loading === 'primary-md'}
          />
          <Button
            title="Primary"
            variant="primary"
            size="lg"
            onPress={() => handleButtonPress('primary-lg')}
            loading={loading === 'primary-lg'}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Secondary Buttons</Text>
        <View style={styles.buttonRow}>
          <Button
            title="Secondary"
            variant="secondary"
            size="sm"
            onPress={() => handleButtonPress('secondary-sm')}
            loading={loading === 'secondary-sm'}
          />
          <Button
            title="Secondary"
            variant="secondary"
            size="md"
            onPress={() => handleButtonPress('secondary-md')}
            loading={loading === 'secondary-md'}
          />
          <Button
            title="Secondary"
            variant="secondary"
            size="lg"
            onPress={() => handleButtonPress('secondary-lg')}
            loading={loading === 'secondary-lg'}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Outline Buttons</Text>
        <View style={styles.buttonRow}>
          <Button
            title="Outline"
            variant="outline"
            size="sm"
            onPress={() => handleButtonPress('outline-sm')}
            loading={loading === 'outline-sm'}
          />
          <Button
            title="Outline"
            variant="outline"
            size="md"
            onPress={() => handleButtonPress('outline-md')}
            loading={loading === 'outline-md'}
          />
          <Button
            title="Outline"
            variant="outline"
            size="lg"
            onPress={() => handleButtonPress('outline-lg')}
            loading={loading === 'outline-lg'}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Destructive Buttons</Text>
        <View style={styles.buttonRow}>
          <Button
            title="Delete"
            variant="destructive"
            size="sm"
            onPress={() => handleButtonPress('destructive-sm')}
            loading={loading === 'destructive-sm'}
          />
          <Button
            title="Delete"
            variant="destructive"
            size="md"
            onPress={() => handleButtonPress('destructive-md')}
            loading={loading === 'destructive-md'}
          />
          <Button
            title="Delete"
            variant="destructive"
            size="lg"
            onPress={() => handleButtonPress('destructive-lg')}
            loading={loading === 'destructive-lg'}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Ghost Buttons</Text>
        <View style={styles.buttonRow}>
          <Button
            title="Ghost"
            variant="ghost"
            size="sm"
            onPress={() => handleButtonPress('ghost-sm')}
            loading={loading === 'ghost-sm'}
          />
          <Button
            title="Ghost"
            variant="ghost"
            size="md"
            onPress={() => handleButtonPress('ghost-md')}
            loading={loading === 'ghost-md'}
          />
          <Button
            title="Ghost"
            variant="ghost"
            size="lg"
            onPress={() => handleButtonPress('ghost-lg')}
            loading={loading === 'ghost-lg'}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Link Buttons</Text>
        <View style={styles.buttonRow}>
          <Button
            title="Link Small"
            variant="link"
            size="sm"
            onPress={() => handleButtonPress('link-sm')}
            loading={loading === 'link-sm'}
          />
          <Button
            title="Link Medium"
            variant="link"
            size="md"
            onPress={() => handleButtonPress('link-md')}
            loading={loading === 'link-md'}
          />
          <Button
            title="Link Large"
            variant="link"
            size="lg"
            onPress={() => handleButtonPress('link-lg')}
            loading={loading === 'link-lg'}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Disabled States</Text>
        <View style={styles.buttonRow}>
          <Button
            title="Disabled Primary"
            variant="primary"
            disabled={true}
            onPress={() => {}}
          />
          <Button
            title="Disabled Secondary"
            variant="secondary"
            disabled={true}
            onPress={() => {}}
          />
          <Button
            title="Disabled Outline"
            variant="outline"
            disabled={true}
            onPress={() => {}}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
    textAlign: 'center',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    alignItems: 'center',
  },
});

export default ButtonDemo; 