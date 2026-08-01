// Neu primitives, ported from the design system components.
// Source of truth: "Neu Design System/components/". Keep visual
// decisions there; this file mirrors them in React Native.

import { LinearGradient } from 'expo-linear-gradient';
import { ReactNode } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextStyle,
  useColorScheme,
  View,
  ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { StarterPick } from '../data/starter-picks';
import { dark, font, light, Palette, radius, shadow, space, type } from '../theme/tokens';

export function usePalette(): Palette {
  return useColorScheme() === 'dark' ? dark : light;
}

export function Screen({ children, style }: { children: ReactNode; style?: ViewStyle }) {
  const c = usePalette();
  return (
    <SafeAreaView style={[{ flex: 1, backgroundColor: c.paper }, style]}>
      {children}
    </SafeAreaView>
  );
}

export function Eyebrow({ children, style }: { children: ReactNode; style?: TextStyle }) {
  const c = usePalette();
  return (
    <Text
      style={[
        {
          fontFamily: font.mono,
          fontSize: type.micro,
          letterSpacing: 1.1,
          textTransform: 'uppercase',
          color: c.amethystDeep,
        },
        style,
      ]}>
      {children}
    </Text>
  );
}

export function Title({ children, style }: { children: ReactNode; style?: TextStyle }) {
  const c = usePalette();
  return (
    <Text
      style={[
        {
          fontFamily: font.display,
          fontSize: type.h2,
          lineHeight: type.h2 * 1.14,
          letterSpacing: -0.4,
          color: c.ink,
        },
        style,
      ]}>
      {children}
    </Text>
  );
}

export function Body({ children, style }: { children: ReactNode; style?: TextStyle }) {
  const c = usePalette();
  return (
    <Text
      style={[
        {
          fontFamily: font.body,
          fontSize: type.sm + 1,
          lineHeight: (type.sm + 1) * 1.5,
          color: c.ink2,
        },
        style,
      ]}>
      {children}
    </Text>
  );
}

export function Mono({ children, style }: { children: ReactNode; style?: TextStyle }) {
  const c = usePalette();
  return (
    <Text style={[{ fontFamily: font.mono, fontSize: type.cap, color: c.ink2 }, style]}>
      {children}
    </Text>
  );
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  style,
}: {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'quiet' | 'soft';
  style?: ViewStyle;
}) {
  const c = usePalette();
  const bg =
    variant === 'primary' ? c.action : variant === 'soft' ? c.amethystSoft : 'transparent';
  const fg =
    variant === 'primary' ? c.actionText : variant === 'soft' ? c.amethystDeep : c.ink;
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          backgroundColor: bg,
          borderRadius: radius.pill,
          paddingVertical: 14,
          paddingHorizontal: space[6],
          alignItems: 'center',
          borderWidth: variant === 'quiet' ? StyleSheet.hairlineWidth : 0,
          borderColor: c.lineStrong,
          transform: [{ scale: pressed ? 0.97 : 1 }],
        },
        style,
      ]}>
      <Text style={{ fontFamily: font.semi, fontSize: type.body, color: fg }}>{label}</Text>
    </Pressable>
  );
}

export function Chip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected?: boolean;
  onPress?: () => void;
}) {
  const c = usePalette();
  return (
    <Pressable
      onPress={onPress}
      style={{
        backgroundColor: selected ? c.action : c.surface,
        borderColor: selected ? c.action : c.line,
        borderWidth: 1,
        borderRadius: radius.pill,
        paddingVertical: 7,
        paddingHorizontal: 14,
      }}>
      <Text
        style={{
          fontFamily: font.body,
          fontSize: type.cap,
          color: selected ? c.actionText : c.ink2,
        }}>
        {label}
      </Text>
    </Pressable>
  );
}

export function Badge({ label, style }: { label: string; style?: ViewStyle }) {
  const c = usePalette();
  return (
    <View
      style={[
        {
          backgroundColor: c.amethystSoft,
          borderRadius: radius.pill,
          paddingVertical: 3,
          paddingHorizontal: 9,
          alignSelf: 'flex-start',
        },
        style,
      ]}>
      <Text style={{ fontFamily: font.body, fontSize: type.micro + 1, color: c.amethystDeep }}>
        {label}
      </Text>
    </View>
  );
}

