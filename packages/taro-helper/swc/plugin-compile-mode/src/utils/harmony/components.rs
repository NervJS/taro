pub fn get_component_attr_str (node_name: &str, tag_name: &str) -> String {
  if tag_name == "text" {
    format!(".attrsText(getTextAttributes(this.{}))", node_name)
  } else if tag_name == "image" {
    format!(".attrsImage(getNormalAttributes(this.{}))", node_name)
  } else {
    format!(".attrs(getNormalAttributes(this.{}))", node_name)
  }
}

pub fn get_component_style_str (node_name: &str, tag_name: &str) -> String {
  format!(
r#"{}
.onVisibleAreaChange(getNodeThresholds(this.{node_id}) || [0.0, 1.0], getComponentEventCallback(this.{node_id}, VISIBLE_CHANGE_EVENT_NAME))
.onAreaChange(getComponentEventCallback(this.{node_id}, AREA_CHANGE_EVENT_NAME, ({{ eventResult }}) => {{
  const [_, areaResult] = eventResult
  this.nodeInfoMap[this.{node_id}._nid].areaInfo = areaResult
}}))"#,
    get_component_attr_str(node_name, tag_name),
    node_id = node_name,
  )
}


pub fn get_view_component_str (node_name: &str, child_content: &str) -> String {
  format!("Flex(FlexManager.flexOptions(this.{node_id})) {{{children}}}\n{style}",
    node_id = node_name,
    children = match child_content {
      "" => "".to_string(),
      _ => format!("\n{}", child_content)
    },
    style = get_component_style_str(node_name, "view")
  )
}

pub fn get_image_component_str (node_name: &str) -> String {
  format!("Image(this.{node_id}.getAttribute('src'))\n{style}",
    node_id = node_name,
    style = get_component_style_str(node_name, "image")
  )
}

pub fn get_text_component_str (node_name: &str) -> String {
  format!("Text(this.{node_id}.textContent)\n{style}",
    node_id = node_name,
    style = get_component_style_str(node_name, "text")
  )
}


pub fn create_component_event (event_name: &str, node_name: &str) -> String {
  let process_event_trigger_name = |name: &str| -> String {
    if name == "touch" {
      String::from("TOUCH_EVENT_MAP[e.type]")
    } else {
      format!("'{}'", name)
    }
  };
  
  format!("\n.{}(e => eventHandler(e, {}, this.{}))", event_name, process_event_trigger_name(&event_name.get(2..).unwrap().to_lowercase()), node_name)
}
