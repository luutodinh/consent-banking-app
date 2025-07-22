import { Redirect, useLocalSearchParams } from 'expo-router';

export default function IndexScreen() {
  // Automatically redirect to login screen

  const {
    client_id,
    redirect_uri,
    keycloak_url,
    realm,
    client_secret,
    code_challenge,
  } = useLocalSearchParams<{
    client_id: string;
    redirect_uri: string;
    keycloak_url: string;
    realm: string;
    client_secret: string;
    code_challenge: string;
  }>();

  return (
    <Redirect
      href={`/(auth)/login?client_id=${client_id}&redirect_uri=${encodeURIComponent(
        redirect_uri
      )}&keycloak_url=${keycloak_url}&realm=${realm}&client_secret=${client_secret}&code_challenge=${code_challenge}`}
    />
  );
}
