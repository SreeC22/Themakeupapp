import { router } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';

import {
  Body,
  Button,
  Chip,
  Eyebrow,
  Screen,
  Title,
  ToneSwatch,
  usePalette,
} from '../../components/neu';
import { useAppState } from '../../lib/app-state';
import { mstCode, Undertone, UT, whyString } from '../../lib/tone';
import { font, space, type } from '../../theme/tokens';

export default function You() {
  const c = usePalette();
  const { profile, setProfile, savedIds } = useAppState();

  if (!profile) {
    return (
      <Screen>
        <View style={{ flex: 1, padding: space[6], justifyContent: 'center' }}>
          <Eyebrow style={{ marginBottom: space[2] }}>You</Eyebrow>
          <Title style={{ marginBottom: space[2] }}>No tone profile yet</Title>
          <Body style={{ marginBottom: space[5] }}>
            The quiz takes 30 seconds, no camera. Your profile stays on this phone.
          </Body>
          <Button label="Find my tone" onPress={() => router.push('/quiz')} />
        </View>
      </Screen>
    );
  }

  const why = profile.overridden ? 'Set by you' : `Based on ${whyString(profile.signals)}`;

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ padding: space[6], paddingBottom: space[8] }}>
        <View style={{ alignItems: 'center', marginBottom: space[6] }}>
          <ToneSwatch color={profile.color} size={72} selected />
          <Text
            style={{
              fontFamily: font.display,
              fontSize: type.h2,
              color: c.ink,
              marginTop: space[3],
            }}>
            You
          </Text>
          <Text
            style={{
              fontFamily: font.mono,
              fontSize: type.cap,
              color: c.ink2,
              marginTop: 2,
            }}>
            {mstCode(profile.depth)} · {UT[profile.undertone]}
            {profile.overridden ? ' · self-set' : ''}
          </Text>
          <Body style={{ marginTop: space[2], textAlign: 'center' }}>{why}.</Body>
        </View>

        <Eyebrow style={{ marginBottom: space[2] }}>Undertone</Eyebrow>
        <View style={{ flexDirection: 'row', gap: space[2], marginBottom: space[6] }}>
          {(Object.keys(UT) as Undertone[]).map((ut) => (
            <Chip
              key={ut}
              label={UT[ut]}
              selected={profile.undertone === ut}
              onPress={() => setProfile({ ...profile, undertone: ut, overridden: true })}
            />
          ))}
        </View>

        <View
          style={{
            backgroundColor: c.surface,
            borderColor: c.line,
            borderWidth: 1,
            borderRadius: 20,
            padding: space[5],
            marginBottom: space[6],
          }}>
          <Text style={{ fontFamily: font.display, fontSize: type.h3, color: c.ink }}>
            {savedIds.length} saved
          </Text>
          <Body style={{ fontSize: type.cap }}>
            On this phone for now. An account keeps them safe, coming with the beta.
          </Body>
        </View>

        <Button label="Retake the quiz" variant="soft" onPress={() => router.push('/quiz')} />
      </ScrollView>
    </Screen>
  );
}
