use std::collections::HashMap;

use swc_core::ecma::{
  ast::*,
  visit::{VisitMut, VisitMutWith},
};

use crate::{
  utils::{constant::DEFAULT_COMPONENT, render_fn::RenderFn},
  PluginConfig,
};

use super::process::TransformProcessVisitor;

pub struct ComponentEntryVisitor<'a> {
  format_render_fn_map: &'a HashMap<String, HashMap<String, RenderFn>>,
  config: &'a PluginConfig,
}

impl<'a> ComponentEntryVisitor<'a> {
  pub fn new(
    format_render_fn_map: &'a HashMap<String, HashMap<String, RenderFn>>,
    config: &'a PluginConfig,
  ) -> Self {
    ComponentEntryVisitor {
      format_render_fn_map,
      config: config,
    }
  }

  pub fn get_format_render_fn_map_by_component_name(
    &self,
    component_name: &String,
  ) -> Option<HashMap<String, RenderFn>> {
    self
      .format_render_fn_map
      .get(component_name)
      .map(|render_fn_map| render_fn_map.clone())
  }
}

impl<'a> VisitMut for ComponentEntryVisitor<'a> {
  fn visit_mut_var_decl(&mut self, n: &mut VarDecl) {
    for decl in &mut n.decls {
      let init = decl.clone().init.unwrap();
      match *init {
        // 适配 const xxx = () => {}
        Expr::Arrow(arrow_expr) => match (&decl.name, *arrow_expr.body) {
          (Pat::Ident(ident), BlockStmtOrExpr::BlockStmt(_block_stmt)) => {
            let component_name = ident.sym.to_string();
            let render_fn_map = self.get_format_render_fn_map_by_component_name(&component_name);
            if let Some(render_fn_map) = render_fn_map {
              let mut process_visitor = TransformProcessVisitor::new(&render_fn_map, &self.config);
              decl.init.visit_mut_children_with(&mut process_visitor);
            }
          }
          _ => {}
        },
        Expr::Fn(FnExpr { ident: _, function }) => {
          // 适配 const xxx = function () {}
          match (&decl.name, (*function).body) {
            (Pat::Ident(ident), Some(_block_stmt)) => {
              let component_name = ident.sym.to_string();
              let render_fn_map = self.get_format_render_fn_map_by_component_name(&component_name);
              if let Some(render_fn_map) = render_fn_map {
                let mut process_visitor =
                  TransformProcessVisitor::new(&render_fn_map, &self.config);
                decl.init.visit_mut_children_with(&mut process_visitor);
              }
            }
            _ => {}
          }
        }
        _ => {}
      }
    }
  }

  fn visit_mut_fn_decl(&mut self, n: &mut FnDecl) {
    // 针对场景 function xxx () {} 和 export function xxx () {} 和 export default function xxx () {}
    let component_name = n.ident.sym.to_string();
    let render_fn_map = self.get_format_render_fn_map_by_component_name(&component_name);
    if let Some(render_fn_map) = render_fn_map {
      let mut process_visitor = TransformProcessVisitor::new(&render_fn_map, &self.config);
      n.function
        .body
        .visit_mut_children_with(&mut process_visitor);
    }
  }

  fn visit_mut_export_default_decl(&mut self, n: &mut ExportDefaultDecl) {
    // export default 可以是匿名的组件
    match &mut n.decl {
      // 适配 export default function xxx () {}
      DefaultDecl::Fn(fn_decl) => {
        let render_fn_map =
          self.get_format_render_fn_map_by_component_name(&DEFAULT_COMPONENT.to_string());
        if let Some(render_fn_map) = render_fn_map {
          let mut process_visitor = TransformProcessVisitor::new(&render_fn_map, &self.config);
          fn_decl
            .function
            .body
            .visit_mut_children_with(&mut process_visitor);
        }
      }
      _ => {}
    }
  }

  fn visit_mut_export_default_expr(&mut self, n: &mut ExportDefaultExpr) {
    // export default 可以是匿名的组件
    match &mut *n.expr {
      // 适配 export default () => {}
      Expr::Arrow(arrow_expr) => {
        if let BlockStmtOrExpr::BlockStmt(_block_stmt) = &*arrow_expr.body {
          let render_fn_map =
            self.get_format_render_fn_map_by_component_name(&DEFAULT_COMPONENT.to_string());
          if let Some(render_fn_map) = render_fn_map {
            let mut process_visitor = TransformProcessVisitor::new(&render_fn_map, &self.config);
            n.expr.visit_mut_children_with(&mut process_visitor);
          }
        }
      }
      _ => {}
    }
  }
}
