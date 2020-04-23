// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react'
import { View, Text, Image } from 'react-native'
import { isUrl } from './utils'

export function TabBarIcon (props) {
  let { focused, selectedIconPath, iconPath, isRedDotShow, isBadgeShow, badgeText = '' } = props
  const text = badgeText.length > 4 ? '...' : badgeText
  selectedIconPath = isUrl(selectedIconPath) ? { uri: selectedIconPath } : selectedIconPath
  iconPath = isUrl(iconPath) ? { uri: iconPath } : iconPath
  return (
    <View style={{ width: 30, height: 30 }}>
      {isBadgeShow &&
      <View style={{
        position: 'absolute',
        right: -13,
        top: -2,
        backgroundColor: '#FA5151',
        borderRadius: 18,
        paddingTop: 1.8,
        paddingBottom: 1.8,
        paddingLeft: 4.8,
        paddingRight: 4.8,
        minWidth: 8,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100
      }}>
        <Text style={{ color: 'white', fontSize: 12 }}>{text}</Text>
      </View>}
      {isRedDotShow && <View style={{
        position: 'absolute',
        right: -6,
        top: 0,
        backgroundColor: '#FA5151',
        borderRadius: 18,
        paddingTop: 4,
        paddingBottom: 4,
        paddingLeft: 4,
        paddingRight: 4,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100
      }} />}
      <Image
        style={{ width: 30, height: 30 }}
        source={focused ? selectedIconPath : iconPath}
      />
    </View>
  )
}
