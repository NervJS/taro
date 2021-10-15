import React from 'react'
import RootSiblings from 'react-native-root-siblings'
import ActionSheet from './ActionSheet'

function showActionSheet (obj: Taro.showActionSheet.Option): Promise<Taro.showActionSheet.SuccessCallbackResult> {
  const {
    itemList = [],
    itemColor = '#000000',
    success,
    fail,
    complete
  } = obj || {}

  const autoDectect = true
  const type = 'ios'

  return new Promise((resolve, reject) => {
    let sibling: any
    function onSuccess (tapIndex) {
      sibling && sibling.destroy()
      sibling = undefined
      const res = { tapIndex, errMsg: 'showActionSheet:ok' }
      success?.(res)
      complete?.(res)
      resolve(res)
    }

    function onFail () {
      const res = { errMsg: 'showActionSheet:fail cancel' }
      sibling && sibling.destroy()
      sibling = undefined
      fail?.(res)
      complete?.(res)
      reject(res)
    }

    sibling = new RootSiblings(
      <ActionSheet
        autoDectect={autoDectect}
        type={type}
        visible={false}
        onClose={onFail}
        menus={
          itemList.map((item, index) => {
            return {
              type: 'default',
              label: item,
              textStyle: { color: itemColor },
              onPress: onSuccess.bind(this, index)
            }
          }) as any
        }
        actions={[
          {
            type: 'default',
            label: '取消',
            textStyle: { color: itemColor },
            onPress: onFail.bind(this)
          }
        ] as any}
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
          menus={
            itemList.map((item, index) => {
              return {
                type: 'default',
                label: item,
                textStyle: { color: itemColor },
                onPress: onSuccess.bind(this, index)
              }
            }) as any
          }
          actions={[
            {
              type: 'default',
              label: '取消',
              textStyle: { color: itemColor },
              onPress: onFail.bind(this)
            }
          ] as any}
        />
      )
    }, 100)
  })
}

export { showActionSheet }
