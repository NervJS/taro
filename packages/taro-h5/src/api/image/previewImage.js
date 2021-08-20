/*
* Licensed to the O2Team under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/

/**
 *
 * Based on react-wx-images-viewer from react-ld.
 *
 * Copyright (c) 2017 react-ld
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
/**
 * 在新页面中全屏预览图片。预览的过程中用户可以进行保存图片、发送给朋友等操作。
 * @param {Object} options
 * @param {Array.<string>} options.urls 需要预览的图片链接列表。2.2.3 起支持云文件ID。
 * @param {string} [options.current=options.urls[0]]  urls的第一张 当前显示图片的链接
 * @param {function} [options.success] 接口调用成功的回调函数
 * @param {function} [options.fail] 接口调用失败的回调函数
 * @param {function} [options.complete] 接口调用结束的回调函数（调用成功、失败都会执行）
 */
export async function previewImage (options) {
  const container = document.createElement('div')
  container.classList.add('preview-image')
  container.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1050;
    width: 100%;
    height: 100%;
    overflow: hidden;
    outline: 0;
    background-color: #111;
  `
  container.addEventListener('click', () => {
    container.remove()
  })

  const swiper = document.createElement('taro-swiper-core')
  swiper.full = true

  const { urls = [], current = '' } = options

  let children = []
  try {
    children = await Promise.all(
      urls.map(e => loadImage(e, options.fail))
    )
  } catch (error) {
    if (options.fail) {
      options.fail(error)
    }
  }

  for (let i = 0; i < children.length; i++) {
    const child = children[i]
    swiper.appendChild(child)
  }

  const currentIndex = urls.indexOf(current)
  swiper.current = currentIndex

  container.appendChild(swiper)
  document.body.appendChild(container)

  if (options.success) {
    options.success()
  }

  if (options.complete) {
    options.complete()
  }
}

function loadImage (url, fail) {
  return new Promise((resolve) => {
    const item = document.createElement('taro-swiper-item-core')
    item.style.cssText = `
      display: flex;
      align-items: center;
      justify-content: center;
    `
    const image = new Image()
    image.style.maxWidth = '100%'
    image.src = url
    item.appendChild(image)
    // Note: 等待图片加载完后返回，会导致轮播被卡住
    resolve(item)
    if (typeof fail === 'function') {
      image.addEventListener('error', (err) => {
        fail(err)
      })
    }
  })
}
