use crate::{transform_harmony::EtsDirection, utils};

pub fn get_component_attr_str (node_name: &str, tag_name: &str) -> String {
  if tag_name == "text" {
    format!(".attributeModifier(commonStyleModify.setNode(this.{} as TaroElement))\n.textSpecialFontStyle(getFontAttributes(this.{} as TaroElement))", node_name, node_name)
  } else if tag_name == "row" {
    format!(".attributeModifier(commonStyleModify.setNode(this.{} as TaroElement))\n.rowAttrs(getNormalAttributes(this.{} as TaroElement))", node_name, node_name)
  } else if tag_name == "column" {
    format!(".attributeModifier(commonStyleModify.setNode(this.{} as TaroElement))\n.columnAttrs(getNormalAttributes(this.{} as TaroElement))", node_name, node_name)
  } else {
    format!(".attributeModifier(commonStyleModify.setNode(this.{} as TaroElement))", node_name)
  }
}

pub fn get_component_style_str (node_name: &str, tag_name: &str) -> String {
  format!(
r#"{}
.onVisibleAreaChange(getNodeThresholds(this.{node_id} as TaroElement) || [0.0, 1.0], getComponentEventCallback(this.{node_id} as TaroElement, VISIBLE_CHANGE_EVENT_NAME))
.onAreaChange(getComponentEventCallback(this.{node_id} as TaroElement, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {{
  (this.{node_id} as TaroElement)._nodeInfo.areaInfo = res[1]
}}))"#,
    get_component_attr_str(node_name, tag_name),
    node_id = node_name,
  )
}

pub fn get_view_component_str (node_name: &str, child_content: &str, direction: EtsDirection) -> String {
  let container = match direction {
    EtsDirection::Row => "Row",
    EtsDirection::Column => "Column"
  };
  let container_align_type = match direction {
    EtsDirection::Row => "VerticalAlign",
    EtsDirection::Column => "HorizontalAlign"
  };
  format!("{container}() {{{children}}}\n{style}\n.alignItems(FlexManager.flexOptions(this.{node_id} as TaroElement).alignItems as {container_align_type})\n.justifyContent(FlexManager.flexOptions(this.{node_id} as TaroElement).justifyContent)",
    container = container,
    container_align_type = container_align_type,
    node_id = node_name,
    children = match child_content {
      "" => "".to_string(),
      _ => format!("\n{}", child_content)
    },
    style = get_component_style_str(node_name, container.to_lowercase().as_str()),
  )
}

pub fn get_image_component_str (node_name: &str) -> String {
  format!("Image((this.{node_id} as TaroElement).getAttribute('src'))\n.objectFit(getImageMode((this.{node_id} as TaroElement).getAttribute('mode')))\n{style}",
    node_id = node_name,
    style = get_component_style_str(node_name, "image")
  )
}

pub fn get_text_component_str (node_name: &str) -> String {
  format!(
"if (this.{node_id}.nodeType === NodeType.TEXT_NODE && this.{node_id}.parentNode) {{
  if ((this.{node_id}.parentNode as TaroButtonElement).tagName === 'BUTTON') {{
    Text(this.{node_id}.textContent)\n{style}    .fontSize((this.{node_id}.parentNode as TaroButtonElement).hmStyle.fontSize || getButtonFontSize((this.{node_id}.parentNode as TaroButtonElement)))
    .fontColor((this.{node_id}.parentNode as TaroButtonElement).hmStyle.color || getButtonColor(this.{node_id}.parentNode as TaroButtonElement, BUTTON_THEME_COLOR.get((this.{node_id}.parentNode as TaroButtonElement)._attrs.type).text))
  }} else {{
    Text(this.{node_id}.textContent)\n{style}  }}
}} else {{
  Text(this.{node_id}.textContent)
  .onClick((e: ClickEvent) => eventHandler(e, 'click', this.{node_id} as TaroElement))
  .textNormalFontStyle(getNormalAttributes(this.{node_id}))\n{style_with_event}}}
",
  node_id = node_name,
  style = utils::add_spaces_to_lines_with_count(&get_component_attr_str(node_name, "text"), 4),
  style_with_event = utils::add_spaces_to_lines_with_count(&get_component_style_str(node_name, "text"), 2)
  )
}


pub fn create_component_event (event_name: &str, node_name: &str) -> String {
  let process_event_trigger_name = |name: &str| -> String {
    if name == "touch" {
      String::from("TOUCH_EVENT_MAP.get(e.type)")
    } else {
      format!("'{}'", name)
    }
  };

  format!("\n.{}(e => eventHandler(e, {}, this.{} as TaroElement))", event_name, process_event_trigger_name(&event_name.get(2..).unwrap().to_lowercase()), node_name)
}
