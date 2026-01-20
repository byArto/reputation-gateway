"use client"

import { PrivyProvider as BasePrivyProvider } from '@privy-io/react-auth'
import { ReactNode } from 'react'

interface PrivyProviderProps {
  children: ReactNode
}

export default function PrivyProvider({ children }: PrivyProviderProps) {
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID

  if (!appId) {
    throw new Error('NEXT_PUBLIC_PRIVY_APP_ID is not defined in environment variables')
  }

  return (
    <BasePrivyProvider
      appId={appId}
      config={{
        appearance: {
          theme: 'light',
          accentColor: '#1E3A5F',
        },
        loginMethods: ['wallet'],
      }}
    >
      {children}
    </BasePrivyProvider>
  )
}
