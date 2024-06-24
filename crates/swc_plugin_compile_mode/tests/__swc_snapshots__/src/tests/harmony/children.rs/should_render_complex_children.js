const TARO_TEMPLATES_f0t0 = `import {
  rowModify,
  FlexManager,
  columnModify,
  DynamicCenter,
  getButtonColor,
  TOUCH_EVENT_MAP,
  getFontAttributes,
  commonStyleModify,
  getNodeThresholds,
  BUTTON_THEME_COLOR,
  getStyleAttr,
  getNormalAttributes,
  shouldBindEvent,
  textModify,
  setNormalTextAttributeIntoInstance,
  getImageMode
} from '@tarojs/components'
import {
  NodeType,
  convertNumber2VP,
  TaroElement,
  eventHandler,
  getComponentEventCallback,
  AREA_CHANGE_EVENT_NAME,
  VISIBLE_CHANGE_EVENT_NAME
} from '@tarojs/runtime'
import { 
  createLazyChildren, 
  createChildItem 
} from '../render'

import type {
  TaroTextElement,
  HarmonyStyle,
  TaroButtonElement,
  TaroViewElement,
  TaroAny,
  TaroStyleType,
  TaroTextStyleType
} from '@tarojs/runtime'
import { isString } from '@tarojs/shared'


@Reusable
@Component
export default struct TARO_TEMPLATES_f0t0 {
  node: TaroViewElement = new TaroElement('Ignore')

  dynamicCenter: DynamicCenter = new DynamicCenter()

  aboutToAppear () {
    this.dynamicCenter.bindComponentToNodeWithDFS(this.node, this)
  }

  aboutToReuse(params: TaroAny): void {
    this.node = params.node
    this.dynamicCenter.bindComponentToNodeWithDFS(this.node, this)
  }

  @State node0: TaroElement = new TaroElement('Ignore')
  @State node1: TaroElement = new TaroElement('Ignore')
  @State node2: TaroElement = new TaroElement('Ignore')
  @State node3: TaroElement = new TaroElement('Ignore')
  @State node4: TaroElement = new TaroElement('Ignore')
  
  build() {
    Column() {
      if ((this.node0.childNodes[0] as TaroElement)._attrs.compileIf) {
        Column() {
          Column() {
            Image((this.node3 as TaroElement).getAttribute('src'))
            .objectFit(getImageMode((this.node3 as TaroElement).getAttribute('mode')))
            .attributeModifier(commonStyleModify.setNode(this.node3 as TaroElement))
            .onVisibleAreaChange(getNodeThresholds(this.node3 as TaroElement) || [0.0, 1.0], getComponentEventCallback(this.node3 as TaroElement, VISIBLE_CHANGE_EVENT_NAME))
            .onAreaChange(getComponentEventCallback(this.node3 as TaroElement, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
              (this.node3 as TaroElement)._nodeInfo.areaInfo = res[1]
            }))
            .borderRadius({
              topLeft: (this.node3 as TaroElement)._st.hmStyle.borderTopLeftRadius,
              topRight: (this.node3 as TaroElement)._st.hmStyle.borderTopRightRadius,
              bottomLeft: (this.node3 as TaroElement)._st.hmStyle.borderBottomLeftRadius,
              bottomRight: (this.node3 as TaroElement)._st.hmStyle.borderBottomRightRadius
            })
            if ((this.node2.childNodes[1] as TaroElement)._attrs.compileIf) {
              Image((this.node4 as TaroElement).getAttribute('src'))
              .objectFit(getImageMode((this.node4 as TaroElement).getAttribute('mode')))
              .attributeModifier(commonStyleModify.setNode(this.node4 as TaroElement))
              .onVisibleAreaChange(getNodeThresholds(this.node4 as TaroElement) || [0.0, 1.0], getComponentEventCallback(this.node4 as TaroElement, VISIBLE_CHANGE_EVENT_NAME))
              .onAreaChange(getComponentEventCallback(this.node4 as TaroElement, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
                (this.node4 as TaroElement)._nodeInfo.areaInfo = res[1]
              }))
              .borderRadius({
                topLeft: (this.node4 as TaroElement)._st.hmStyle.borderTopLeftRadius,
                topRight: (this.node4 as TaroElement)._st.hmStyle.borderTopRightRadius,
                bottomLeft: (this.node4 as TaroElement)._st.hmStyle.borderBottomLeftRadius,
                bottomRight: (this.node4 as TaroElement)._st.hmStyle.borderBottomRightRadius
              })
            }
          }
          .attributeModifier(columnModify.setNode(this.node2 as TaroElement))
          .onVisibleAreaChange(getNodeThresholds(this.node2 as TaroElement) || [0.0, 1.0], getComponentEventCallback(this.node2 as TaroElement, VISIBLE_CHANGE_EVENT_NAME))
          .onAreaChange(getComponentEventCallback(this.node2 as TaroElement, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
            (this.node2 as TaroElement)._nodeInfo.areaInfo = res[1]
          }))
        }
        .attributeModifier(columnModify.setNode(this.node1 as TaroElement))
        .onVisibleAreaChange(getNodeThresholds(this.node1 as TaroElement) || [0.0, 1.0], getComponentEventCallback(this.node1 as TaroElement, VISIBLE_CHANGE_EVENT_NAME))
        .onAreaChange(getComponentEventCallback(this.node1 as TaroElement, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
          (this.node1 as TaroElement)._nodeInfo.areaInfo = res[1]
        }))
        .onClick(e => { eventHandler(e, 'click', this.node1 as TaroElement) } )
      }
    }
    .attributeModifier(columnModify.setNode(this.node0 as TaroElement))
    .onVisibleAreaChange(getNodeThresholds(this.node0 as TaroElement) || [0.0, 1.0], getComponentEventCallback(this.node0 as TaroElement, VISIBLE_CHANGE_EVENT_NAME))
    .onAreaChange(getComponentEventCallback(this.node0 as TaroElement, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
      (this.node0 as TaroElement)._nodeInfo.areaInfo = res[1]
    }))
  }
}
`;
function Index() {
    return <View className="goods" compileMode="f0t0" _dynamicID="node0">

        {showModal ? <View className={`regds ${isShow ? 'regds-qsl-anm' : ''} ${item.backurl ? 'regds-bg' : ''}`} onClick={goToDetail} style={{
        backgroundImage: item.backurl ? `url(${item.backurl})` : `linear-gradient(to right, #fff, #fff), linear-gradient(225deg, rgba(${item.rgbvalue2},.28), rgba(${item.rgbvalue1},.28))`
    }} compileIf={showModal} _dynamicID="node1">

            <View className="regds-pimg" _dynamicID="node2">

              <Image style={{
        zIndex: (item.mainurl ? !isPlay : true) ? 1 : 0
    }} className={`regds-img ${dynamicPlay ? 'dynamic' : ''}`} src={imgbase_sku} _dynamicID="node3"/>

              {haveIcon ? <Image className="regds-img-icon" src={iconList.imgIcon.url1} style={{
        width: `${iconList.imgIcon.width}rpx`,
        height: `${iconList.imgIcon.height}rpx`
    }} compileIf={haveIcon} _dynamicID="node4"/> : <View compileIgnore/>}

            </View>

          </View> : <View compileIgnore/>}

      </View>;
}
