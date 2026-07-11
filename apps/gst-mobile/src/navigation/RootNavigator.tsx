import { NavigationContainer, DefaultTheme } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { useEffect } from 'react'
import { MaterialIcons } from '@expo/vector-icons'
import { CalculatorScreen } from '@/src/screens/CalculatorScreen'
import { HistoryScreen } from '@/src/screens/HistoryScreen'
import { InvoiceScreen } from '@/src/screens/InvoiceScreen'
import { SettingsScreen } from '@/src/screens/SettingsScreen'
import type { MainTabParamList } from '@/src/navigation/types'
import { colors } from '@/src/theme/tokens'
import { t } from '@/src/i18n/translations'
import { useAppSettings } from '@/src/context/AppSettingsContext'
import { useHistory } from '@/src/context/HistoryContext'
import { exportHtmlAsPdf } from '@/src/lib/pdf'
import { isNotificationsSupported, rescheduleGstReminders } from '@/src/lib/reminders'

const Tab = createBottomTabNavigator<MainTabParamList>()

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.bg,
  },
}

function HistoryRoute() {
  const { entries, clear } = useHistory()
  return <HistoryScreen entries={entries} onClear={clear} />
}

function InvoiceRoute() {
  return <InvoiceScreen onExportPdf={exportHtmlAsPdf} />
}

export function RootNavigator() {
  const { language, filingFrequency, hydrated } = useAppSettings()
  const lang = language

  useEffect(() => {
    if (!hydrated || !isNotificationsSupported) return
    void rescheduleGstReminders(filingFrequency)
  }, [filingFrequency, hydrated])

  return (
    <NavigationContainer theme={navTheme}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.tertiary,
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
            marginBottom: 2,
          },
          tabBarStyle: {
            backgroundColor: colors.surface,
            borderTopColor: 'transparent',
            borderTopWidth: 0,
            elevation: 0,
            height: 72,
            paddingTop: 6,
            paddingBottom: 8,
          },
        }}
      >
        <Tab.Screen
          name="Calculate"
          component={CalculatorScreen}
          options={{
            tabBarLabel: t(lang, 'tabCalculate'),
            tabBarIcon: ({ color, size }) => <MaterialIcons name="calculate" size={size} color={color} />,
          }}
        />
        <Tab.Screen
          name="History"
          component={HistoryRoute}
          options={{
            tabBarLabel: t(lang, 'historyTitle'),
            tabBarIcon: ({ color, size }) => <MaterialIcons name="history" size={size} color={color} />,
          }}
        />
        <Tab.Screen
          name="Invoice"
          component={InvoiceRoute}
          options={{
            tabBarLabel: t(lang, 'tabInvoice'),
            tabBarIcon: ({ color, size }) => <MaterialIcons name="description" size={size} color={color} />,
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            tabBarLabel: t(lang, 'settingsTitle'),
            tabBarIcon: ({ color, size }) => <MaterialIcons name="settings" size={size} color={color} />,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  )
}
