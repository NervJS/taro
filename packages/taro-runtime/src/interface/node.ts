import { HydratedData } from './index'

export type UpdatePayloadValue = string | boolean | string[] | null | HydratedData
export type DataTree = Record<string, UpdatePayloadValue | ReturnType<HydratedData>>
export interface UpdatePayload {
  path: string
  value: UpdatePayloadValue
}
