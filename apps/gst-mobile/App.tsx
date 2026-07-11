import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { NotificationTapHandler } from '@/src/components/NotificationTapHandler'
import { HistoryProvider } from '@/src/context/HistoryContext'
import { RootNavigator } from '@/src/navigation/RootNavigator'
import { appStyles } from '@/src/theme/styles'
import { AppSettingsProvider } from '@/src/context/AppSettingsContext'

function AppInner() {
  return (
    <SafeAreaView style={appStyles.screen}>
      <StatusBar style="dark" />
      <NotificationTapHandler />
      <RootNavigator />
    </SafeAreaView>
  )
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppSettingsProvider>
        <HistoryProvider>
          <AppInner />
        </HistoryProvider>
      </AppSettingsProvider>
    </SafeAreaProvider>
  )
}
