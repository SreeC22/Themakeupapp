import { Redirect } from 'expo-router';

import { useAppState } from '../lib/app-state';

export default function Gate() {
  const { ready, profile } = useAppState();
  if (!ready) return null;
  return <Redirect href={profile ? '/(tabs)' : '/welcome'} />;
}
