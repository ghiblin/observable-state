export const Status = {
  Loading: 'loading',
  Success: 'success',
  Error: 'error',
} as const

export type Statuses = typeof Status[keyof typeof Status];