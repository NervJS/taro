
import TaroComponentWrapper from './base'
import web_webview from '@ohos.web.webview'
import type { TaroViewElement } from '../runtime'


@Component
struct TaroInnerHtml {

  @ObjectLink node: TaroViewElement

  controller: web_webview.WebviewController = new web_webview.WebviewController();

  isLoaded: boolean = false

  @State isInit: boolean = false

  @State height: string = '2vp'  // 如果起始高度不足，将不会渲染webview

  jsBridge = {
    // 获取父级高度，拿到实际的webview宽度，计算出高度
    load: (bodyHeight: number, bodyWidth: number) => {
      const { width } = this.node.parentElement.instance.info
      const widthPx = vp2px(width)
      this.height = Math.floor(widthPx / bodyWidth * bodyHeight) + 'px'
      this.isInit = true
    }
  }

  build() {
    TaroComponentWrapper({ node: this.node }) {
      if (this.node.innerHTML) {
        Web({ src: $rawfile('innerHTML.html'), controller: this.controller }).onPageBegin((event) => {
          if (this.isLoaded) return
          this.isLoaded = true
          // 注入jsBridge，监听页面onload行为，获取高度
          this.controller.registerJavaScriptProxy(this.jsBridge, 'jsBridge', ['load'])
          const innerString = this.node.innerHTML
          try {
            this.controller.loadData(
              `
                <html>
                  <body onload="jsBridge.load(document.getElementById('container').clientHeight, document.body.clientWidth);" style="padding: 0;margin: 0">
                    <div id="container">
                      ${innerString}
                    </div>
                  </body>
                </html>
              `,
              "text/html",
              "UTF-8"
            )
          } catch (error) {
            console.log(`ErrorCode: ${error.code},  Message: ${error.message}`);
          }
        })
          .javaScriptAccess(true)
          .size({
            width: '100%',
            height: this.height
          })
          .visibility(this.isInit)
        // 覆盖webwiew的scroll
        Stack({ alignContent: Alignment.TopStart }) {
          Flex().size({
            height: this.height,
            width: '100%'
          })
        }.position({
          x: 0,
          y: 0
        })
      }
    }
  }
}

export default TaroInnerHtml
