import * as React from 'react'
import { Text, View } from 'react-native'

import { navigationRef } from '../rootNavigation'
import Loading from './Loading'

export interface HeadTitleProps {
  label: string
  color: string
  headerProps?: any
}

export default class HeadTitle extends React.PureComponent<HeadTitleProps> {
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
