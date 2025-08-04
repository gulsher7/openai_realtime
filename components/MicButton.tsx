import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface MicButtonProps {
  onPress: () => void;
  disabled?: boolean;
  isRecording?: boolean;
}

export const MicButton: React.FC<MicButtonProps> = ({ 
  onPress, 
  disabled = false, 
  isRecording = false 
}) => {
  const pulseAnimation = React.useRef(new Animated.Value(1)).current;
  const glowAnimation = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (isRecording) {
      // Pulsing animation when recording
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnimation, {
            toValue: 1.1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnimation, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Glow animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnimation, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: false,
          }),
          Animated.timing(glowAnimation, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: false,
          }),
        ])
      ).start();
    } else {
      pulseAnimation.setValue(1);
      glowAnimation.setValue(0);
    }
  }, [isRecording]);

  const glowOpacity = glowAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  return (
    <View style={styles.container}>
      {/* Spiritual rings around the button */}
      <View style={styles.outerRing}>
        <View style={styles.middleRing}>
          <Animated.View 
            style={[
              styles.buttonContainer,
              {
                transform: [{ scale: pulseAnimation }],
              }
            ]}
          >
            {/* Animated glow effect */}
            {isRecording && (
              <Animated.View
                style={[
                  styles.glowEffect,
                  {
                    opacity: glowOpacity,
                    shadowOpacity: glowOpacity,
                  },
                ]}
              />
            )}
            
            <TouchableOpacity
              style={styles.micButton}
              onPress={onPress}
              disabled={disabled}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={
                  disabled
                    ? ['#444444', '#222222']
                    : isRecording
                    ? ['#ff6b6b', '#ff4757', '#ff3742']
                    : ['#9b59b6', '#8e44ad', '#7d3c98']
                }
                style={styles.gradientButton}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.micIcon}>
                  {isRecording ? '🎙️' : '🎤'}
                </Text>
                <Text style={styles.buttonText}>
                  {isRecording ? 'Speaking...' : 'Ask Pandit'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
      
      {/* Sacred symbols around the button */}
      <View style={styles.symbolsContainer}>
        <Text style={[styles.symbol, { top: 10, left: '50%', marginLeft: -8 }]}>🕉️</Text>
        <Text style={[styles.symbol, { right: 10, top: '50%', marginTop: -8 }]}>🔮</Text>
        <Text style={[styles.symbol, { bottom: 10, left: '50%', marginLeft: -8 }]}>✨</Text>
        <Text style={[styles.symbol, { left: 10, top: '50%', marginTop: -8 }]}>🙏</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  outerRing: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
    borderColor: 'rgba(155, 89, 182, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  middleRing: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 1,
    borderColor: 'rgba(155, 89, 182, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowEffect: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 107, 107, 0.3)',
    shadowColor: '#ff6b6b',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 20,
    elevation: 10,
  },
  micButton: {
    borderRadius: 40,
    overflow: 'hidden',
    shadowColor: '#9b59b6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  gradientButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  micIcon: {
    fontSize: 24,
    marginBottom: 2,
  },
  buttonText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  symbolsContainer: {
    position: 'absolute',
    width: 180,
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
  },
  symbol: {
    position: 'absolute',
    fontSize: 16,
    opacity: 0.6,
  },
});