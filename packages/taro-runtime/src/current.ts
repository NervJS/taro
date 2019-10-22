import { TaroRootElement } from './dom/root'
import { Instance, AppInstance } from './dsl/instance'

interface Current {
  root: null | TaroRootElement;
  pages: Set<string>;
  activeId: string | null;
  app: AppInstance | null;
  roots: Set<Instance>
}

export const Current: Current = {
  root: null,
  pages: new Set(),
  activeId: null,
  app: null,
  roots: new Set()
}
