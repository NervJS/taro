import 'weui'
import Nerv from 'nervjs'

class Form extends Nerv.Component {
  constructor () {
    super(...arguments)

    this.Forms = []

    this.onSubmit = this.onSubmit.bind(this)
    this.onReset = this.onReset.bind(this)
  }

  onSubmit (e) {
    e.preventDefault()
    const formDom = Nerv.findDOMNode(this)
    const elements = []
    const tagElements = formDom.getElementsByTagName('input')
    for (let j = 0; j < tagElements.length; j++) {
      elements.push(tagElements[j])
    }
    const formItem = {}
    const hash = {}
    elements.forEach(item => {
      if (item.className.indexOf('weui-switch') !== -1) {
        formItem[item.name] = item.checked
        return
      }
      if (item.type === 'radio') {
        if (item.checked) {
          hash[item.name] = true
          formItem[item.name] = item.value
        } else {
          if (!hash[item.name]) {
            formItem[item.name] = ''
          }
        }
        return
      }

      if (item.type === 'checkbox') {
        if (item.checked) {
          if (hash[item.name]) {
            formItem[item.name].push(item.value)
          } else {
            hash[item.name] = true
            formItem[item.name] = [item.value]
          }
        } else {
          if (!hash[item.name]) {
            formItem[item.name] = []
          }
        }
        return
      }
      formItem[item.name] = item.value
    })

    const textareaElements = formDom.getElementsByTagName('textarea')
    const textareaEleArr = []

    for (let i = 0; i < textareaElements.length; i++) {
      textareaEleArr.push(textareaElements[i])
    }
    textareaEleArr.forEach(v => {
      formItem[v.name] = v.value
    })
    Object.defineProperty(e, 'detail', {
      enumerable: true,
      value: {
        value: formItem
      }
    })
    this.props.onSubmit(e)
  }

  onReset (e) {
    e.preventDefault()
    this.props.onReset()
  }

  render () {
    const { className, style } = this.props
    return <form className={className} style={style} onSubmit={this.onSubmit} onReset={this.onReset}>{this.props.children}</form>
  }
}

export default Form
