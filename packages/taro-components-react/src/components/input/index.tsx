import './style/index.scss'

import classNames from 'classnames'
import React from 'react'

import { createForwardRefComponent, omit } from '../../utils'

function getTrueType (type: string | undefined, confirmType: string, password: boolean) {
  if (confirmType === 'search') type = 'search'
  if (password) type = 'password'
  if (typeof type === 'undefined') {
    return 'text'
  }
  if (!type) {
    throw new Error('unexpected type')
  }
  if (type === 'digit') type = 'number'

  return type
}

function fixControlledValue (value) {
  return value ?? ''
}

interface IProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  password?: boolean
  disabled?: boolean
  maxlength?: number
  placeholder?: string
  value?: string
  focus?: boolean
  confirmType?: string
  name?: string
  type?: string
  onConfirm?: (e) => void
  forwardedRef?: React.MutableRefObject<HTMLInputElement>
}

interface IState {
  compositionValue?: string
}


/**
 * 谷歌浏览器： compositionstart -> onChange -> compositionend
 * 其他浏览器： compositionstart -> compositionend -> onChange
 * 普通按键 (A-Z): handleInput -> setState(compositionValue) -> UI 更新。
 * 空格选词 (中文输入法): compositionend -> triggerValueChange(外部回调) -> onInputExecuted = true -> 紧随其后的 handleInput 被拦截退出。
 */

class Input extends React.Component<IProps, IState> {
  constructor (props) {
    super(props)
    this.state = {
      compositionValue: undefined
    }

    this.handleInput = this.handleInput.bind(this)
    this.handlePaste = this.handlePaste.bind(this)
    this.handleFocus = this.handleFocus.bind(this)
    this.handleBlur = this.handleBlur.bind(this)
    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.handleComposition = this.handleComposition.bind(this)
    this.handleBeforeInput = this.handleBeforeInput.bind(this)
    this.isOnComposition = false
    // onInputExecuted 标记用于防止某些浏览器的事件重复触发
    this.onInputExecuted = false
  }

  inputRef: HTMLInputElement
  isOnComposition: boolean
  onInputExecuted: boolean

  componentDidMount () {
    // 修复无法选择文件
    if (this.props.type === 'file') {
      this.inputRef?.addEventListener('change', this.handleInput)
    } else {
      this.inputRef?.addEventListener('textInput', this.handleBeforeInput)
    }

    // 处理初始化是否 focus
    if (this.props.focus && this.inputRef) this.inputRef.focus()
  }

  componentWillUnmount () {
    // 修复无法选择文件
    if (this.props.type === 'file') {
      this.inputRef.removeEventListener('change', this.handleInput)
    } else {
      this.inputRef?.removeEventListener('textInput', this.handleBeforeInput)
    }
  }

  UNSAFE_componentWillReceiveProps (nextProps: Readonly<IProps>) {
    if (!this.props.focus && nextProps.focus && this.inputRef) this.inputRef.focus()
  }

  /**
   * 处理 maxLength 逻辑并调用 props.onInput
   */
  triggerValueChange (value: string, e: any) {
    const {
      type,
      maxlength = 140,
      confirmType = 'done',
      password = false,
      onInput
    } = this.props

    let finalValue = value
    const inputType = getTrueType(type, confirmType, password)

    /* 修复 number 类型 maxLength 无效 */
    if (inputType === 'number' && finalValue && maxlength <= finalValue.length) {
      finalValue = finalValue.substring(0, maxlength)
      // 如果被截断了，需要同步回 DOM
      if (e.target && e.target.value !== finalValue) {
        e.target.value = finalValue
      }
    }

    // 只有当值确实改变，或者需要强制触发时才调用
    if (typeof onInput === 'function') {
      Object.defineProperty(e, 'detail', {
        value: { value: finalValue, cursor: finalValue.length },
        configurable: true
      })
      // // 修复 IOS 光标跳转问题
      // if (!(['number', 'file'].indexOf(inputType) >= 0)) {
      //   const pos = e.target.selectionEnd
      //   setTimeout(
      //     () => {
      //       e.target.selectionStart = pos
      //       e.target.selectionEnd = pos
      //     }
      //   )
      // }
      onInput(e)
    }
  }

  handleInput (e) {
    e.stopPropagation()
    // 如果是 compositionend 刚刚触发过的，这里消费掉标记并退出，防止双重触发
    // 适配其他浏览器的 compositionend -> onChange 顺序
    if (this.onInputExecuted) {
      this.onInputExecuted = false
      return
    }

    const newValue = e.target.value

    if (this.isOnComposition) {
      // Case 1: 正在拼写中文（compositionstart 已触发但 compositionend 未触发）
      // 只更新组件内部 State，让 Input 显示拼音，不触发外部 onChange
      // 适配谷歌浏览器的 compositionstart -> onChange -> compositionend 顺序
      this.setState({ compositionValue: newValue })
    } else {
      // Case 2: 普通输入 (英文、数字、或中文选词后)
      // 标记执行，防止重复
      this.onInputExecuted = true

      // 清理中间状态
      if (this.state.compositionValue !== undefined) {
        this.setState({ compositionValue: undefined })
      }

      this.triggerValueChange(newValue, e)
      this.onInputExecuted = false
    }
  }

