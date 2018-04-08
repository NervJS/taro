import Nerv from 'nervjs'

class Form extends Nerv.Component {
  constructor () {
    super(...arguments)

    const { state } = this.props

    this.state = {
      CheckboxGroup: state.checkboxItem || [],
      RadioGroup: state.radioItem || []
    }

    this.onSubmit = this.onSubmit.bind(this)
    this.toggleChange = this.toggleChange.bind(this)
  }

  onSubmit (e) {
    e.preventDefault()
    // console.log(this.state)
    // console.log(this.props.state)
    this.props.onSubmit(this.state)
  }
  toggleChange (name, e) {
    console.log('劫持数据:', name)
    // console.log(name, value)
    this.setState({
      [name]: e.detail.value
    })
  }

  render () {
    const getForms = children => {
      return Nerv.Children.map(children, (el, i) => {
        if (!el) {
          return null
        }
        switch (el.name) {
          case 'CheckboxGroup':
            el.props.onChange = e => this.toggleChange('CheckboxGroup', e)
            return Nerv.cloneElement(el, el.props)
          case 'RadioGroup':
            el.props.onChange = e => this.toggleChange('RadioGroup', e)
            return Nerv.cloneElement(el, el.props)
          default:
            if (el.props && el.props.children) {
              const childrens = getForms(el.props.children)
              return Nerv.cloneElement(childrens)
            }
            return Nerv.cloneElement(el, el.props)
        }
      })
    }
    getForms(this.props.children)
    return <form onSubmit={this.onSubmit}>{this.props.children}</form>
  }
}

export default Form
