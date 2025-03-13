import { validateParams } from '../utils'
import { Current, ObjectAssign } from '../../index'

import type { IEtsMethodsOptions } from '../../index'
import type { TaroAny } from '@tarojs/runtime'

const resCallback = (res: string): TaroAny => {
  const result: TaroAny =  { errMsg: `${res}:ok` }

  return result
}

export function handleShowModal(option: IEtsMethodsOptions) {
  let apiOptions: TaroAny = option?.args?.[0]
  const _default: TaroAny = {
    title: '',
    content: '',
    showCancel: true,
    cancelText: '取消',
    cancelColor: '#000000',
    confirmText: '确定',
    confirmColor: '#3CC51F',
    backgroundColor: '#ffffff'
  }

  apiOptions = ObjectAssign(_default, apiOptions)

  const title: TaroAny = apiOptions.title
  const content: TaroAny = apiOptions.content
  const cancelText: TaroAny = apiOptions.cancelText
  const confirmText: TaroAny = apiOptions.confirmText
  const cancelColor: TaroAny = apiOptions.cancelColor
  const confirmColor: TaroAny = apiOptions.confirmColor
  const showCancel: TaroAny = apiOptions.showCancel
  const backgroundColor: TaroAny = apiOptions.backgroundColor

  const buttons: TaroAny = []

  if (cancelText !== '' && showCancel) {
    buttons.push({
      text: cancelText,
      color: cancelColor
    })
  }

  if (confirmText !== '') {
    buttons.push({
      text: confirmText,
      color: confirmColor
    })
  }

  const modalOptions: TaroAny = {
    title,
    message: content,
    buttons: buttons,
    backgroundColor
  }

  const uiContext: TaroAny = Current?.page?.getUIContext?.()

  if (!uiContext) return

  const errorHandler: TaroAny = option.errorHandler
  const successHandler: TaroAny = option.successHandler
  uiContext.getPromptAction().showDialog(modalOptions, (error: TaroAny, data: TaroAny) => {
    if (error) {
      const res: TaroAny = { errMsg: error }
      errorHandler(res)
    }

    if (data.index === 0 && showCancel) {
      successHandler(ObjectAssign(resCallback('showModal'), { confirm: false, cancel: true }))
    } else {
      successHandler(ObjectAssign(resCallback('showModal'), { confirm: true, cancel: false, content: null }))
    }
  })
}

const showToastSchema: TaroAny = {
  title: 'String',
  duration: 'Number',
  bottom: 'String'
}

export function handleShowToast (option: IEtsMethodsOptions): TaroAny {
  let apiOptions: TaroAny = option?.args?.[0]
  const _default: TaroAny = {
    title: '',
    duration: 1500,
    bottom: '50%'
  }

  apiOptions = ObjectAssign(_default, apiOptions)
  const errorHandler: TaroAny = option.errorHandler
  const successHandler: TaroAny = option.successHandler
  try {
    validateParams<TaroAny>('showToast', apiOptions, showToastSchema)
  } catch (error) {
    const res: TaroAny = { errMsg: error.message }
    errorHandler(res)
  }

  const uiContext: TaroAny = Current?.page?.getUIContext?.()

  if (!uiContext) return

  uiContext.getPromptAction().showToast({
    message: apiOptions.title,
    duration: apiOptions.duration,
    bottom: apiOptions.bottom,
    showMode: 1 // 设置弹窗显示模式，显示在应用之上。
  })

  successHandler(resCallback('showToast'))
}


const showActionSheetSchema: TaroAny = {
  title: 'String',
  itemList: 'Array'
}

export function handleShowActionSheet(option: IEtsMethodsOptions): TaroAny {
  let apiOptions: TaroAny = option?.args?.[0]
  const _default: TaroAny = {
    title: '',
    itemList: [],
    itemColor: '#000000'
  }

  apiOptions = ObjectAssign(_default, apiOptions)
  const errorHandler: TaroAny = option.errorHandler
  const successHandler: TaroAny = option.successHandler

  try {
    validateParams<TaroAny>('showActionSheet', apiOptions, showActionSheetSchema)
  } catch (error) {
    const res: TaroAny = { errMsg: error.message }
    errorHandler(res)
  }

  const title: TaroAny = apiOptions.title
  const itemList: TaroAny = apiOptions.itemList
  const itemColor: TaroAny = apiOptions.itemColor

  const buttons: TaroAny = itemList.map((res: TaroAny): TaroAny => {
    const item: TaroAny = {
      text: res,
      color: itemColor
    }

    return item
  })

  const actionSheetOptions: TaroAny = {
    title,
    buttons
  }

  const uiContext: TaroAny = Current?.page?.getUIContext?.()

  if (!uiContext) return

  uiContext.getPromptAction().showActionMenu(actionSheetOptions, (error: TaroAny, data: TaroAny) => {
    if (error) {
      errorHandler(ObjectAssign(data, { errMsg: data.errMsg?.replace('showActionMenu', 'showActionSheet') }))
      return
    }

    successHandler(ObjectAssign(data, resCallback('showActionSheet')))
  })
}