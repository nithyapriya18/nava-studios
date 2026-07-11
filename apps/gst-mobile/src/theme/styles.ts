import { StyleSheet } from 'react-native'
import { colors, radius, spacing, typography } from './tokens'

export const appStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  title: {
    fontSize: typography.h1,
    fontWeight: '900',
    color: colors.text,
    letterSpacing: -0.6,
  },
  subtitle: {
    marginTop: spacing.xs,
    fontSize: typography.small,
    color: colors.textMuted,
    lineHeight: 20,
  },
  card: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.card,
    padding: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.h2,
    fontWeight: '900',
    color: colors.text,
    marginBottom: spacing.sm,
    letterSpacing: 0.3,
  },
  label: {
    fontSize: typography.small,
    fontWeight: '800',
    color: colors.outline,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  helper: {
    fontSize: typography.small,
    color: colors.textMuted,
    marginTop: spacing.xs,
    lineHeight: 18,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
  },
  divider: {
    height: spacing.md,
    marginVertical: spacing.sm,
  },
})

