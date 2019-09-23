import { TaroRootElement } from './root'

interface Current {
  root: null | TaroRootElement;
}

export const Current: Current = {
  root: null
}
