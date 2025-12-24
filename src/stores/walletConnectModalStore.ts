'use client'

import { create } from 'zustand'

interface WalletConnectModalState {
  isOpen: boolean
  openModal: () => void
  closeModal: () => void
}

export const useWalletConnectModalStore = create<WalletConnectModalState>(
  set => ({
    isOpen: false,
    openModal: () => set({ isOpen: true }),
    closeModal: () => set({ isOpen: false }),
  })
)
