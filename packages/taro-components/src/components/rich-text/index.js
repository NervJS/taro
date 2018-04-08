import Nerv from 'nervjs'
import omit from 'omit.js'
import _ from 'lodash'

class RichText extends Nerv.Component {
  constructor () {
    super(...arguments)
  }

  renderNodes (item) {
    const child = this.renderChildrens(item.children)
    return Nerv.createElement(
      item.name,
      {
        className: item.attrs.class,
        style: item.attrs.style
      },
      child
    )
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

    if (_.isArray(nodes)) {
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