// The placement dot: a skin-tone circle inside an amethyst ring.
// Signature primitive (DS readme: "your tone, placed").
export function ToneSwatch({
  color,
  size = 40,
  selected,
  onPress,
}: {
  color: string;
  size?: number;
  selected?: boolean;
  onPress?: () => void;
}) {
  const c = usePalette();
  const dot = (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: c.lineStrong,
      }}
    />
  );
  const ring = selected ? (
    <View
      style={{
        padding: 3,
        borderRadius: (size + 12) / 2,
        borderWidth: 2.5,
        borderColor: c.amethyst,
      }}>
      {dot}
    </View>
  ) : (
    <View style={{ padding: 5.5 }}>{dot}</View>
  );
  return onPress ? <Pressable onPress={onPress}>{ring}</Pressable> : ring;
}

export function QuizOption({
  label,
  sub,
  swatch,
  selected,
  onPress,
}: {
  label: string;
  sub?: string;
  swatch?: string;
  selected?: boolean;
  onPress: () => void;
}) {
  const c = usePalette();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: space[3],
        backgroundColor: selected ? c.amethystSoft : c.surface,
        borderColor: selected ? c.amethyst : c.line,
        borderWidth: selected ? 1.5 : 1,
        borderRadius: radius.md,
        paddingVertical: space[4],
        paddingHorizontal: space[4],
        transform: [{ scale: pressed ? 0.98 : 1 }],
      })}>
      {swatch ? (
        <View
          style={{
            width: 26,
            height: 26,
            borderRadius: 13,
            backgroundColor: swatch,
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: c.lineStrong,
          }}
        />
      ) : null}
      <View style={{ flex: 1 }}>
        <Text style={{ fontFamily: font.semi, fontSize: type.body, color: c.ink }}>
          {label}
        </Text>
        {sub ? (
          <Text
            style={{
              fontFamily: font.body,
              fontSize: type.cap,
              color: c.ink2,
              marginTop: 1,
            }}>
            {sub}
          </Text>
        ) : null}
      </View>
      {selected ? (
        <Text style={{ color: c.amethystDeep, fontSize: type.body }}>✓</Text>
      ) : null}
    </Pressable>
  );
}

// Feed layout A (2-up grid), provisional per CLAUDE.md.
export function Grid({
  picks,
  savedIds,
  toggleSaved,
}: {
  picks: StarterPick[];
  savedIds: string[];
  toggleSaved: (id: string) => void;
}) {
  const rows: StarterPick[][] = [];
  for (let i = 0; i < picks.length; i += 2) rows.push(picks.slice(i, i + 2));
  return (
    <View style={{ gap: space[4] }}>
      {rows.map((row, i) => (
        <View key={i} style={{ flexDirection: 'row', gap: space[4] }}>
          {row.map((p) => (
            <ProductCard
              key={p.id}
              pick={p}
              saved={savedIds.includes(p.id)}
              onToggleSaved={() => toggleSaved(p.id)}
            />
          ))}
          {row.length === 1 ? <View style={{ flex: 1 }} /> : null}
        </View>
      ))}
    </View>
  );
}

export function ProductCard({
  pick,
  saved,
  onToggleSaved,
}: {
  pick: StarterPick;
  saved: boolean;
  onToggleSaved: () => void;
}) {
  const c = usePalette();
  return (
    <View
      style={[
        {
          flex: 1,
          backgroundColor: c.surface,
          borderColor: c.line,
          borderWidth: StyleSheet.hairlineWidth,
          borderRadius: radius.lg,
          overflow: 'hidden',
        },
        shadow.sm,
      ]}>
      <View>
        <LinearGradient
          colors={pick.tint}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ height: 110 }}
        />
        <Pressable
          onPress={onToggleSaved}
          hitSlop={8}
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            width: 30,
            height: 30,
            borderRadius: 15,
            backgroundColor: 'rgba(255,255,255,0.9)',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={{ fontSize: 15, color: saved ? light.berry : light.ink2 }}>
            {saved ? '♥' : '♡'}
          </Text>
        </Pressable>
        <View style={{ position: 'absolute', left: 8, bottom: 8 }}>
          <Badge label={pick.verdicts[0]} />
        </View>
      </View>
      <View style={{ padding: space[3], gap: 2 }}>
        <Text
          style={{
            fontFamily: font.mono,
            fontSize: type.micro,
            letterSpacing: 0.8,
            textTransform: 'uppercase',
            color: c.ink3,
          }}>
          {pick.brand}
        </Text>
        <Text
          numberOfLines={2}
          style={{ fontFamily: font.semi, fontSize: type.sm, color: c.ink }}>
          {pick.name}
        </Text>
        <Text style={{ fontFamily: font.body, fontSize: type.micro + 1, color: c.ink3 }}>
          curated starter pick
        </Text>
      </View>
    </View>
  );
}
