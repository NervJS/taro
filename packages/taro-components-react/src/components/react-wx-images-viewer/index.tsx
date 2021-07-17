import Previewer, { WxImageViewerProps } from './components/WxImageViewer'
import React from 'react'
import ReactDOM from 'react-dom'

export default function previewImage (options: {
  urls: string[]
  current?: string
  success: (res: any) => void
  fail: (reason: any) => void
  complete: (res: any) => void
}) {
  const { success, complete, fail, urls, current } = options
  const div = document.createElement('div')
  const currentIndex = urls.reduce((prev, curr, index) => (curr === current ? index : prev), -1)
  const onSuccess = res => {
    success && success(res)
    complete && complete(res)
    Promise.resolve(res)
  }
  const onError = res => {
    fail && fail(res)
    complete && complete(res)
    Promise.reject(res)
  }
  const props: WxImageViewerProps = {
    urls,
    onError,
    onClose () {
      ReactDOM.unmountComponentAtNode(div)
      div.remove()
    }
  }

  if (currentIndex > -1) {
    props.index = currentIndex
  }

  ReactDOM.render(<Previewer {...props} />, div)
  return onSuccess({ errMsg: 'previewImage:ok' })
}