  handlePaste (e) {
    e.stopPropagation()
    const { onPaste } = this.props
    this.onInputExecuted = false
    Object.defineProperty(e, 'detail', {
      value: {
        value: e.target.value
      }
    })
    typeof onPaste === 'function' && onPaste(e)
  }

  handleFocus (e) {
    e.stopPropagation()
    const { onFocus } = this.props
    this.onInputExecuted = false
    Object.defineProperty(e, 'detail', {
      value: {
        value: e.target.value
      }
    })
    onFocus && onFocus(e)
  }

  handleBlur (e) {
    e.stopPropagation()
    const { onBlur } = this.props
    Object.defineProperty(e, 'detail', {
      value: {
        value: e.target.value
      }
    })
    onBlur && onBlur(e)
  }

  handleKeyDown (e) {
    e.stopPropagation()
    const { onConfirm, onKeyDown } = this.props
    const { value } = e.target
    const keyCode = e.keyCode || e.code
    this.onInputExecuted = false

    if (typeof onKeyDown === 'function') {
      Object.defineProperty(e, 'detail', {
        value: {
          value,
          cursor: value.length,
          keyCode
        }
      })
      onKeyDown(e)
    }

    if (e.keyCode === 13 && typeof onConfirm === 'function') {
      Object.defineProperty(e, 'detail', {
        value: {
          value
        }
      })
      onConfirm(e)
    }
  }

  handleComposition (e) {
    e.stopPropagation()
    if (!(e.target instanceof HTMLInputElement)) return

    if (e.type === 'compositionstart') {
      // 开始输入中文，标记进入拼音输入状态
      this.isOnComposition = true
    } else if (e.type === 'compositionupdate') {
      // 拼音输入过程中，保持标记并更新显示
      this.isOnComposition = true
      // 必须在这里触发 setState 才能让输入框里的拼音实时更新
      this.handleInput(e)
    } else if (e.type === 'compositionend') {
      // 中文选词结束，退出拼音输入状态
      this.isOnComposition = false
      // 立即获取最终值
      const newValue = e.target.value

      // 清空中间状态
      this.setState({ compositionValue: undefined })

      // 设置标记，防止后续的 handleInput 重复触发（适配其他浏览器）
      this.onInputExecuted = true

      // 强制触发一次 value change，确保父组件收到最终汉字
      this.triggerValueChange(newValue, e)
    }
  }

  handleBeforeInput = (e) => {
    if (!e.data) return
    const isNumber = e.data && /[0-9]/.test(e.data)
    if (this.props.type === 'number' && !isNumber) {
      e.preventDefault()
    }
    if (this.props.type === 'digit' && !isNumber) {
      if (e.data !== '.' || (e.data === '.' && e.target.value.indexOf('.') > -1)) {
        e.preventDefault()
      }
    }
  }

  render () {
    const {
      className = '',
      placeholder,
      type,
      password = false,
      disabled = false,
      maxlength = 140,
      confirmType = 'done',
      name,
      value
    } = this.props

    const { compositionValue } = this.state

    const cls = classNames('taro-input-core', 'weui-input', className)

    const otherProps = omit(this.props, [
      'forwardedRef',
      'className',
      'placeholder',
      'disabled',
      'password',
      'type',
      'maxlength',
      'confirmType',
      'focus',
      'name',
      'onInput'
    ])

    // 如果有 compositionValue (正在输入拼音)，则显示 compositionValue
    // 否则显示 props 传进来的受控 value
    const displayValue = compositionValue !== undefined
      ? compositionValue
      : fixControlledValue(value)

    return (
      <input
        ref={(input: HTMLInputElement) => {
          if (this.props.forwardedRef) {
            this.props.forwardedRef.current = input
          }
          this.inputRef = input
        }}
        {...otherProps}
        className={cls}
        type={getTrueType(type, confirmType, password)}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={maxlength}
        name={name}
        value={displayValue}
        onInput={this.handleInput}
        onPaste={this.handlePaste}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        onKeyDown={this.handleKeyDown}
        onCompositionStart={this.handleComposition}
        onCompositionUpdate={this.handleComposition}
        onCompositionEnd={this.handleComposition}
        onBeforeInput={this.handleBeforeInput}
      />
    )
  }
}

export default createForwardRefComponent(Input)
