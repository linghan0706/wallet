export type StarsPurchase = {
  userId: string
  itemId: string
  transactionId: string
  requestId?: string
  timestamp: number
}

type StarsPurchaseStore = StarsPurchase[]

const GLOBAL_KEY = '__starsPurchases'

function getStore(): StarsPurchaseStore {
  const globalAny = globalThis as typeof globalThis & {
    [GLOBAL_KEY]?: StarsPurchaseStore
  }
  if (!globalAny[GLOBAL_KEY]) {
    globalAny[GLOBAL_KEY] = []
  }
  return globalAny[GLOBAL_KEY]!
}

export function addPurchase(record: StarsPurchase) {
  const store = getStore()
  store.push(record)
}

export function listPurchases(userId: string): StarsPurchase[] {
  const store = getStore()
  return store.filter(purchase => purchase.userId === userId)
}

export function findPurchase(
  itemId: string,
  transactionId: string,
  userId?: string
): StarsPurchase | undefined {
  const store = getStore()
  return store.find(
    purchase =>
      purchase.itemId === itemId &&
      purchase.transactionId === transactionId &&
      (userId ? purchase.userId === userId : true)
  )
}
