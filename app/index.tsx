import { Redirect } from 'expo-router';

export default function IndexScreen() {
  // Automatically redirect to login screen
  return <Redirect href='/consent' />;
}
