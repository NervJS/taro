import { Component, ComponentLifecycle } from '@tarojs/taro'

type WeappLifeCycle = () => void

interface WeappComponent<P, S> extends Component<P, S> {
  created?: WeappLifeCycle
}

interface ComponentClass<P = {}, S = {}> extends ComponentLifecycle<P, S> {
  new (props: P): WeappComponent<P, S>
}

function safeExecute (func?: Function, ...arg) {
  if (func) func(arg)
}

export function withWeapp (componentType: string) {
  const isComponent = componentType === 'component'

  function executeComponentFunc (func?: Function, ...args) {
    if (isComponent) {
      safeExecute(func, args)
    }
  }

  return (ConnectComponent: ComponentClass) => class extends ConnectComponent {
    constructor (props) {
      super(props)
    }

    componentWillMount () {
      executeComponentFunc(this.created)
      safeExecute(super.componentWillMount)
    }
  }
}
