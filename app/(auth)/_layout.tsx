import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';

export default function AuthLayout() {
  return (
    <>
      <StatusBar style='dark' backgroundColor='#f9fafb' />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#f9fafb' },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen
          name='login'
          options={{
            title: 'Login',
            gestureEnabled: false, // Disable swipe back on login
          }}
        />
      </Stack>
    </>
  );
}
