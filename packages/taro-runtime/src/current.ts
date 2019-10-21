import { TaroRootElement } from './dom/root'
import { Instance, AppInstance } from './dsl/instance'

interface Current {
  root: null | TaroRootElement;
  pages: Set<string>;
  instances: Map<string, unknown>;
  activeId: string | null;
  app: AppInstance | null;
  roots: Set<Instance>
}

export const Current: Current = {
  root: null,
  pages: new Set(),
  activeId: null,
  app: null,
  roots: new Set(),
  instances: new Map()
}
