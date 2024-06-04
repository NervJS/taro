import {
  $DEVCOMP,
  ComponentProps,
  createEffect,
  createMemo,
  getOwner,
  JSX,
  onCleanup,
  runWithOwner,
  sharedConfig,
  splitProps,
  untrack,
  ValidComponent
} from 'solid-js'

import { createElement, insert, spread } from './render'

export * from './render'

export function Portal<T extends boolean = false, S extends boolean = false> (props: {
  mount?: Node
  ref?:
  | (S extends true ? SVGGElement : HTMLDivElement)
  | ((
    el: (T extends true ? { readonly shadowRoot: ShadowRoot } : object) & (S extends true ? SVGGElement : HTMLDivElement)
  ) => void)
  children: JSX.Element
}) {
  const marker = document.createTextNode('')
  const mount = () => props.mount || document.body
  const owner = getOwner()
  let content: undefined | (() => JSX.Element)
  let hydrating = !!sharedConfig.context

  createEffect(
    () => {
      // basically we backdoor into a sort of renderEffect here
      if (hydrating) (getOwner() as any).user = hydrating = false
      content || (content = runWithOwner(owner, () => createMemo(() => props.children)))
      const el = mount()
      const container: any = createElement('view')
      const renderRoot = container

      Object.defineProperty(container, '_$host', {
        get () {
          return marker.parentNode
        },
        configurable: true
      })
      insert(renderRoot, content)
      el.appendChild(container)
      props.ref && (props as any).ref(container)
      onCleanup(() => el.removeChild(container))
    },
    undefined,
    { render: !hydrating }
  )
  return marker
}

export type DynamicProps<T extends ValidComponent, P = ComponentProps<T>> = {
  [K in keyof P]: P[K];
} & {
  component: T | undefined
};

export function Dynamic<T extends ValidComponent> (props: DynamicProps<T>): JSX.Element {
  const [p, others] = splitProps(props, ['component'])
  const cached = createMemo(() => p.component)
  return createMemo(() => {
    const component = cached()
    switch (typeof component) {
      case 'function':
        // eslint-disable-next-line no-constant-condition
        if ('_DX_DEV_') Object.assign(component, { [$DEVCOMP]: true })
        return untrack(() => component(others))

      case 'string':
        // eslint-disable-next-line no-case-declarations
        const el = createElement(component)
        spread(el, others, false)
        return el

      default:
        break
    }
  }) as unknown as JSX.Element
}
