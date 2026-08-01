import Slider from '@react-native-community/slider';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import {
  Body,
  Button,
  Eyebrow,
  QuizOption,
  Screen,
  Title,
  usePalette,
} from '../components/neu';
import { useAppState } from '../lib/app-state';
import {
  depthColor,
  depthName,
  finalUndertone,
  needsNeutralConfirm,
  NeutralConfirm,
  shadeValues,
  Signals,
} from '../lib/tone';
import { font, radius, space, type, veinHues } from '../theme/tokens';

type Step = 'shade' | 'vein' | 'sun' | 'jewel' | 'confirm';
const ORDER: Step[] = ['shade', 'vein', 'sun', 'jewel', 'confirm'];

export default function Quiz() {
  const c = usePalette();
  const { setProfile } = useAppState();
  const [step, setStep] = useState<Step>('shade');
  const [depth, setDepth] = useState(50);
  const [signals, setSignals] = useState<Signals>({});
  const [confirm, setConfirm] = useState<NeutralConfirm | undefined>();

  const total = needsNeutralConfirm(signals) && signals.jewel ? 5 : 4;
  const stepNum = ORDER.indexOf(step) + 1;

  const nearestShade = useMemo(() => {
    let idx = 0;
    let best = Number.MAX_VALUE;
    shadeValues.forEach((sv, k) => {
      const d = Math.abs(sv - depth);
      if (d < best) {
        best = d;
        idx = k;
      }
    });
    return idx;
  }, [depth]);

  function answer(key: 'vein' | 'sun' | 'jewel', val: string) {
    const next = { ...signals, [key]: val } as Signals;
    setSignals(next);
    if (key === 'vein') setStep('sun');
    else if (key === 'sun') setStep('jewel');
    else if (needsNeutralConfirm(next)) setStep('confirm');
    else setTimeout(() => finishWith(next, undefined), 180);
  }

  function finishWith(sig: Signals, conf?: NeutralConfirm) {
    setProfile({
      depth,
      color: depthColor(depth),
      undertone: finalUndertone(sig, conf),
      overridden: false,
      signals: sig,
      neutralConfirm: conf,
      createdAt: new Date().toISOString(),
    });
    router.replace('/result');
  }

  function back() {
    const i = ORDER.indexOf(step);
    if (i === 0) router.back();
    else setStep(ORDER[i - 1]);
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ padding: space[6], paddingBottom: space[8] }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: space[3],
            marginBottom: space[6],
          }}>
          <Pressable onPress={back} hitSlop={10}>
            <Text style={{ fontSize: 22, color: c.ink }}>←</Text>
          </Pressable>
          <View
            style={{
              flex: 1,
              height: 6,
              backgroundColor: c.paperSink,
              borderRadius: radius.pill,
              overflow: 'hidden',
            }}>
            <View
              style={{
                width: `${(stepNum / total) * 100}%`,
                height: '100%',
                backgroundColor: c.amethyst,
              }}
            />
          </View>
          <Text style={{ fontFamily: font.mono, fontSize: type.cap, color: c.ink3 }}>
            {stepNum}/{total}
          </Text>
        </View>

        {step === 'shade' && (
          <View>
            <Eyebrow style={{ marginBottom: space[2] }}>Your depth</Eyebrow>
            <Title style={{ marginBottom: space[2] }}>
              Pick the shade closest to your skin
            </Title>
            <Body style={{ marginBottom: space[5] }}>
              Tap a shade, then slide to fine-tune. Natural light helps.
            </Body>

            <View
              style={{
                alignItems: 'center',
                marginBottom: space[5],
                gap: space[2],
              }}>
              <View
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 36,
                  backgroundColor: depthColor(depth),
                  borderWidth: 2.5,
                  borderColor: c.amethyst,
                }}
              />
              <Text style={{ fontFamily: font.semi, fontSize: type.title, color: c.ink }}>
                {depthName(depth)}
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: 6,
                justifyContent: 'center',
                marginBottom: space[4],
              }}>
              {shadeValues.map((v, i) => (
                <Pressable
                  key={v}
                  onPress={() => setDepth(v)}
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 15,
                    backgroundColor: depthColor(v),
                    borderWidth: i === nearestShade ? 2.5 : 0.5,
                    borderColor: i === nearestShade ? c.amethyst : c.lineStrong,
                  }}
                />
              ))}
            </View>

            <Slider
              minimumValue={0}
              maximumValue={100}
              step={0.5}
              value={depth}
              onValueChange={setDepth}
              minimumTrackTintColor={c.amethyst}
              maximumTrackTintColor={c.paperSink}
              style={{ marginBottom: space[6] }}
            />

            <Button label="Continue" onPress={() => setStep('vein')} />
          </View>
        )}

        {step === 'vein' && (
          <StepBlock
            eyebrow="Your undertone, 1 of 3"
            title="Look at your wrist veins in daylight"
            sub="No veins visible? Pick the last option.">
            <QuizOption
              label="Mostly green"
              swatch={veinHues.warm}
              selected={signals.vein === 'warm'}
              onPress={() => answer('vein', 'warm')}
            />
            <QuizOption
              label="Blue or purple"
              swatch={veinHues.cool}
              selected={signals.vein === 'cool'}
              onPress={() => answer('vein', 'cool')}
            />
            <QuizOption
              label="A mix of both"
              swatch={veinHues.neutral}
              selected={signals.vein === 'neutral'}
              onPress={() => answer('vein', 'neutral')}
            />
            <QuizOption
              label="Hard to tell"
              sub="My skin has a gray-green cast"
              swatch={veinHues.olive}
              selected={signals.vein === 'olive'}
              onPress={() => answer('vein', 'olive')}
            />
          </StepBlock>
        )}

        {step === 'sun' && (
          <StepBlock
            eyebrow="Your undertone, 2 of 3"
            title="In strong sun, your skin usually...">
            <QuizOption
              label="Tans easily"
              selected={signals.sun === 'warm'}
              onPress={() => answer('sun', 'warm')}
            />
            <QuizOption
              label="Burns first"
              selected={signals.sun === 'cool'}
              onPress={() => answer('sun', 'cool')}
            />
            <QuizOption
              label="Burns, then tans"
              selected={signals.sun === 'neutral'}
              onPress={() => answer('sun', 'neutral')}
            />
          </StepBlock>
        )}

        {step === 'jewel' && (
          <StepBlock
            eyebrow="Your undertone, 3 of 3"
            title="Which metal flatters you more?">
            <QuizOption
              label="Gold"
              selected={signals.jewel === 'warm'}
              onPress={() => answer('jewel', 'warm')}
            />
            <QuizOption
              label="Silver"
              selected={signals.jewel === 'cool'}
              onPress={() => answer('jewel', 'cool')}
            />
            <QuizOption
              label="Honestly, both"
              selected={signals.jewel === 'neutral'}
              onPress={() => answer('jewel', 'neutral')}
            />
          </StepBlock>
        )}

        {step === 'confirm' && (
          <StepBlock
            eyebrow="One more"
            title="Does your skin ever look slightly gray or green in photos or against white?"
            sub="This is the olive signal most tools miss.">
            <QuizOption
              label="Yes"
              selected={confirm === 'yes'}
              onPress={() => {
                setConfirm('yes');
                setTimeout(() => finishWith(signals, 'yes'), 180);
              }}
            />
            <QuizOption
              label="No"
              selected={confirm === 'no'}
              onPress={() => {
                setConfirm('no');
                setTimeout(() => finishWith(signals, 'no'), 180);
              }}
            />
            <QuizOption
              label="Not sure"
              selected={confirm === 'unsure'}
              onPress={() => {
                setConfirm('unsure');
                setTimeout(() => finishWith(signals, 'unsure'), 180);
              }}
            />
          </StepBlock>
        )}
      </ScrollView>
    </Screen>
  );
}

function StepBlock({
  eyebrow,
  title,
  sub,
  children,
}: {
  eyebrow: string;
  title: string;
  sub?: string;
  children: React.ReactNode;
}) {
  return (
    <View>
      <Eyebrow style={{ marginBottom: space[2] }}>{eyebrow}</Eyebrow>
      <Title style={{ marginBottom: sub ? space[2] : space[5] }}>{title}</Title>
      {sub ? <Body style={{ marginBottom: space[5] }}>{sub}</Body> : null}
      <View style={{ gap: space[3] }}>{children}</View>
    </View>
  );
}
