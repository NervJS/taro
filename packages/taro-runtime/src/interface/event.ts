export interface EventOptions {
  bubbles: boolean
  cancelable: boolean
}

type Target = Record<string, unknown> & { dataset: Record<string, unknown>, id: string }

export interface MpEvent {
  type: string
  detail: Record<string, unknown>
  target: Target
  currentTarget: Target
}
