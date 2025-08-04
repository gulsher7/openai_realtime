import {
  ExpoAudioStreamModule,
  useAudioRecorder,
  type AudioDataEvent,
  type RecordingConfig
} from '@siteed/expo-audio-studio';
import { EncodingType, readAsStringAsync } from 'expo-file-system';
import { Alert } from 'react-native';


interface UseRecordingProps {
  onAudioData?: (audioData: string) => void;
  onRecordingComplete?: (base64Audio: string) => void;
  onRecordingStart?: () => void;
  onRecordingStop?: () => void;
}

interface UseRecordingReturn {
  isRecording: boolean;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<void>;
  toggleRecording: () => void;
}

export const useRecording = ({
  onAudioData,
  onRecordingComplete,
  onRecordingStart,
  onRecordingStop,
}: UseRecordingProps = {}): UseRecordingReturn => {
  const {
    startRecording: startAudioRecording,
    stopRecording: stopAudioRecording,
    isRecording,
  } = useAudioRecorder();

  const startRecording = async (): Promise<void> => {
    try {
      // Request permissions
      const { status } = await ExpoAudioStreamModule.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Microphone permission is required.');
        return;
      }

      // Add a small delay to ensure audio session is ready (iOS specific fix)
      await new Promise(resolve => setTimeout(resolve, 100));

      const config: RecordingConfig = {
        // Optimal streaming interval for real-time processing
        interval: 250, // Send every 250ms instead of 100ms
        
        // Using 16kHz (library supported rate) - Azure will handle resampling to 24kHz
        sampleRate: 16000, // Standard rate supported by expo-audio-studio
        
        // Mono audio (correct)
        channels: 1,
        
        // PCM 16-bit encoding (correct)
        encoding: 'pcm_16bit',
        
        output: {
          primary: { enabled: true },
          compressed: { enabled: false }, // Keep uncompressed for best quality
        },
        
        onAudioStream: async (chunk: AudioDataEvent) => {
          // Handle streaming audio data if callback provided
          if (onAudioData && chunk?.data) {
            onAudioData(chunk.data as string);
            return; 
          }      
        },

        
        // Larger buffer for smoother streaming
        bufferDurationSeconds: 0.25, // Changed from 0.1 to 0.25 seconds
        
        autoResumeAfterInterruption: true,
        onRecordingInterrupted: (e) => {
          console.log('🎧 Recording interrupted', e.reason);
        },
      };

      await startAudioRecording(config);
      onRecordingStart?.();
      console.log('🎙️ Recording started');
    } catch (error) {
      console.error('Failed to start recording:', error);
      Alert.alert('Recording Error', 'Failed to start recording. Please try again.');
    }
  };

  const stopRecording = async (): Promise<void> => {
    try {
      const result = await stopAudioRecording();

      if (result?.fileUri) {
        const base64Audio = await readAsStringAsync(result.fileUri, {
          encoding: EncodingType.Base64,
        });

        console.log('🎧 Recording completed, base64 length:', base64Audio.length);
        onRecordingComplete?.(base64Audio);
      }

      onRecordingStop?.();
      console.log('🛑 Recording stopped');
    } catch (err) {
      console.error('Stop recording failed:', err);
      Alert.alert('Recording Error', 'Failed to stop recording properly.');
    }
  };

  const toggleRecording = (): void => {
    if (isRecording) {
      alert("Stopping recording");
      stopRecording();
    } else {
      alert("Starting recording");
      startRecording();
    }
  };

  return {
    isRecording,
    startRecording,
    stopRecording,
    toggleRecording,
  };
};