import type { NavigatorScreenParams } from '@react-navigation/native'

export type MoreStackParamList = {
  MoreMenu: undefined
  History: undefined
  Reminders: undefined
  Settings: undefined
}

export type MainTabParamList = {
  Calculate: { presetGst?: string } | undefined
  Lookup: undefined
  History: undefined
  Invoice: undefined
  Settings: undefined
  More?: NavigatorScreenParams<MoreStackParamList>
}
