import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MD3 } from '../../constants/colors';

interface CarFinderIconProps {
  size?: number;
  color?: string;
}

export function CarFinderIcon({ size = 24, color = MD3.primary }: CarFinderIconProps) {
  const badgeSize = size * 0.58;
  return (
    <View style={{ width: size, height: size }}>
      <Ionicons name="car-sport-outline" size={size} color={color} />
      <View
        style={[
          styles.badge,
          {
            width: badgeSize,
            height: badgeSize,
            borderRadius: badgeSize / 2,
            right: -badgeSize * 0.28,
            bottom: -badgeSize * 0.28,
            borderColor: color,
          },
        ]}
      >
        <Ionicons name="search" size={badgeSize * 0.62} color={color} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
  },
});
