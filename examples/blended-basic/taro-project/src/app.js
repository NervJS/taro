import { Component } from 'react'
import './app.scss'

class App extends Component {

  componentDidMount () {
    console.log('app launch')
  }

  componentDidShow () {
    console.log('app show')
  }

  componentDidHide () {
    console.log('app hide')
  }

  componentDidCatchError () {}

  // this.props.children 是将要会渲染的页面
  render () {
    return this.props.children
  }
}

export default App
