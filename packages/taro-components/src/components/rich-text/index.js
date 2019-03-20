import 'weui'
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
        for (const key in item.attrs) {
          if (key === 'class') {
            obj.className = item.attrs[key] || ''
          } else {
            obj[key] = item.attrs[key] || ''
          }
        }
      }
      return Nerv.createElement(item.name, obj, child)
    }
  }

  renderChildrens (arr = []) {
    if (arr.length === 0) return
    return arr.map((list, i) => {
      if (list.type === 'text') {
        return list.text
      }
      return this.renderNodes(list)
    })
  }

  render () {
    let { nodes, className, ...other } = this.props

    if (Array.isArray(nodes)) {
      return (
        <div className={className} {...omit(this.props, ['nodes', 'className'])} {...other}>
          {nodes.map((item, idx) => {
            return this.renderNodes(item)
          })}
        </div>
      )
    } else {
      return <div className={className} {...omit(this.props, ['className'])} {...other} dangerouslySetInnerHTML={{ __html: nodes }} />
    }
  }
}

export default RichText
