import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { DEFAULT_NETWORK } from '@/lib/ton-config'

interface WalletState {
  isConnected: boolean
  address: string | null
  balance: string | null
  network: 'mainnet' | 'testnet'
  connectWallet: (address: string) => void
  disconnectWallet: () => void
  updateBalance: (balance: string) => void
  setNetwork: (network: 'mainnet' | 'testnet') => void
}

export const useWalletStore = create<WalletState>()(
  persist(
    set => ({
      isConnected: false,
      address: null,
      balance: null,
      network: DEFAULT_NETWORK,
      connectWallet: (address: string) => set({ isConnected: true, address }),
      disconnectWallet: () =>
        set({ isConnected: false, address: null, balance: null }),
      updateBalance: (balance: string) => set({ balance }),
      setNetwork: (network: 'mainnet' | 'testnet') => set({ network }),
    }),
    {
      name: 'wallet-storage',
      partialize: state => ({
        isConnected: state.isConnected,
        address: state.address,
        network: state.network,
      }),
    }
  )
)
