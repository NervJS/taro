import { HydratedData } from './index'

export type UpdatePayloadValue = string | boolean | HydratedData
export type DataTree = Record<string, UpdatePayloadValue | ReturnType<HydratedData>>
export interface UpdatePayload {
  path: string
  value: UpdatePayloadValue
}
