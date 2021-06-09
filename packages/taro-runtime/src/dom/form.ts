import { TaroElement } from './element'
import { TaroEvent } from './event'

export class FormElement extends TaroElement {
  public get value () {
    // eslint-disable-next-line dot-notation
    const val = this.props['value']
    return val == null ? '' : val
  }

  public set value (val: string | boolean | number | any[]) {
    this.setAttribute('value', val)
  }

  public dispatchEvent (event: TaroEvent) {
    if (event.mpEvent) {
      const val = event.mpEvent.detail.value
      if (event.type === 'change') {
        this.props.value = val as string
      } else if (event.type === 'input') {
        // Web 规范中表单组件的 value 应该跟着输入改变
        // 只是改 this.props.value 的话不会进行 setData，因此这里修改 this.value。
        // 只测试了 React、Vue、Vue3 input 组件的 onInput 事件，onChange 事件不确定有没有副作用，所以暂不修改。
        this.value = val as string
      }
    }
    return super.dispatchEvent(event)
  }
}
