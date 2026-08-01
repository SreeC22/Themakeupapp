import { useState } from 'react';
import { ScrollView, TextInput, View } from 'react-native';

import { Body, Button, Chip, Eyebrow, Grid, Screen, Title, usePalette } from '../../components/neu';
import {
  Category,
  CATEGORY_LABEL,
  pickMatches,
  STARTER_PICKS,
} from '../../data/starter-picks';
import { useAppState } from '../../lib/app-state';
import { depthIndex } from '../../lib/tone';
import { font, radius, space, type } from '../../theme/tokens';

const CATS: (Category | 'all')[] = ['all', 'base', 'spf', 'blush', 'lip'];

export default function Discover() {
  const c = usePalette();
  const { profile, savedIds, toggleSaved } = useAppState();
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState<Category | 'all'>('all');
  const [myTone, setMyTone] = useState(false);

  const q = query.trim().toLowerCase();
  const results = STARTER_PICKS.filter((p) => {
    if (cat !== 'all' && p.category !== cat) return false;
    if (q && !`${p.brand} ${p.name}`.toLowerCase().includes(q)) return false;
    if (myTone && profile && !pickMatches(p, depthIndex(profile.depth), profile.undertone))
      return false;
    return true;
  });

  function clearAll() {
    setQuery('');
    setCat('all');
    setMyTone(false);
  }

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={{ padding: space[6], paddingBottom: space[8] }}
        keyboardShouldPersistTaps="handled">
        <Eyebrow style={{ marginBottom: 2 }}>Discover</Eyebrow>
        <Title style={{ marginBottom: space[4] }}>Every pick, any tone</Title>

        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search brand or product"
          placeholderTextColor={c.ink3}
          style={{
            fontFamily: font.body,
            fontSize: type.body,
            color: c.ink,
            backgroundColor: c.paperSink,
            borderRadius: radius.md,
            paddingHorizontal: space[4],
            paddingVertical: 12,
            marginBottom: space[4],
          }}
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: space[2], paddingBottom: space[5] }}>
          {profile ? (
            <Chip label="My tone" selected={myTone} onPress={() => setMyTone(!myTone)} />
          ) : null}
          {CATS.map((k) => (
            <Chip
              key={k}
              label={k === 'all' ? 'All' : CATEGORY_LABEL[k]}
              selected={cat === k}
              onPress={() => setCat(k)}
            />
          ))}
        </ScrollView>

        {results.length > 0 ? (
          <Grid picks={results} savedIds={savedIds} toggleSaved={toggleSaved} />
        ) : (
          <View style={{ gap: space[4] }}>
            <Body>
              No matches
              {myTone ? ' for your tone with these filters' : ' with these filters'}.
            </Body>
            <Button label="Clear filters" variant="soft" onPress={clearAll} />
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}
