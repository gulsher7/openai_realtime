import { useEffect, useState } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';

interface UseAudioPermissionsReturn {
  hasAudioPermission: boolean;
  requestAudioPermissions: () => Promise<boolean>;
  isLoading: boolean;
}

export const useAudioPermissions = (): UseAudioPermissionsReturn => {
  const [hasAudioPermission, setHasAudioPermission] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const requestAudioPermissions = async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      if (Platform.OS === 'android') {
        console.log('Requesting Android audio permissions...');
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'Audio Permission',
            message: 'This app needs access to your microphone to record audio.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        const hasPermission = granted === PermissionsAndroid.RESULTS.GRANTED;
        console.log('Android permission result:', granted, 'Has permission:', hasPermission);
        setHasAudioPermission(hasPermission);
        return hasPermission;
      } else {
        // iOS permissions are handled by the system when accessing microphone
        console.log('iOS permissions will be requested by system');
        setHasAudioPermission(true);
        return true;
      }
    } catch (err) {
      console.error('Error requesting audio permissions:', err);
      setHasAudioPermission(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Auto-request permissions on mount
    requestAudioPermissions();
  }, []);

  return {
    hasAudioPermission,
    requestAudioPermissions,
    isLoading,
  };
};