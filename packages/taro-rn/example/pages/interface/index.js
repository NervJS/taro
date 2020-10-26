import React from 'react'
import { View, Text, Button } from 'react-native'
import { styles } from '../styles'
import { showToast, showModal, showLoading, hideLoading, showActionSheet } from '../../../dist/api/interface/index'

function handleShowToast () {
  showToast({
    title: '成功',
    icon: 'success',
    duration: 2000
  })
}

function handleShowModal () {
  showModal({
    title: '提示',
    content: '这是一个模态弹窗'
  }).then(res => {
    if (res.confirm) {
      console.log('用户点击确定')
    } else if (res.cancel) {
      console.log('用户点击取消')
    }
  }).catch(e => console.log(e))
}

function handleShowLoading () {
  showLoading({
    title: '加载中'
  })

  setTimeout(function () {
    hideLoading()
  }, 2000)
}

function handleShowActionSheet () {
  showActionSheet({ itemList: ['A', 'B', 'C'] })
    .then(res => console.log(res))
    .catch(e => console.log(e))
}

export function Interface () {
  return (
    <View>
      <Text style={styles.index}>交互</Text>
      <View style={{ flexDirection: 'row' }}>
        <Button onPress={handleShowToast} title='showToast' color='#19AD1A' />
        <Button onPress={handleShowModal} title='showModal' color='#19AD1A' />
      </View>
      <View style={{ flexDirection: 'row' }}>
        <Button onPress={handleShowLoading} title='showLoading' color='#19AD1A' />
        <Button onPress={handleShowActionSheet} title='showActionSheet' color='#19AD1A' />
      </View>
      <Text style={styles.index}>动画</Text>
    </View>
  )
}
