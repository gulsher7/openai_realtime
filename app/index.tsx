import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AudioContext, AudioManager } from 'react-native-audio-api';
import { MicButton, PermissionMessage } from '../components';
import { useAudioPermissions, useAudioPlayback, useRecording } from '../utils/hooks';
import useRealTime from '../utils/useRealTime';


export default function VoiceInteractionScreen(): React.JSX.Element {
  // Custom hooks for modular functionality
  const { hasAudioPermission, isLoading: permissionLoading } = useAudioPermissions();
  const { audioContextRef, addToQueue, clearQueue } = useAudioPlayback();


  // Real-time communication with AI service - Simplified
  const { addUserAudio, readyState } = useRealTime({
    onWebSocketOpen: () => console.log('🔗 WebSocket connected'),
    onWebSocketClose: () => console.log('🔌 WebSocket disconnected'),
    onWebSocketError: (e: Event) => console.log('❌ WebSocket error', e),
    onReceivedConnectionEstablished: () => {
      console.log('✅ Backend connection established');
    },
    onReceivedSessionReady: () => {
      console.log('🎯 Session ready for audio');
    },
    onReceivedAudioChunk: async (message) => {

      if (audioContextRef.current) {
        console.log('🔊 Received audio chunk', message?.audio);
        const audioBuffer = await audioContextRef.current.decodeAudioData(message?.audio);
        if (audioBuffer) {
          console.log('🔊 Audio chunk processed');
          // Always play AI responses, even during recording
          addToQueue(audioBuffer);
          console.log('✅ Audio chunk queued for playback');
        }
      }
    },
    onReceivedError: (message) => {
      console.error('🚫 Backend error:', message.message);
    }
  });

  // Recording functionality with callbacks
  const { isRecording, toggleRecording } = useRecording({
    onRecordingStart: () => {
      // Don't stop playback - allow simultaneous recording and AI response playback
      console.log('🎤 Started recording - maintaining playback capability');
    },
    onAudioData: async (audioFrame: string) => {

      // const decoded = Buffer.from(audioFrame, 'base64');
      // appendToBuffer(audioFrame);
      addUserAudio({ audio: audioFrame });

    },
    onRecordingComplete: (base64Audio: string) => {
      console.log('✅ Recording completed - audio was streamed in real-time');
      // Audio was already streamed during recording, no need to send again
    },
    onRecordingStop: () => {
      console.log('🛑 Recording stopped');
      clearQueue();
    },
  });

  // Initialize Audio Manager and AudioContext
  useEffect(() => {
    const initAudio = async () => {
      try {
        if (!hasAudioPermission) {
          console.log('Audio permission not granted, audio features will be limited');
          return;
        }

        // Set up AudioManager for simultaneous recording and playback
        AudioManager.setAudioSessionOptions({
          iosCategory: 'playAndRecord',
          iosMode: 'voiceChat',
          iosOptions: ['defaultToSpeaker'],
        });

        audioContextRef.current = new AudioContext({ sampleRate: 24000 });
        console.log('AudioManager and AudioContext initialized');
      } catch (error) {
        console.error('Failed to initialize audio:', error);
      }
    };

    initAudio();

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [hasAudioPermission]);


  return (
    <View style={styles.container}>
      {/* Mystical Background Elements */}
      <View style={styles.backgroundElements}>
        <Text style={[styles.backgroundSymbol, styles.symbol1]}>✦</Text>
        <Text style={[styles.backgroundSymbol, styles.symbol2]}>✧</Text>
        <Text style={[styles.backgroundSymbol, styles.symbol3]}>⭐</Text>
        <Text style={[styles.backgroundSymbol, styles.symbol4]}>✨</Text>
        <Text style={[styles.backgroundSymbol, styles.symbol5]}>💫</Text>
      </View>

      {/* Permission Message */}
      <PermissionMessage
        hasPermission={hasAudioPermission}
        isLoading={permissionLoading}
      />

      {/* Main Content Container */}
      <View style={styles.mainContent}>

        {/* Spiritual Connection Indicator */}
        <View style={styles.connectionIndicator}>
          <Text style={styles.connectionText}>
            {readyState === WebSocket.OPEN ? '🙏 Connected to Divine Knowledge 🙏' : '🔌 Connecting to Divine Realm...'}
          </Text>
        </View>

        {/* Enhanced Mic Button */}
        <View style={styles.micButtonContainer}>
          <MicButton
            onPress={toggleRecording}
            disabled={!hasAudioPermission}
            isRecording={isRecording}
          />
        </View>
      </View>

      {/* Bottom Spiritual Quote */}
      <View style={styles.bottomQuote}>
        <Text style={styles.quoteText}>
          "ॐ सर्वे भवन्तु सुखिनः" • "May All Beings Be Happy"
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    position: 'relative',
  },
  backgroundElements: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  backgroundSymbol: {
    position: 'absolute',
    fontSize: 20,
    color: 'rgba(155, 89, 182, 0.1)',
    opacity: 0.3,
  },
  symbol1: {
    top: '15%',
    left: '10%',
  },
  symbol2: {
    top: '25%',
    right: '15%',
  },
  symbol3: {
    top: '60%',
    left: '8%',
  },
  symbol4: {
    top: '70%',
    right: '12%',
  },
  symbol5: {
    top: '45%',
    left: '50%',
    transform: [{ translateX: -10 }],
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    zIndex: 1,
  },
  connectionIndicator: {
    marginVertical: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: 'rgba(155, 89, 182, 0.1)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(155, 89, 182, 0.3)',
  },
  connectionText: {
    color: '#cccccc',
    fontSize: 13,
    textAlign: 'center',
    fontStyle: 'italic',
    opacity: 0.9,
  },
  micButtonContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  bottomQuote: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    alignItems: 'center',
    zIndex: 1,
  },
  quoteText: {
    color: 'rgba(155, 89, 182, 0.6)',
    fontSize: 12,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 16,
  },
}); 