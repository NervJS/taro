// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Nerv, { Component } from 'nervjs'
import './app.css'

class App extends Component {
  componentDidMount () {}

  componentDidShow () {}

  componentDidHide () {}

  // this.props.children 是将要会渲染的页面
  render () {
    return this.props.children
  }
}

export default App
