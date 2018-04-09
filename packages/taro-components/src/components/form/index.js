import Nerv from 'nervjs'

class Form extends Nerv.Component {
  constructor () {
    super(...arguments)

    const { state } = this.props

    this.Forms = []
    this.state = {
      CheckboxGroup: state.checkboxItem || [],
      RadioGroup: state.radioItem || []
    }

    this.onSubmit = this.onSubmit.bind(this)
    this.onReset = this.onReset.bind(this)
  }

  onSubmit (e) {
    e.preventDefault()
    let formDom = Nerv.findDOMNode(this)
    let elements = []
    let tagElements = formDom.getElementsByTagName('input')
    for (let j = 0; j < tagElements.length; j++) {
      elements.push(tagElements[j])
    }
    let formItem = []
    let hash = {}
    elements.forEach(item => {
      if (item.className === 'weui-switch') {
        formItem.push({
          [item.name]: item.checked
        })
        return
      }
      // console.dir(item)
      if (item.type === 'radio') {
        if (item.checked) {
          formItem.push({
            [item.name]: item.value
          })
        }
        return
      }

      if (item.type === 'checkbox') {
        if (hash[item.name]) {
          formItem.forEach(i => {
            if (i[item.name]) {
              i[item.name].push({ value: item.value, checked: item.checked })
            }
          })
        } else {
          hash[item.name] = true
          formItem.push({
            [item.name]: [{ value: item.value, checked: item.checked }]
          })
        }

        return
      }
      formItem.push({
        [item.name]: item.value
      })
    })

    let textareaElements = formDom.getElementsByTagName('textarea')
    let textareaEleArr = []

    for (let i = 0; i < textareaElements.length; i++) {
      textareaEleArr.push(textareaElements[i])
    }
    textareaEleArr.forEach(v => {
      formItem.push({ [v.name]: v.value })
    })
    this.props.onSubmit({
      detail: { value: formItem }
    })
  }

  onReset (e) {
    e.preventDefault()
    console.log('onReset')
  }

  render () {
    return <form onSubmit={this.onSubmit}>{this.props.children}</form>
  }
}

export default Form
