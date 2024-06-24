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
  
  build() {
    Column() {
      Column() {}
      .attributeModifier(columnModify.setNode(this.node0.childNodes[0] as TaroElement))
      .onVisibleAreaChange(getNodeThresholds(this.node0.childNodes[0] as TaroElement) || [0.0, 1.0], getComponentEventCallback(this.node0.childNodes[0] as TaroElement, VISIBLE_CHANGE_EVENT_NAME))
      .onAreaChange(getComponentEventCallback(this.node0.childNodes[0] as TaroElement, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
        (this.node0.childNodes[0] as TaroElement)._nodeInfo.areaInfo = res[1]
      }))
      .onClick(e => { eventHandler(e, 'click', this.node0.childNodes[0] as TaroElement) } )
      Column() {}
      .attributeModifier(columnModify.setNode(this.node0.childNodes[1] as TaroElement))
      .onVisibleAreaChange(getNodeThresholds(this.node0.childNodes[1] as TaroElement) || [0.0, 1.0], getComponentEventCallback(this.node0.childNodes[1] as TaroElement, VISIBLE_CHANGE_EVENT_NAME))
      .onAreaChange(getComponentEventCallback(this.node0.childNodes[1] as TaroElement, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
        (this.node0.childNodes[1] as TaroElement)._nodeInfo.areaInfo = res[1]
      }))
      .onClick(e => { eventHandler(e, 'click', this.node0.childNodes[1] as TaroElement) } )
      Column() {}
      .attributeModifier(columnModify.setNode(this.node1 as TaroElement))
      .onVisibleAreaChange(getNodeThresholds(this.node1 as TaroElement) || [0.0, 1.0], getComponentEventCallback(this.node1 as TaroElement, VISIBLE_CHANGE_EVENT_NAME))
      .onAreaChange(getComponentEventCallback(this.node1 as TaroElement, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
        (this.node1 as TaroElement)._nodeInfo.areaInfo = res[1]
      }))
      .onClick(e => { eventHandler(e, 'click', this.node1 as TaroElement) } )
      Column() {}
      .attributeModifier(columnModify.setNode(this.node2 as TaroElement))
      .onVisibleAreaChange(getNodeThresholds(this.node2 as TaroElement) || [0.0, 1.0], getComponentEventCallback(this.node2 as TaroElement, VISIBLE_CHANGE_EVENT_NAME))
      .onAreaChange(getComponentEventCallback(this.node2 as TaroElement, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
        (this.node2 as TaroElement)._nodeInfo.areaInfo = res[1]
      }))
      Image((this.node0.childNodes[4] as TaroElement).getAttribute('src'))
      .objectFit(getImageMode((this.node0.childNodes[4] as TaroElement).getAttribute('mode')))
      .attributeModifier(commonStyleModify.setNode(this.node0.childNodes[4] as TaroElement))
      .onVisibleAreaChange(getNodeThresholds(this.node0.childNodes[4] as TaroElement) || [0.0, 1.0], getComponentEventCallback(this.node0.childNodes[4] as TaroElement, VISIBLE_CHANGE_EVENT_NAME))
      .onAreaChange(getComponentEventCallback(this.node0.childNodes[4] as TaroElement, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
        (this.node0.childNodes[4] as TaroElement)._nodeInfo.areaInfo = res[1]
      }))
      .borderRadius({
        topLeft: (this.node0.childNodes[4] as TaroElement)._st.hmStyle.borderTopLeftRadius,
        topRight: (this.node0.childNodes[4] as TaroElement)._st.hmStyle.borderTopRightRadius,
        bottomLeft: (this.node0.childNodes[4] as TaroElement)._st.hmStyle.borderBottomLeftRadius,
        bottomRight: (this.node0.childNodes[4] as TaroElement)._st.hmStyle.borderBottomRightRadius
      })
      .onComplete(e => { eventHandler(e, 'complete', this.node0.childNodes[4] as TaroElement) } )
      Column() {}
      .attributeModifier(columnModify.setNode(this.node0.childNodes[5] as TaroElement))
      .onVisibleAreaChange(getNodeThresholds(this.node0.childNodes[5] as TaroElement) || [0.0, 1.0], getComponentEventCallback(this.node0.childNodes[5] as TaroElement, VISIBLE_CHANGE_EVENT_NAME))
      .onAreaChange(getComponentEventCallback(this.node0.childNodes[5] as TaroElement, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
        (this.node0.childNodes[5] as TaroElement)._nodeInfo.areaInfo = res[1]
      }))
      .onClick(e => { eventHandler(e, 'click', this.node0.childNodes[5] as TaroElement) } )
      .onTouch(e => { eventHandler(e, TOUCH_EVENT_MAP.get(e.type), this.node0.childNodes[5] as TaroElement) } )
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

            <View onClick={()=>{
        console.log("click done");
    }}></View>

            <View onClick={function clickFn() {
        console.log("click done");
    }}></View>

            <View onClick={handleViewClick} _dynamicID="node1"></View>

            <View onAnimationStart={()=>{}} id={myId} _dynamicID="node2"></View>

            <Image onLoad={()=>{
        console.log("load done");
    }} id="myImg"/>

            <View onClick={()=>{
        console.log("click done");
    }} onTouchStart={()=>{
        console.log("touch start done");
    }}/>

          </View>;
}
