import Component from './component'
import shallowEqual from './shallow-equal'

class PureComponent extends Component {
  isPureComponent = true

  shouldComponentUpdate (nextProps, nextState) {
    return !shallowEqual(this.props, nextProps) || !shallowEqual(this.state, nextState)
  }
}

export default PureComponent
