import { AudioContext } from 'react-native-audio-api';

export const contextAudioAPI = new AudioContext({ sampleRate: 24000 }); // Match your OpenAI sample rate
const queueSource = contextAudioAPI.createBufferQueueSource();
queueSource.connect(contextAudioAPI.destination);
queueSource.start();

/**
 * Plays a base64 PCM chunk using react-native-audio-api
 * @param base64PCM - base64-encoded PCM16 mono audio (16-bit, 24kHz)
 */
export const playPCM = async (base64PCM: string) => {
  console.log('🔊 Playing PCM chunk');
  try {
    const audioBuffer = await contextAudioAPI.decodeAudioData(base64PCM); // decode base64 PCM
    queueSource.enqueueBuffer(audioBuffer, false); // enqueue to queue source
  } catch (error) {
    console.error('Failed to play PCM chunk:', error);
  }
};
