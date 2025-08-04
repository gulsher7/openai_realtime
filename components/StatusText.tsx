import React from 'react';
import { StyleSheet, Text } from 'react-native';

interface StatusTextProps {
  isRecording: boolean;
  isPlaying: boolean;
  hasPermission: boolean;
}

export const StatusText: React.FC<StatusTextProps> = ({ 
  isRecording, 
  isPlaying, 
  hasPermission 
}) => {
  const getStatusText = (): string => {
    if (!hasPermission) return 'Permission required';
    if (isRecording) return 'Listening…';
    if (isPlaying) return 'Speaking…';
    return 'Tap to start';
  };

  return (
    <Text style={styles.title}>
      {getStatusText()}
    </Text>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
  },
});