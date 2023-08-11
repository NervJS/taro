import { Component } from 'react'

class App extends Component {

  componentDidMount () {
    console.log('app launch')
  }

  // this.props.children 是将要会渲染的页面
  render () {
    return this.props.children
  }
}

export default App
