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
  @State node5: TaroElement = new TaroElement('Ignore')
  
  build() {
    Column() {
      Column() {
        Column() {}
        .attributeModifier(columnModify.setNode(this.node2 as TaroElement))
        .onVisibleAreaChange(getNodeThresholds(this.node2 as TaroElement) || [0.0, 1.0], getComponentEventCallback(this.node2 as TaroElement, VISIBLE_CHANGE_EVENT_NAME))
        .onAreaChange(getComponentEventCallback(this.node2 as TaroElement, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
          (this.node2 as TaroElement)._nodeInfo.areaInfo = res[1]
        }))
        Column() {}
        .attributeModifier(columnModify.setNode(this.node1.childNodes[1] as TaroElement))
        .onVisibleAreaChange(getNodeThresholds(this.node1.childNodes[1] as TaroElement) || [0.0, 1.0], getComponentEventCallback(this.node1.childNodes[1] as TaroElement, VISIBLE_CHANGE_EVENT_NAME))
        .onAreaChange(getComponentEventCallback(this.node1.childNodes[1] as TaroElement, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
          (this.node1.childNodes[1] as TaroElement)._nodeInfo.areaInfo = res[1]
        }))
        Column() {
          Column() {}
          .attributeModifier(columnModify.setNode(this.node4 as TaroElement))
          .onVisibleAreaChange(getNodeThresholds(this.node4 as TaroElement) || [0.0, 1.0], getComponentEventCallback(this.node4 as TaroElement, VISIBLE_CHANGE_EVENT_NAME))
          .onAreaChange(getComponentEventCallback(this.node4 as TaroElement, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
            (this.node4 as TaroElement)._nodeInfo.areaInfo = res[1]
          }))
        }
        .attributeModifier(columnModify.setNode(this.node3 as TaroElement))
        .onVisibleAreaChange(getNodeThresholds(this.node3 as TaroElement) || [0.0, 1.0], getComponentEventCallback(this.node3 as TaroElement, VISIBLE_CHANGE_EVENT_NAME))
        .onAreaChange(getComponentEventCallback(this.node3 as TaroElement, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
          (this.node3 as TaroElement)._nodeInfo.areaInfo = res[1]
        }))
      }
      .attributeModifier(columnModify.setNode(this.node1 as TaroElement))
      .onVisibleAreaChange(getNodeThresholds(this.node1 as TaroElement) || [0.0, 1.0], getComponentEventCallback(this.node1 as TaroElement, VISIBLE_CHANGE_EVENT_NAME))
      .onAreaChange(getComponentEventCallback(this.node1 as TaroElement, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
        (this.node1 as TaroElement)._nodeInfo.areaInfo = res[1]
      }))
      Image((this.node0.childNodes[1] as TaroElement).getAttribute('src'))
      .objectFit(getImageMode((this.node0.childNodes[1] as TaroElement).getAttribute('mode')))
      .attributeModifier(commonStyleModify.setNode(this.node0.childNodes[1] as TaroElement))
      .onVisibleAreaChange(getNodeThresholds(this.node0.childNodes[1] as TaroElement) || [0.0, 1.0], getComponentEventCallback(this.node0.childNodes[1] as TaroElement, VISIBLE_CHANGE_EVENT_NAME))
      .onAreaChange(getComponentEventCallback(this.node0.childNodes[1] as TaroElement, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
        (this.node0.childNodes[1] as TaroElement)._nodeInfo.areaInfo = res[1]
      }))
      .borderRadius({
        topLeft: (this.node0.childNodes[1] as TaroElement)._st.hmStyle.borderTopLeftRadius,
        topRight: (this.node0.childNodes[1] as TaroElement)._st.hmStyle.borderTopRightRadius,
        bottomLeft: (this.node0.childNodes[1] as TaroElement)._st.hmStyle.borderBottomLeftRadius,
        bottomRight: (this.node0.childNodes[1] as TaroElement)._st.hmStyle.borderBottomRightRadius
      })
      Image((this.node5 as TaroElement).getAttribute('src'))
      .objectFit(getImageMode((this.node5 as TaroElement).getAttribute('mode')))
      .attributeModifier(commonStyleModify.setNode(this.node5 as TaroElement))
      .onVisibleAreaChange(getNodeThresholds(this.node5 as TaroElement) || [0.0, 1.0], getComponentEventCallback(this.node5 as TaroElement, VISIBLE_CHANGE_EVENT_NAME))
      .onAreaChange(getComponentEventCallback(this.node5 as TaroElement, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
        (this.node5 as TaroElement)._nodeInfo.areaInfo = res[1]
      }))
      .borderRadius({
        topLeft: (this.node5 as TaroElement)._st.hmStyle.borderTopLeftRadius,
        topRight: (this.node5 as TaroElement)._st.hmStyle.borderTopRightRadius,
        bottomLeft: (this.node5 as TaroElement)._st.hmStyle.borderBottomLeftRadius,
        bottomRight: (this.node5 as TaroElement)._st.hmStyle.borderBottomRightRadius
      })
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
    return <View compileMode="f0t0" _dynamicID="node0">

            <View class={myClass} _dynamicID="node1">

              <View style={myStyle} customProp={myCustomProp} _dynamicID="node2"></View>

              <View class="center"/>

              <View onTouch={myTime} _dynamicID="node3">

                <View hoverClass={myHoverClass} _dynamicID="node4"></View>

              </View>

            </View>

            <Image alt="占位符" src="https://www.jd.com/test.jpg"/>

            <Image alt="占位符" src={src} _dynamicID="node5"/>

          </View>;
}
