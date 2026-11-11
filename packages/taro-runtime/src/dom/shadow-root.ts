import { TaroElement } from './element'

// For Vue's instanceof checks only; mini programs do not support shadow DOM.
export class ShadowRoot extends TaroElement {}
