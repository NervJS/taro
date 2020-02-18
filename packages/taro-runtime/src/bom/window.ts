import { navigator } from './navigator'
import { document } from './document'
import { isBrowser, win } from '../env'

export const window = isBrowser ? win : {
  navigator,
  document
}
