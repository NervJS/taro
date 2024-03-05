const TARO_TEMPLATES_f0t0 = `import { createLazyChildren, createChildItem } from '../render'
import commonStyleModify from '../style'
import { getButtonColor } from '../button'
import { FlexManager } from '../utils/flexManager'
import { TOUCH_EVENT_MAP } from '../utils/constant/event'
import { BUTTON_THEME_COLOR } from '../utils/constant/style'
import { getNodeThresholds, getNormalAttributes, getFontAttributes } from '../utils/helper'
import { NodeType, convertNumber2VP, TaroElement, eventHandler, getComponentEventCallback, AREA_CHANGE_EVENT_NAME, VISIBLE_CHANGE_EVENT_NAME } from '../../runtime'
import { DynamicCenter } from '../utils/DynamicCenter'

import type { TaroButtonElement, TaroViewElement, TaroAny, TaroStyleType, TaroTextStyleType } from '../../runtime'

@Extend(Row)
function rowAttrs (style: TaroStyleType) {
  .constraintSize({
    minWidth: style.minWidth || style.width,
    maxWidth: style.maxWidth,
    minHeight: style.minHeight,
    maxHeight: style.maxHeight
  })
}
@Extend(Column)
function columnAttrs (style: TaroStyleType) {
  .constraintSize({
    minWidth: style.minWidth,
    maxWidth: style.maxWidth,
    minHeight: style.minHeight || style.height,
    maxHeight: style.maxHeight
  })
}
@Component
export default struct TARO_TEMPLATES_f0t0 {
  node: TaroViewElement = new TaroElement('Ignore')

  dynamicCenter: DynamicCenter = new DynamicCenter()

  aboutToAppear () {
    this.dynamicCenter.bindComponentToNodeWithDFS(this.node, this)
  }

  @State node0: TaroElement = new TaroElement('Ignore')
  
  build() {
    Column() {
      createLazyChildren(this.node0)
    }
    .attributeModifier(commonStyleModify.setNode(this.node0 as TaroElement))
    .columnAttrs(getNormalAttributes(this.node0 as TaroElement))
    .onVisibleAreaChange(getNodeThresholds(this.node0 as TaroElement) || [0.0, 1.0], getComponentEventCallback(this.node0 as TaroElement, VISIBLE_CHANGE_EVENT_NAME))
    .onAreaChange(getComponentEventCallback(this.node0 as TaroElement, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
      (this.node0 as TaroElement)._nodeInfo.areaInfo = res[1]
    }))
    .alignItems(FlexManager.flexOptions(this.node0 as TaroElement).alignItems as HorizontalAlign)
    .justifyContent(FlexManager.flexOptions(this.node0 as TaroElement).justifyContent)
  }
}
`;
function Index() {
    return <View compileMode="f0t0" _dynamicID="node0">

            {list.map((item)=>{
        return <View>{item}</View>;
    })}

          </View>;
}
