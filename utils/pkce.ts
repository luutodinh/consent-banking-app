import * as Crypto from 'expo-crypto';

function base64UrlEncode(buffer: Uint8Array): string {
  return btoa(String.fromCharCode(...buffer))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export async function generatePKCE(): Promise<{
  code_verifier: string;
  code_challenge: string;
}> {
  // Use expo-crypto instead of Web Crypto API
  const randomBytes = Crypto.getRandomBytes(64);
  const code_verifier = base64UrlEncode(randomBytes);

  // Use expo-crypto for SHA-256 hashing
  const digest = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    code_verifier,
    { encoding: Crypto.CryptoEncoding.BASE64 }
  );

  // Convert base64 to base64url format
  const code_challenge = digest
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  return {
    code_verifier,
    code_challenge,
  };
}
