
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
    children = await Promise.all(urls.map(loadImage))
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

function loadImage (url) {
  return new Promise((resolve, reject) => {
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
    image.addEventListener('load', () => {
      resolve(item)
    })
    image.addEventListener('error', (err) => {
      reject(err)
    })
  })
}
