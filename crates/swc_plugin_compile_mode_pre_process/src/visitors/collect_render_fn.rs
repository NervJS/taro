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
        CollectRenderFnVisitor {
            raw_render_fn_map,
            component_name
        }
    }
}

impl VisitMut for CollectRenderFnVisitor<'_> {
    // 先找到入口，首先函数名必须是大写的，然后返回值必须是 jsx 这样才是一个 react 组件
    fn visit_mut_arrow_expr(&mut self, n: &mut ArrowExpr) {
        print!("visit_mut_arrow_expr");
    }
    
    fn visit_mut_fn_decl(&mut self, n: &mut FnDecl) {
        print!("visit_mut_fn_decl");
    }

    fn visit_mut_return_stmt(&mut self, n: &mut ReturnStmt) {
        print!("visit_mut_return_stmt");
    }

    fn visit_mut_jsx_element(&mut self, n: &mut JSXElement) {
        print!("visit_mut_jsx_element");
    }
}
