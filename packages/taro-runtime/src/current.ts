import { TaroRootElement } from './dom/root'
import { Component } from 'react'

interface Current {
  root: null | TaroRootElement;
  pages: Set<string>;
  activeId: string | null;
  app: Component | null;
}

export const Current: Current = {
  root: null,
  pages: new Set(),
  activeId: null,
  app: null
}
