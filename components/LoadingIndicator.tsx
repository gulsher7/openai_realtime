import React from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';

interface LoadingIndicatorProps {
  visible: boolean;
  color?: string;
  size?: 'small' | 'large';
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ 
  visible, 
  color = 'white', 
  size = 'large' 
}) => {
  if (!visible) return null;

  return (
    <ActivityIndicator 
      color={color} 
      size={size} 
      style={styles.indicator} 
    />
  );
};

const styles = StyleSheet.create({
  indicator: {
    marginTop: 30,
  },
});