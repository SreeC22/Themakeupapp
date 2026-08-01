import { router } from 'expo-router';
import { Text, View } from 'react-native';

import { Body, Button, Screen, ToneSwatch, usePalette } from '../components/neu';
import { font, mst, space, type } from '../theme/tokens';

export default function Welcome() {
  const c = usePalette();
  return (
    <Screen>
      <View style={{ flex: 1, paddingHorizontal: space[6], justifyContent: 'center' }}>
        <Text
          style={{
            fontFamily: font.semi,
            fontSize: type.h3,
            color: c.ink,
            marginBottom: space[7],
          }}>
          neu
        </Text>

        <Text
          style={{
            fontFamily: font.display,
            fontSize: type.h1,
            lineHeight: type.h1 * 1.1,
            letterSpacing: -0.6,
            color: c.ink,
            marginBottom: space[3],
          }}>
          Makeup advice that finally has your face in mind.
        </Text>
        <Body style={{ marginBottom: space[6] }}>
          A 30-second quiz places you on the Monk Skin Tone Scale and works out your
          undertone, olive included. Everything you see starts from your tone.
        </Body>

        <View style={{ flexDirection: 'row', marginBottom: space[8] }}>
          {mst.map((hex, i) => (
            <ToneSwatch key={hex} color={hex} size={22} selected={i === 6} />
          ))}
        </View>

        <Button label="Find my tone" onPress={() => router.push('/quiz')} />
        <Body
          style={{
            textAlign: 'center',
            marginTop: space[3],
            fontSize: type.cap,
          }}>
          No camera, no photos. Just you.
        </Body>
        <Button
          label="I'll look around first"
          variant="quiet"
          onPress={() => router.replace('/(tabs)')}
          style={{ marginTop: space[5] }}
        />
      </View>
    </Screen>
  );
}
