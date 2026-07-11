import { Linking, StyleSheet, Switch, Text, View } from 'react-native'
import Constants from 'expo-constants'
import { Button } from '@/src/components/ui/Button'
import { ChipGroup } from '@/src/components/ui/ChipGroup'
import { StatePicker } from '@/src/components/ui/StatePicker'
import { TextField } from '@/src/components/ui/TextField'
import { appStyles } from '@/src/theme/styles'
import { colors, spacing } from '@/src/theme/tokens'
import { t } from '@/src/i18n/translations'
import { useAppSettings, type LanguageCode } from '@/src/context/AppSettingsContext'
import { sanitizeNumberText } from '@/src/lib/sanitize'
import { isNotificationsSupported, requestNotificationPermissions, rescheduleGstReminders } from '@/src/lib/reminders'

const PRIVACY_POLICY_URL = 'https://verity-studios.vercel.app/privacy'
const SUPPORT_URL = 'https://verity-studios.vercel.app/support'

export function SettingsScreen() {
  const {
    language,
    setLanguage,
    supplierState,
    customerState,
    setSupplierState,
    setCustomerState,
    defaultGstRate,
    setDefaultGstRate,
    autoSaveHistory,
    setAutoSaveHistory,
    filingFrequency,
    setFilingFrequency,
  } = useAppSettings()
  const lang = language

  const version = Constants.expoConfig?.version ?? '1.0.0'

  async function enableReminders() {
    if (!isNotificationsSupported) return
    const ok = await requestNotificationPermissions()
    if (ok) await rescheduleGstReminders(filingFrequency)
  }

  return (
    <View style={styles.wrap}>
      <View style={styles.titleBlock}>
        <Text style={appStyles.sectionTitle}>{t(lang, 'settingsTitle')}</Text>
        <Text style={appStyles.helper}>Manage your professional environment</Text>
      </View>

      <View style={styles.block}>
        <Text style={styles.blockTitle}>Filing reminders</Text>
        <View style={styles.rowCard}>
          <View style={styles.rowLeft}>
            <Text style={styles.rowTitle}>GSTR-1</Text>
            <Text style={styles.rowMeta}>Outward supplies summary</Text>
          </View>
          <Switch onValueChange={() => void enableReminders()} />
        </View>
        <View style={styles.rowCardAlt}>
          <View style={styles.rowLeft}>
            <Text style={styles.rowTitle}>GSTR-3B</Text>
            <Text style={styles.rowMeta}>Monthly self-declaration</Text>
          </View>
          <Switch onValueChange={() => void enableReminders()} />
        </View>
        <Text style={[appStyles.helper, { marginTop: spacing.sm }]}>
          {!isNotificationsSupported ? t(lang, 'remindersExpoGoUnsupported') : t(lang, 'remindersPermissionNeeded')}
        </Text>
      </View>

      <View style={styles.block}>
        <Text style={styles.blockTitle}>Regional settings</Text>
        <View style={styles.card}>
          <Text style={styles.blockTitle}>{t(lang, 'defaultSupplierState')}</Text>
          <StatePicker label="" value={supplierState} onChange={setSupplierState} />
          <View style={{ height: spacing.sm }} />
          <Text style={styles.blockTitle}>{t(lang, 'defaultCustomerState')}</Text>
          <StatePicker label="" value={customerState} onChange={setCustomerState} />
        </View>

        <View style={styles.cardAlt}>
          <Text style={styles.blockTitle}>{t(lang, 'defaultGstRate')}</Text>
          <TextField
            label="%"
            value={defaultGstRate}
            onChange={(v) => setDefaultGstRate(sanitizeNumberText(v))}
            keyboardType="numeric"
            placeholder="18"
          />
          <Text style={styles.blockTitle}>{t(lang, 'filingFrequency')}</Text>
          <ChipGroup
            value={filingFrequency}
            onChange={(v) => setFilingFrequency(v as 'monthly' | 'quarterly')}
            options={[
              { value: 'monthly', label: t(lang, 'monthly') },
              { value: 'quarterly', label: t(lang, 'quarterly') },
            ]}
          />
          <View style={{ height: spacing.sm }} />
          <Text style={styles.blockTitle}>{t(lang, 'language')}</Text>
          <ChipGroup<LanguageCode>
            value={language}
            onChange={setLanguage}
            options={[
              { value: 'en', label: t(lang, 'english') },
              { value: 'hi', label: t(lang, 'hindi') },
            ]}
          />
        </View>
      </View>

      <View style={[styles.rowBetween, styles.block]}>
        <View style={styles.rowLeft}>
          <Text style={styles.switchLabel}>{t(lang, 'autoSave')}</Text>
          <Text style={styles.rowMeta}>Store summaries automatically</Text>
        </View>
        <Switch value={autoSaveHistory} onValueChange={setAutoSaveHistory} />
      </View>

      <View style={styles.block}>
        <Text style={styles.blockTitle}>System</Text>
        <Button label={t(lang, 'support')} variant="secondary" onPress={() => void Linking.openURL(SUPPORT_URL)} />
        <View style={{ height: spacing.sm }} />
        <Button label={t(lang, 'privacy')} variant="secondary" onPress={() => void Linking.openURL(PRIVACY_POLICY_URL)} />
        <View style={{ height: spacing.sm }} />
        <Text style={styles.value}>
          {t(lang, 'version')}: {version}
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
    backgroundColor: colors.bg,
  },
  titleBlock: {
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    paddingLeft: spacing.sm,
    marginBottom: spacing.md,
  },
  block: {
    marginTop: spacing.lg,
    paddingTop: spacing.lg,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.sm,
  },
  cardAlt: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: 16,
    padding: spacing.lg,
  },
  rowCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  rowCardAlt: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: 16,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowLeft: { flex: 1, paddingRight: spacing.sm },
  rowTitle: { color: colors.text, fontWeight: '800' },
  rowMeta: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  blockTitle: {
    color: colors.outline,
    fontWeight: '900',
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontSize: 12,
  },
  value: {
    color: colors.text,
    fontWeight: '800',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  switchLabel: {
    flex: 1,
    color: colors.text,
    fontWeight: '800',
  },
})
