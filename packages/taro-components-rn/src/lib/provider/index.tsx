import * as React from 'react';
import { Provider as AntProvider } from '@ant-design/react-native'

export default class Provider extends React.Component<any> {
  render() {
    return (
      <AntProvider>
        {this.props.children}
      </AntProvider>
    )
  }
}
