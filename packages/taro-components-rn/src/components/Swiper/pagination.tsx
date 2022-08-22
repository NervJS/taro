import React from 'react'
import { View, StyleSheet } from 'react-native'
import { PaginationProps } from './PropsType'

const styles = StyleSheet.create({
  pagination: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paginationX: {
    bottom: 10,
    left: 0,
    right: 0,
  },
  paginationY: {
    right: 10,
    top: 0,
    bottom: 0,
  },
  pointStyle: {
    width: 8,
    height: 8,
    borderRadius: 8,
    backgroundColor: '#999',
  },
  pointActiveStyle: {
    backgroundColor: '#333',
  },
  spaceStyle: {
    marginHorizontal: 2.5,
    marginVertical: 3,
  },
})

export default function defaultPagination (props: PaginationProps): any {
  const { current, vertical, count, dotStyle, dotActiveStyle } = props
  const positionStyle = vertical ? 'paginationY' : 'paginationX'
  const flexDirection = vertical ? 'column' : 'row'
  const arr: any = []
  for (let i = 0; i < count; i++) {
    arr.push(
      <View
        key={`dot-${i}`}
        style={[
          styles.pointStyle,
          styles.spaceStyle,
          dotStyle,
          i === current && styles.pointActiveStyle,
          i === current && dotActiveStyle,
        ]}
      />,
    )
  }
  return (
    <View style={[styles.pagination, styles[positionStyle]]}>
      <View style={{ flexDirection }}>{arr}</View>
    </View>
  )
}
