import { ScrollView } from 'react-native';

import { Body, Eyebrow, Grid, Screen, Title } from '../../components/neu';
import { STARTER_PICKS } from '../../data/starter-picks';
import { useAppState } from '../../lib/app-state';
import { space } from '../../theme/tokens';

export default function Saved() {
  const { savedIds, toggleSaved } = useAppState();
  const picks = STARTER_PICKS.filter((p) => savedIds.includes(p.id));

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ padding: space[6], paddingBottom: space[8] }}>
        <Eyebrow style={{ marginBottom: 2 }}>Saved</Eyebrow>
        {picks.length > 0 ? (
          <>
            <Title style={{ marginBottom: space[5] }}>Your shelf</Title>
            <Grid picks={picks} savedIds={savedIds} toggleSaved={toggleSaved} />
          </>
        ) : (
          <>
            <Title style={{ marginBottom: space[2] }}>Nothing saved yet</Title>
            <Body>Tap the heart on any pick and it lands here. Saves stay on this phone
            until you make an account.</Body>
          </>
        )}
      </ScrollView>
    </Screen>
  );
}
