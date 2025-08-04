import React from 'react';
import { StyleSheet, Text } from 'react-native';

interface PermissionMessageProps {
  hasPermission: boolean;
  isLoading?: boolean;
}

export const PermissionMessage: React.FC<PermissionMessageProps> = ({ 
  hasPermission, 
  isLoading = false 
}) => {
  if (hasPermission) return null;

  const getMessage = (): string => {
    if (isLoading) return 'Checking permissions...';
    return 'Microphone permission required for recording';
  };

  return (
    <Text style={styles.permissionText}>
      {getMessage()}
    </Text>
  );
};

const styles = StyleSheet.create({
  permissionText: {
    fontSize: 16,
    color: '#ff6b6b',
    marginBottom: 20,
    textAlign: 'center',
  },
});