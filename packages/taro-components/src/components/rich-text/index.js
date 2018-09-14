import Nerv from 'nervjs'
import omit from 'omit.js'

class RichText extends Nerv.Component {
  constructor () {
    super(...arguments)
  }

  renderNodes (item) {
    if (item.type === 'text') {
      return Nerv.createElement('span', {}, item.text)
    } else {
      const child = this.renderChildrens(item.children)
      let obj = {
        className: '',
        style: ''
      }
      if (item.hasOwnProperty('attrs')) {
        obj.className = item.attrs.class || ''
        obj.style = item.attrs.style || ''
      }
      return Nerv.createElement(item.name, obj, child)
    }
  }

  renderChildrens (arr) {
    if (arr.length === 0) return
    return arr.map((list, i) => {
      if (list.type === 'text') {
        return list.text
      }
      return this.renderNodes(list)
    })
  }

  render () {
    let { nodes } = this.props

    if (Array.isArray(nodes)) {
      return (
        <div {...omit(this.props, ['nodes'])}>
          {nodes.map((item, idx) => {
            return this.renderNodes(item)
          })}
        </div>
      )
    } else {
      return <div dangerouslySetInnerHTML={{ __html: nodes }} />
    }
  }
}

export default RichText
