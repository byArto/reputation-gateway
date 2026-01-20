"use client"

import { PrivyProvider as BasePrivyProvider } from '@privy-io/react-auth'
import { ReactNode } from 'react'

interface PrivyProviderProps {
  children: ReactNode
}

export default function PrivyProvider({ children }: PrivyProviderProps) {
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID!

  return (
    <BasePrivyProvider
      appId={appId}
      config={{
        appearance: {
          theme: 'light',
          accentColor: '#1E3A5F',
        },
        embeddedWallets: {
          createOnLogin: 'off',
        },
        externalWallets: {
          coinbaseWallet: false,
          metamask: true,
          rainbow: false,
        },
      }}
    >
      {children}
    </BasePrivyProvider>
  )
}
