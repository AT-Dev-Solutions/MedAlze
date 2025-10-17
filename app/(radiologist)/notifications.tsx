import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, fontSize } from '@/constants/theme';

export default function Notifications() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Notifications Screen - Coming Soon</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
  },
  text: {
    fontSize: fontSize.lg,
    color: colors.text.secondary,
  },
});
