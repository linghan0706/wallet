const ITEM_SECRETS: Record<string, string> = {
  'collector-primary': 'SECRET-PRIMARY-ALPHA',
  'collector-intermediate': 'SECRET-INTERMEDIATE-BETA',
  'collector-advanced': 'SECRET-ADVANCED-GAMMA',
  'collector-super': 'SECRET-SUPER-OMEGA',
}

export function getSecretForItem(itemId: string): string | null {
  return ITEM_SECRETS[itemId] ?? null
}
