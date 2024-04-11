use crate::{transform_harmony::EtsDirection, utils};

pub fn get_component_attr_str (node_name: &str, tag_name: &str) -> String {
  if tag_name == "text" {
    format!(".attributeModifier(commonStyleModify.setNode({} as TaroElement))\n.textSpecialFontStyle(getFontAttributes({} as TaroElement))", node_name, node_name)
  } else if tag_name == "row" {
    format!(".attributeModifier(rowModify.setNode({} as TaroElement))", node_name)
  } else if tag_name == "column" {
    format!(".attributeModifier(columnModify.setNode({} as TaroElement))", node_name)
  } else {
    format!(".attributeModifier(commonStyleModify.setNode({} as TaroElement))", node_name)
  }
}

pub fn get_component_style_str (node_name: &str, tag_name: &str) -> String {
  format!(
r#"{}
.onVisibleAreaChange(getNodeThresholds({node_id} as TaroElement) || [0.0, 1.0], getComponentEventCallback({node_id} as TaroElement, VISIBLE_CHANGE_EVENT_NAME))
.onAreaChange(getComponentEventCallback({node_id} as TaroElement, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {{
  ({node_id} as TaroElement)._nodeInfo.areaInfo = res[1]
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
  format!("{container}() {{{children}}}\n{style}",
    container = container,
    children = match child_content {
      "" => "".to_string(),
      _ => format!("\n{}", child_content)
    },
    style = get_component_style_str(node_name, container.to_lowercase().as_str()),
  )
}

pub fn get_image_component_str (node_name: &str) -> String {
  format!("Image(({node_id} as TaroElement).getAttribute('src'))\n.objectFit(getImageMode(({node_id} as TaroElement).getAttribute('mode')))\n{style}",
    node_id = node_name,
    style = get_component_style_str(node_name, "image")
  )
}

pub fn get_text_component_str (node_name: &str) -> String {
  format!(
"if ({node_id}.nodeType === NodeType.TEXT_NODE && {node_id}.parentNode) {{
  if (({node_id}.parentNode as TaroButtonElement).tagName === 'BUTTON') {{
    Text({node_id}.textContent)\n{style}    .fontSize(({node_id}.parentNode as TaroButtonElement).hmStyle.fontSize || getButtonFontSize(({node_id}.parentNode as TaroButtonElement)))
    .fontColor(({node_id}.parentNode as TaroButtonElement).hmStyle.color || getButtonColor({node_id}.parentNode as TaroButtonElement, BUTTON_THEME_COLOR.get(({node_id}.parentNode as TaroButtonElement)._attrs.type).text))
  }} else {{
    Text({node_id}.textContent)\n{style}  }}
}} else {{
  Text({node_id}.textContent)
  .onClick((e: ClickEvent) => eventHandler(e, 'click', {node_id} as TaroElement))
  .textNormalFontStyle(getNormalAttributes({node_id}  as TaroElement))\n{style_with_event}}}
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

  format!("\n.{}(e => eventHandler(e, {}, {} as TaroElement))", event_name, process_event_trigger_name(&event_name.get(2..).unwrap().to_lowercase()), node_name)
}
