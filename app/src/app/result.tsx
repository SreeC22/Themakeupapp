import { Redirect, router } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';

import {
  Body,
  Button,
  Chip,
  Eyebrow,
  Grid,
  Screen,
  Title,
  ToneSwatch,
  usePalette,
} from '../components/neu';
import { rankPicks } from '../data/starter-picks';
import { useAppState } from '../lib/app-state';
import { depthIndex, mstCode, Undertone, UT, whyString } from '../lib/tone';
import { font, mst, space, type } from '../theme/tokens';

export default function Result() {
  const c = usePalette();
  const { profile, setProfile, savedIds, toggleSaved } = useAppState();
  if (!profile) return <Redirect href="/welcome" />;

  const di = depthIndex(profile.depth);
  const why = profile.overridden
    ? `${UT[profile.undertone]} undertone, set by you`
    : [whyString(profile.signals), profile.neutralConfirm === 'yes' ? 'gray-green in photos' : '']
        .filter(Boolean)
        .join(', ');
  const { matches } = rankPicks(di, profile.undertone);

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ padding: space[6], paddingBottom: space[8] }}>
        <Eyebrow style={{ marginBottom: space[3] }}>Your result</Eyebrow>
        <Title style={{ fontSize: type.h1, lineHeight: type.h1 * 1.08, marginBottom: space[2] }}>
          You're{' '}
          <Text style={{ color: c.amethystDeep }}>
            {mstCode(profile.depth)}, {UT[profile.undertone].toLowerCase()}
          </Text>
          .
        </Title>
        <Body style={{ marginBottom: space[5] }}>
          {profile.overridden ? why : `Based on ${why}.`} From here, Neu starts from people
          who share it.
        </Body>

        <View
          style={{
            backgroundColor: c.surface,
            borderColor: c.line,
            borderWidth: 1,
            borderRadius: 20,
            padding: space[5],
            marginBottom: space[5],
          }}>
          <Text
            style={{
              fontFamily: font.mono,
              fontSize: type.micro,
              letterSpacing: 0.9,
              textTransform: 'uppercase',
              color: c.ink3,
              marginBottom: space[3],
            }}>
            Monk Skin Tone Scale
          </Text>
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            {mst.map((hex, i) => (
              <ToneSwatch key={hex} color={hex} size={22} selected={i === di - 1} />
            ))}
          </View>
        </View>

        <Body style={{ marginBottom: space[2], fontSize: type.cap }}>
          Not quite right? Set it yourself.
        </Body>
        <View style={{ flexDirection: 'row', gap: space[2], marginBottom: space[7] }}>
          {(Object.keys(UT) as Undertone[]).map((ut) => (
            <Chip
              key={ut}
              label={UT[ut]}
              selected={profile.undertone === ut}
              onPress={() => setProfile({ ...profile, undertone: ut, overridden: true })}
            />
          ))}
        </View>

        <Eyebrow style={{ marginBottom: space[2] }}>Curated starter picks</Eyebrow>
        <Body style={{ marginBottom: space[4], fontSize: type.cap }}>
          Hand-picked for {mstCode(profile.depth)} {UT[profile.undertone].toLowerCase()}.
          Real community posts land with the beta.
        </Body>
        <View style={{ marginBottom: space[7] }}>
          <Grid picks={matches} savedIds={savedIds} toggleSaved={toggleSaved} />
        </View>

        <Button label="Enter Neu" onPress={() => router.replace('/(tabs)')} />
        <Button
          label="Retake the quiz"
          variant="quiet"
          onPress={() => router.replace('/quiz')}
          style={{ marginTop: space[3] }}
        />
      </ScrollView>
    </Screen>
  );
}
