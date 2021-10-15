// eslint-disable-next-line no-use-before-define
import * as React from 'react'
import { View, Text } from 'react-native'
import Loading from './Loading'
import { navigationRef } from '../rootNavigation'

export interface HeadTitleProps {
  label: string,
  color: string,
  headerProps?: any
}

export default class HeadTitle extends React.PureComponent<HeadTitleProps> {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  render () {
    // showLoading自定义的参数放在params中
    const params: Record<string, any> = navigationRef.current?.getCurrentRoute()?.params || {}
    const { showLoading = false } = params?.navigateConfig || {}
    const { label, color, headerProps } = this.props
    return <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {showLoading && <Loading />}
      <Text style={{
        fontSize: 17,
        fontWeight: '600',
        textAlign: 'center',
        color: headerProps.tintColor || color,
        paddingLeft: 2
      }}
      >{headerProps?.children || label}</Text>
    </View>
  }
}
