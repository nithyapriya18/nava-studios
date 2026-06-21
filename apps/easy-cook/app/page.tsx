'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { loadPreferences } from '@/lib/storage'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    async function checkSetup() {
      const prefs = await loadPreferences()
      if (prefs?.setupComplete) {
        router.replace('/meal-plan')
      } else {
        router.replace('/onboarding')
      }
    }
    checkSetup()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-8 h-8 rounded-full border-4 border-accent/20 border-t-accent animate-spin" />
    </div>
  )
}
