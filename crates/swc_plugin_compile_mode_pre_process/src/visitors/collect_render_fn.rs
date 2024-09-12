use std::collections::HashMap;
use swc_core::{
    ecma::{
        ast::*,
        visit::{VisitMutWith, VisitMut},
    },
    plugin::{
        plugin_transform,
        proxies::TransformPluginProgramMetadata
    }
};
use super::common::RenderFn;

pub struct CollectRenderFnVisitor<'a> {
    pub raw_render_fn_map: &'a mut HashMap<String, HashMap<String, RenderFn>>,
    pub component_name:String,
}

impl<'a> CollectRenderFnVisitor<'a> {
    pub fn new(raw_render_fn_map: &'a mut HashMap<String, HashMap<String, RenderFn>>, component_name: String) -> Self {
        raw_render_fn_map.insert(component_name.clone(), HashMap::new());
        CollectRenderFnVisitor {
            raw_render_fn_map,
            component_name
        }
    }
}

impl VisitMut for CollectRenderFnVisitor<'_> {
    // 先找到入口，首先函数名必须是大写的，然后返回值必须是 jsx 这样才是一个 react 组件
}
