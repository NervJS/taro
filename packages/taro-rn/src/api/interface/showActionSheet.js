import React from 'react'
import ActionSheet from '../ActionSheet'
import RootSiblings from 'react-native-root-siblings'

function showActionSheet (obj) {
  let {
    itemList = [],
    itemColor = '#000000',
    success,
    fail,
    complete,
    autoDectect = true,
    type = 'ios'
  } = obj || {}

  return new Promise((resolve, reject) => {
    let sibling = new RootSiblings(
      <ActionSheet
        autoDectect={autoDectect}
        type={type}
        visible={false}
        onClose={onFail}
        menus={itemList.map((item, index) => {
          return {
            type: 'default',
            label: item,
            textStyle: {color: itemColor},
            onPress: onSuccess.bind(this, index)
          }
        })}
        actions={[
          {
            type: 'default',
            label: '取消',
            textStyle: {color: itemColor},
            onPress: onFail.bind(this)
          }
        ]}
      />
    )

    // hack 的做法。不推荐
    setTimeout(() => {
      sibling.update(
        <ActionSheet
          autoDectect={autoDectect}
          type={type}
          visible
          onClose={onFail}
          menus={itemList.map((item, index) => {
            return {
              type: 'default',
              label: item,
              textStyle: {color: itemColor},
              onPress: onSuccess.bind(this, index)
            }
          })}
          actions={[
            {
              type: 'default',
              label: '取消',
              textStyle: {color: itemColor},
              onPress: onFail.bind(this)
            }
          ]}
        />
      )
    }, 100)

    function onSuccess (tapIndex) {
      sibling && sibling.destroy()
      sibling = undefined
      const res = {tapIndex, errMsg: 'showActionSheet:ok'}
      success && success(res)
      complete && complete(res)
      resolve(res)
    }

    function onFail () {
      const res = {errMsg: 'showActionSheet:fail cancel'}
      sibling && sibling.destroy()
      sibling = undefined
      fail && fail(res)
      complete && complete(res)
      reject(res)
    }
  })
}

export { showActionSheet }
