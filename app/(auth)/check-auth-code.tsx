import { BANKING_APP_DEEP_LINK } from '@/constants/env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text } from '@react-navigation/elements';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect } from 'react';
import { Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const CheckAuthCode = () => {
  const [wrongState, setWrongState] = React.useState(false);

  const { code, state, error } = useLocalSearchParams<{
    code: string;
    state: string;
    error: string;
  }>();

  // useMemo(() => {
  //   if (!code || !state) {
  //     return;
  //   }

  //   Linking.openURL(
  //     `${BANKING_APP_DEEP_LINK}/--/consent?code=${code}&state=${state}&error=${error}`
  //   );
  // }, [code, state, error]);

  useEffect(() => {
    const checkState = async () => {
      const storedState = await AsyncStorage.getItem('state');
      if (storedState !== state) {
        setWrongState(true);
        return;
      }

      if (code && !error) {
        Linking.openURL(
          `${BANKING_APP_DEEP_LINK}/--/consent?code=${code}&state=${state}&error=${error}`
        );
      }
    };

    checkState();
  }, [state, code, error]);

  if (error) {
    return (
      <SafeAreaView className='flex-1 justify-center items-center'>
        <Text>Something went wrong</Text>
      </SafeAreaView>
    );
  }

  if (!code || !state) {
    return (
      <SafeAreaView className='flex-1 justify-center items-center'>
        <Text>Invalid parameters</Text>
      </SafeAreaView>
    );
  }

  if (wrongState) {
    return (
      <SafeAreaView className='flex-1 justify-center items-center'>
        <Text>State mismatch. Please try again.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className='flex-1 justify-center items-center'>
      <Text>Opening the banking app...</Text>
    </SafeAreaView>
  );
};

export default CheckAuthCode;
