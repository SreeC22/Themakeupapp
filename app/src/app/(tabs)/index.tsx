import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import { Body, Button, Chip, Eyebrow, Grid, Screen, Title } from '../../components/neu';
import {
  Category,
  CATEGORY_LABEL,
  rankPicks,
  STARTER_PICKS,
} from '../../data/starter-picks';
import { useAppState } from '../../lib/app-state';
import { depthIndex, mstCode, UT } from '../../lib/tone';
import { space, type } from '../../theme/tokens';

const CATS: (Category | 'all')[] = ['all', 'base', 'spf', 'blush', 'lip'];

export default function ForYou() {
  const { profile, savedIds, toggleSaved } = useAppState();
  const [cat, setCat] = useState<Category | 'all'>('all');

  const category = cat === 'all' ? undefined : cat;

  if (!profile) {
    return (
      <Screen>
        <ScrollView contentContainerStyle={{ padding: space[6] }}>
          <Eyebrow style={{ marginBottom: space[2] }}>For you</Eyebrow>
          <Title style={{ marginBottom: space[2] }}>First, find your tone</Title>
          <Body style={{ marginBottom: space[5] }}>
            30 seconds, no camera. Then this feed starts from skin like yours.
          </Body>
          <Button label="Find my tone" onPress={() => router.push('/quiz')} />
          <View style={{ height: space[7] }} />
          <Eyebrow style={{ marginBottom: space[4] }}>Curated starter picks</Eyebrow>
          <Grid
            picks={STARTER_PICKS}
            savedIds={savedIds}
            toggleSaved={toggleSaved}
          />
        </ScrollView>
      </Screen>
    );
  }

  const di = depthIndex(profile.depth);
  const { matches, near } = rankPicks(di, profile.undertone, category);

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ padding: space[6], paddingBottom: space[8] }}>
        <Eyebrow style={{ marginBottom: 2 }}>
          For you · {mstCode(profile.depth)} {UT[profile.undertone]}
        </Eyebrow>
        <Title style={{ marginBottom: space[4] }}>What works on skin like yours</Title>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: space[2], paddingBottom: space[5] }}>
          {CATS.map((k) => (
            <Chip
              key={k}
              label={k === 'all' ? 'All' : CATEGORY_LABEL[k]}
              selected={cat === k}
              onPress={() => setCat(k)}
            />
          ))}
        </ScrollView>

        {matches.length > 0 ? (
          <Grid picks={matches} savedIds={savedIds} toggleSaved={toggleSaved} />
        ) : (
          <Body style={{ marginBottom: space[5] }}>
            Nothing in this category for your tone yet. The beta fills this space with real
            posts from your tone twins.
          </Body>
        )}

        {near.length > 0 ? (
          <View style={{ marginTop: space[6] }}>
            <Eyebrow style={{ marginBottom: space[4] }}>Close to your tone</Eyebrow>
            <Grid picks={near} savedIds={savedIds} toggleSaved={toggleSaved} />
          </View>
        ) : null}

        <Body style={{ marginTop: space[6], fontSize: type.cap }}>
          Starter picks are curated by Neu, labeled as such, and tone-tagged by hand. No
          invented users, ever.
        </Body>
      </ScrollView>
    </Screen>
  );
}
