import { useCallback, useRef } from 'react';
import { AnalyserNode, AudioBuffer, AudioBufferSourceNode, AudioContext, GainNode } from 'react-native-audio-api';

interface UseAudioPlaybackReturn {
  audioContextRef: React.RefObject<AudioContext | null>;
  playAudioBuffer: (buffer: AudioBuffer) => Promise<void>;
  stopPlayback: () => void;
  addToQueue: (buffer: AudioBuffer) => void;
  clearQueue: () => void;
  connectToAnalyser: (analyser: AnalyserNode) => void;
  playNextFromQueue: () => void;
}

export const useAudioPlayback = (): UseAudioPlaybackReturn => {

  // Audio API refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioBufferSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Audio streaming
  const audioQueueRef = useRef<AudioBuffer[]>([]);
  const isPlayingRef = useRef<boolean>(false);
  const analyserRef = useRef<AnalyserNode | null>(null);

  const playAudioBuffer = useCallback(async (buffer: AudioBuffer) => {
    if (!audioContextRef.current) return;

    try {
      console.log('Playing audio buffer');

      // Create source node
      const source = audioContextRef.current.createBufferSource();
      source.buffer = buffer;

      // Create gain node for volume control
      const gainNode = audioContextRef.current.createGain();
      gainNode.gain.value = 3.0;

      // Connect nodes - route through analyser if available
      source.connect(gainNode);

      if (analyserRef.current) {
        gainNode.connect(analyserRef.current);
        // Note: analyser should already be connected to destination
      } else {
        gainNode.connect(audioContextRef.current.destination);
      }

      // Store refs for cleanup
      audioBufferSourceRef.current = source;
      gainNodeRef.current = gainNode;

      // Start playback
      source.start();
      console.log('Audio playback started');

      // Handle playback completion for seamless streaming
      source.onEnded = () => {
        console.log('🔚 Audio chunk playback finished');
        // Play next buffer in queue if available (real-time streaming)
        if (audioQueueRef.current.length > 0) {
          console.log(`▶️ Playing next chunk from queue (${audioQueueRef.current.length} remaining)`);
          const nextBuffer = audioQueueRef.current.shift()!;
          playAudioBuffer(nextBuffer);
        } else {
          console.log('🛑 Audio queue empty, stopping playback');
          audioBufferSourceRef.current = null;
          gainNodeRef.current = null;
          isPlayingRef.current = false;
        }
      };

    } catch (err) {
      console.log('Audio playback error:', err);
      isPlayingRef.current = false;
    }
  }, []);

  const stopPlayback = useCallback(() => {
    if (audioBufferSourceRef.current) {
      try {
        audioBufferSourceRef.current.stop();
      } catch (error) {
        console.log('Error stopping audio source:', error);
      }
    }
    if (gainNodeRef.current) {
      gainNodeRef.current.disconnect();
    }

    audioQueueRef.current = [];
    isPlayingRef.current = false;
  }, []);


  const addToQueue = useCallback((buffer: AudioBuffer) => {
    console.log(`🎵 Adding audio buffer to queue (${buffer.duration.toFixed(3)}s, ${buffer.length} samples)`);
    audioQueueRef.current.push(buffer);
    

    // Start playback immediately if not already playing
    if (!isPlayingRef.current) {
      console.log('🚀 Starting audio playback from queue');
      isPlayingRef.current = true;
      const nextBuffer = audioQueueRef.current.shift()!;

      playAudioBuffer(nextBuffer);
    } else {
      console.log(`📦 Queue: ${audioQueueRef.current.length} buffers`);
    }
  }, [playAudioBuffer]);

  const clearQueue = useCallback(() => {
    console.log('🗑️ Clearing audio queue');
    audioQueueRef.current = [];
  }, []);

  const connectToAnalyser = useCallback((analyser: AnalyserNode) => {
    analyserRef.current = analyser;
    console.log('Audio playback connected to analyser');
  }, []);


  const playNextFromQueue = async () => {
    if (!audioQueueRef.current.length || isPlayingRef.current) return;
  

    const nextBuffer = audioQueueRef.current.shift();
  
    const source = audioContextRef.current!.createBufferSource();
    source.buffer = nextBuffer!;
    source.connect(audioContextRef.current!.destination);
    source.start();
  
    source.onEnded = () => {

      playNextFromQueue(); // recursive
    };
  };
  return {
    audioContextRef,
    playAudioBuffer,
    stopPlayback,
    addToQueue,
    clearQueue,
    connectToAnalyser,
    playNextFromQueue,
  };
};