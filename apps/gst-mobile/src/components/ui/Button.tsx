import { Pressable, StyleSheet, Text, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { colors, radius, spacing, typography } from '@/src/theme/tokens'

export function Button(props: {
  label: string
  onPress: () => void
  variant?: 'primary' | 'secondary' | 'ghost'
  iconLeft?: React.ReactNode
  disabled?: boolean
}) {
  const variant = props.variant ?? 'primary'
  const style =
    variant === 'primary'
      ? styles.primary
      : variant === 'secondary'
        ? styles.secondary
        : styles.ghost

  const textStyle =
    variant === 'primary' ? styles.primaryText : variant === 'secondary' ? styles.secondaryText : styles.ghostText

  return (
    <Pressable
      onPress={props.onPress}
      disabled={props.disabled}
      style={({ pressed }) => [style, pressed && styles.pressed, props.disabled && styles.disabled]}
    >
      {variant === 'primary' ? (
        <LinearGradient colors={[colors.primary, colors.primaryContainer]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.gradient}>
          <View style={styles.inner}>
            {props.iconLeft ? <View style={styles.icon}>{props.iconLeft}</View> : null}
            <Text style={textStyle}>{props.label}</Text>
          </View>
        </LinearGradient>
      ) : (
        <View style={styles.inner}>
          {props.iconLeft ? <View style={styles.icon}>{props.iconLeft}</View> : null}
          <Text style={textStyle}>{props.label}</Text>
        </View>
      )}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  inner: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginTop: 1,
  },
  primary: {
    borderRadius: radius.pill,
    minHeight: 56,
    overflow: 'hidden',
    shadowColor: colors.primary,
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },
  gradient: {
    minHeight: 56,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: radius.pill,
    justifyContent: 'center',
  },
  primaryText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: typography.body,
    letterSpacing: 0.2,
  },
  secondary: {
    backgroundColor: 'transparent',
    borderRadius: radius.pill,
    paddingVertical: 12,
    paddingHorizontal: 14,
    minHeight: 56,
  },
  secondaryText: {
    color: colors.accent,
    fontWeight: '900',
    fontSize: typography.body,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderRadius: radius.control,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  ghostText: {
    color: colors.tertiary,
    fontWeight: '800',
    fontSize: typography.body,
  },
  pressed: {
    opacity: 0.85,
  },
  disabled: {
    opacity: 0.5,
  },
})

