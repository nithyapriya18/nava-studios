import { useNavigation } from '@react-navigation/native'
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import * as Clipboard from 'expo-clipboard'
import { MaterialIcons } from '@expo/vector-icons'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Modal, Pressable, ScrollView, Share, StyleSheet, Text, TextInput, View } from 'react-native'
import { computeFromInclusiveTotal, computeFromTaxableValue, getSupplyType, type SupplyType } from '@/src/lib/gst'
import { MAX_AMOUNT, MAX_GST_RATE, sanitizeNumberText, toSafeNumber } from '@/src/lib/sanitize'
import { formatIndianRupee } from '@/src/lib/formatIndian'
import { HSN_SAC_ENTRIES, type HsnSacEntry } from '@/src/data/hsnSac'
import { searchHsn } from '@/src/lib/searchHsn'
import { Button } from '@/src/components/ui/Button'
import { TextField } from '@/src/components/ui/TextField'
import { appStyles } from '@/src/theme/styles'
import { colors, radius, spacing, typography } from '@/src/theme/tokens'
import { t } from '@/src/i18n/translations'
import { useAppSettings } from '@/src/context/AppSettingsContext'
import { useHistory } from '@/src/context/HistoryContext'
import type { MainTabParamList } from '@/src/navigation/types'

type Nav = BottomTabNavigationProp<MainTabParamList, 'Calculate'>
type Mode = 'add' | 'remove'

const RATE_CARDS = [
  { rate: '5', title: 'Food & essentials', icon: 'restaurant' as const },
  { rate: '12', title: 'Services', icon: 'business-center' as const },
  { rate: '18', title: 'Standard goods', icon: 'devices' as const },
  { rate: '28', title: 'Luxury items', icon: 'diamond' as const },
]

