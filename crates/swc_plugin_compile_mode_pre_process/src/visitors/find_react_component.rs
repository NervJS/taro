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

use super::common::ReactComponent;

pub struct FindReactComponentVisitor<'a> {
    raw_render_fn_map: &'a mut HashMap<String, ReactComponent>,
}

impl<'a> FindReactComponentVisitor<'a> {
    pub fn new(raw_render_fn_map: &'a mut HashMap<String, ReactComponent>,) -> Self {
        FindReactComponentVisitor {
            raw_render_fn_map
        }
    }
}

impl VisitMut for FindReactComponentVisitor<'_> {
    // 先找到入口，首先函数名必须是大写的，然后返回值必须是 jsx 这样才是一个 react 组件
    fn visit_mut_arrow_expr(&mut self,n: &mut ArrowExpr) {
        print!("visit_mut_arrow_expr");
    }
    
    fn visit_mut_fn_decl(&mut self,n: &mut FnDecl) {
        print!("visit_mut_fn_decl");
    }
}