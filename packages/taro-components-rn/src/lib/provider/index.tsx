import * as React from 'react';
import AntProvider from '@ant-design/react-native/lib/provider'

export default class Provider extends React.Component<any> {
  render () {
    return (
      <AntProvider>
        {this.props.children}
      </AntProvider>
    )
  }
}