export function CalculatorScreen() {
  const navigation = useNavigation<Nav>()
  const { supplierState, customerState, defaultGstRate, language, autoSaveHistory } = useAppSettings()
  const { addEntry } = useHistory()
  const lang = language

  const [amountText, setAmountText] = useState('100000')
  const [gstRate, setGstRate] = useState(defaultGstRate)
  const [mode, setMode] = useState<Mode>('add')
  const [supplyType, setSupplyType] = useState<SupplyType>(getSupplyType(supplierState, customerState))
  const [customOpen, setCustomOpen] = useState(false)
  const [productQuery, setProductQuery] = useState('')
  const [productOpen, setProductOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<HsnSacEntry | null>(null)

  useEffect(() => {
    setGstRate(defaultGstRate)
    setSupplyType(getSupplyType(supplierState, customerState))
  }, [customerState, defaultGstRate, supplierState])

  const gstRateNumber = toSafeNumber(gstRate, MAX_GST_RATE)
  const amount = toSafeNumber(amountText, MAX_AMOUNT)
  const productMatches = useMemo(() => searchHsn(HSN_SAC_ENTRIES, productQuery, 10), [productQuery])

  const breakdown = useMemo(() => {
    if (mode === 'add') {
      return computeFromTaxableValue({ taxableValue: amount, gstRatePercent: gstRateNumber, supplyType })
    }
    return computeFromInclusiveTotal({ totalInclusive: amount, gstRatePercent: gstRateNumber, supplyType })
  }, [amount, gstRateNumber, mode, supplyType])

  const resultTextLines = useMemo(
    () =>
      [
        `GST SUMMARY`,
        `GST Rate: ${gstRateNumber}%`,
        selectedProduct ? `Product: ${selectedProduct.description} (${selectedProduct.code})` : null,
        `${supplyType === 'intra' ? 'Within state' : 'Inter-state'} (${supplyType === 'intra' ? 'CGST + SGST' : 'IGST'})`,
        `Base: ${formatIndianRupee(breakdown.taxableValue)}`,
        supplyType === 'intra'
          ? `CGST: ${formatIndianRupee(breakdown.cgst)} · SGST: ${formatIndianRupee(breakdown.sgst)}`
          : `IGST: ${formatIndianRupee(breakdown.igst)}`,
        `Total GST: ${formatIndianRupee(breakdown.totalGst)}`,
        `Grand Total: ${formatIndianRupee(breakdown.total)}`,
      ]
        .filter(Boolean)
        .join('\n'),
    [breakdown, gstRateNumber, selectedProduct, supplyType],
  )

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => {
    if (!autoSaveHistory || amount <= 0) return
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      addEntry({
        kind: 'calc',
        title: `${formatIndianRupee(breakdown.total)} · ${gstRateNumber}%`,
        body: resultTextLines,
        inputAmount: amount,
        gstRateLabel: `${gstRateNumber}%`,
        grandTotal: breakdown.total,
      })
    }, 1200)
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current)
    }
  }, [addEntry, amount, autoSaveHistory, breakdown.total, gstRateNumber, resultTextLines])

  async function onCopy() {
    await Clipboard.setStringAsync(resultTextLines)
  }

  async function onShare() {
    await Share.share({ message: resultTextLines })
  }

  return (
    <ScrollView contentContainerStyle={styles.wrap} keyboardShouldPersistTaps="handled">
      <Text style={styles.overline}>GST COMPLIANCE</Text>
      <Text style={styles.hero}>Tax Engine</Text>

      <View style={styles.inputCard}>
        <View style={styles.inputAccent} />
        <Text style={styles.inputLabel}>PRINCIPAL AMOUNT</Text>
        <View style={styles.inputRow}>
          <Text style={styles.rupee}>₹</Text>
          <TextInput
            value={amountText}
            onChangeText={(v) => setAmountText(sanitizeNumberText(v))}
            keyboardType="numeric"
            style={styles.amountInput}
            placeholder="1,00,000"
            placeholderTextColor={colors.outline}
          />
        </View>
      </View>

      <View style={styles.segmentWrap}>
        <Pressable
          onPress={() => setSupplyType('intra')}
          style={[styles.segmentBtn, supplyType === 'intra' ? styles.segmentActive : null]}
        >
          <Text style={[styles.segmentText, supplyType === 'intra' ? styles.segmentTextActive : null]}>Within State (CGST + SGST)</Text>
        </Pressable>
        <Pressable
          onPress={() => setSupplyType('inter')}
          style={[styles.segmentBtn, supplyType === 'inter' ? styles.segmentActive : null]}
        >
          <Text style={[styles.segmentText, supplyType === 'inter' ? styles.segmentTextActive : null]}>Inter-State (IGST)</Text>
        </Pressable>
      </View>

      <Text style={styles.sectionOverline}>SELECT RATE CATEGORY</Text>
      <View style={styles.productSearchBlock}>
        <TextInput
          value={productQuery}
          onChangeText={(v) => {
            setProductQuery(v)
            if (!v.trim()) setSelectedProduct(null)
            setProductOpen(true)
          }}
          onFocus={() => setProductOpen(true)}
          placeholder="Search product type (HSN/SAC)"
          placeholderTextColor={colors.outline}
          style={styles.productInput}
        />
        {selectedProduct ? (
          <Text style={styles.productSelected}>
            {selectedProduct.code} · {selectedProduct.description}
          </Text>
        ) : null}
        {productOpen && productQuery.trim().length > 0 ? (
          <View style={styles.productDropdown}>
            {productMatches.length === 0 ? (
              <Text style={styles.productEmpty}>No matching products</Text>
            ) : (
              productMatches.map((item) => (
                <Pressable
                  key={`${item.code}-${item.description}`}
                  onPress={() => {
                    setSelectedProduct(item)
                    setGstRate(String(item.gstRatePercent))
                    setProductQuery(item.description)
                    setProductOpen(false)
                  }}
                  style={({ pressed }) => [styles.productOption, pressed && { opacity: 0.85 }]}
                >
                  <Text style={styles.productOptionCode}>
                    {item.code} · {item.gstRatePercent}%
                  </Text>
                  <Text style={styles.productOptionDesc}>{item.description}</Text>
                </Pressable>
              ))
            )}
          </View>
        ) : null}
      </View>
      <View style={styles.rateGrid}>
        {RATE_CARDS.map((card) => {
          const active = gstRate === card.rate
          return (
            <Pressable
              key={card.rate}
              onPress={() => setGstRate(card.rate)}
              style={[styles.rateCard, active ? styles.rateCardActive : null]}
            >
              <Text style={[styles.rateTitle, active ? styles.rateTitleActive : null]}>{card.title.toUpperCase()}</Text>
              <View style={styles.rateBottom}>
                <Text style={[styles.rateValue, active ? styles.rateValueActive : null]}>{card.rate}%</Text>
                <MaterialIcons name={card.icon} size={18} color={active ? colors.chipTextActive : colors.tertiary} />
              </View>
            </Pressable>
          )
        })}
        <Pressable onPress={() => setCustomOpen(true)} style={styles.customRow}>
          <View style={styles.customLeft}>
            <MaterialIcons name="tune" size={16} color={colors.outline} />
            <Text style={styles.customText}>Manual Adjustment</Text>
          </View>
          <Text style={styles.customValue}>Custom %</Text>
        </Pressable>
      </View>

      <View style={styles.breakdownCard}>
        <View style={styles.breakdownRow}>
          <Text style={styles.breakLabel}>Base Amount</Text>
          <Text style={styles.breakValue}>{formatIndianRupee(breakdown.taxableValue)}</Text>
        </View>
        {supplyType === 'intra' ? (
          <>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakLabel}>CGST ({(gstRateNumber / 2).toFixed(1)}%)</Text>
              <Text style={styles.breakValue}>{formatIndianRupee(breakdown.cgst)}</Text>
            </View>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakLabel}>SGST ({(gstRateNumber / 2).toFixed(1)}%)</Text>
              <Text style={styles.breakValue}>{formatIndianRupee(breakdown.sgst)}</Text>
            </View>
          </>
        ) : (
          <View style={styles.breakdownRow}>
            <Text style={styles.breakLabel}>IGST ({gstRateNumber}%)</Text>
            <Text style={styles.breakValue}>{formatIndianRupee(breakdown.igst)}</Text>
          </View>
        )}
        <View style={styles.totalBlock}>
          <Text style={styles.totalOver}>TOTAL PAYABLE</Text>
          <Text style={styles.totalValue}>{formatIndianRupee(breakdown.total)}</Text>
        </View>
      </View>

      <Button
        label="Generate Invoice"
        iconLeft={<MaterialIcons name="receipt-long" size={18} color="#fff" />}
        onPress={() => navigation.navigate('Invoice')}
      />
      <View style={{ height: spacing.sm }} />
      <View style={styles.quickActions}>
        <Button label={t(lang, 'copySummary')} variant="secondary" onPress={() => void onCopy()} />
        <Button label={t(lang, 'share')} variant="secondary" onPress={() => void onShare()} />
      </View>

      <Modal visible={customOpen} animationType="fade" transparent>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={appStyles.sectionTitle}>{t(lang, 'customRate')}</Text>
            <TextField
              label={t(lang, 'gstRate')}
              value={gstRate}
              onChange={(v) => setGstRate(sanitizeNumberText(v))}
              keyboardType="numeric"
              placeholder="18"
            />
            <Button label={t(lang, 'done')} onPress={() => setCustomOpen(false)} />
          </View>
        </View>
      </Modal>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
    backgroundColor: colors.bg,
  },
  overline: {
    marginTop: spacing.sm,
    color: colors.primaryContainer,
    fontWeight: '800',
    letterSpacing: 2,
    fontSize: 11,
  },
  hero: {
    color: colors.text,
    fontSize: 42,
    fontWeight: '900',
    letterSpacing: -1,
    marginBottom: spacing.lg,
  },
  inputCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.control,
    padding: spacing.lg,
    paddingLeft: spacing.xl,
    marginBottom: spacing.md,
    shadowColor: '#191C1E',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    position: 'relative',
  },
  inputAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    borderTopLeftRadius: radius.control,
    borderBottomLeftRadius: radius.control,
    backgroundColor: colors.primaryContainer,
  },
  inputLabel: {
    color: colors.accent,
    fontWeight: '900',
    letterSpacing: 1.2,
    fontSize: 11,
    marginBottom: spacing.sm,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: colors.surfaceHighest,
    paddingBottom: spacing.xs,
  },
  rupee: {
    color: colors.text,
    fontSize: 34,
    opacity: 0.6,
    marginRight: spacing.sm,
  },
  amountInput: {
    flex: 1,
    color: colors.text,
    fontWeight: '900',
    fontSize: 42,
    letterSpacing: -1,
  },
  segmentWrap: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.pill,
    padding: 4,
    flexDirection: 'row',
    marginBottom: spacing.lg,
  },
  segmentBtn: {
    flex: 1,
    borderRadius: radius.pill,
    paddingVertical: 11,
    paddingHorizontal: spacing.sm,
  },
  segmentActive: {
    backgroundColor: colors.surface,
  },
  segmentText: {
    textAlign: 'center',
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },
  segmentTextActive: {
    color: colors.accent,
  },
  sectionOverline: {
    color: colors.outline,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.3,
    marginBottom: spacing.sm,
  },
  rateGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  productSearchBlock: {
    marginBottom: spacing.sm,
    zIndex: 5,
  },
  productInput: {
    backgroundColor: colors.surface,
    borderRadius: radius.control,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    color: colors.text,
    fontWeight: '700',
    fontSize: typography.body,
  },
  productSelected: {
    color: colors.accent,
    fontSize: typography.small,
    fontWeight: '700',
    marginTop: spacing.xs,
  },
  productDropdown: {
    marginTop: spacing.xs,
    backgroundColor: colors.surface,
    borderRadius: radius.control,
    paddingVertical: spacing.xs,
    shadowColor: '#191C1E',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  productOption: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  productOptionCode: {
    color: colors.text,
    fontWeight: '900',
    fontSize: typography.small,
  },
  productOptionDesc: {
    color: colors.textMuted,
    marginTop: 2,
    fontWeight: '600',
    fontSize: typography.small,
  },
  productEmpty: {
    color: colors.textMuted,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontWeight: '700',
  },
  rateCard: {
    width: '48%',
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.control,
    padding: spacing.md,
    minHeight: 95,
  },
  rateCardActive: {
    backgroundColor: colors.primaryContainer,
  },
  rateTitle: {
    color: colors.tertiary,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: spacing.sm,
  },
  rateTitleActive: {
    color: colors.chipTextActive,
    opacity: 0.9,
  },
  rateBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rateValue: {
    color: colors.text,
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: -0.8,
  },
  rateValueActive: {
    color: colors.chipTextActive,
  },
  customRow: {
    width: '100%',
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  customLeft: {
    flexDirection: 'row',
    gap: spacing.xs,
    alignItems: 'center',
  },
  customText: {
    color: colors.textMuted,
    fontWeight: '700',
    fontSize: typography.small,
  },
  customValue: {
    color: colors.text,
    fontWeight: '900',
    fontSize: typography.body,
  },
  breakdownCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.control,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  breakLabel: {
    color: colors.textMuted,
    fontWeight: '600',
    fontSize: typography.small,
  },
  breakValue: {
    color: colors.text,
    fontWeight: '800',
    fontSize: typography.small,
  },
  totalBlock: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
  },
  totalOver: {
    color: colors.primaryContainer,
    fontWeight: '900',
    letterSpacing: 1.4,
    fontSize: 10,
    marginBottom: spacing.xs,
  },
  totalValue: {
    color: colors.primary,
    fontSize: typography.display + 6,
    fontWeight: '900',
    letterSpacing: -0.8,
  },
  quickActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
    padding: spacing.lg,
  },
  modalCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
})
