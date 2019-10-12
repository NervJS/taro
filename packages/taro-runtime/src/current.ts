import { TaroRootElement } from './dom/root'
import { Instance } from './config/instance'

interface Current {
  root: null | TaroRootElement;
  pages: Set<string>;
  activeId: string | null;
  app: Instance | null;
  roots: WeakMap<TaroRootElement, boolean>
}

export const Current: Current = {
  root: null,
  pages: new Set(),
  activeId: null,
  app: null,
  roots: new WeakMap()
}
