use std::collections::HashMap;
use swc_core::ecma::{
  ast::*,
  visit::{VisitMut, VisitMutWith},
};

use crate::utils::render_fn::RenderFn;

pub struct GenerateDepsVisitor<'a> {
  raw_fn_map: &'a HashMap<String, RenderFn>,
  fn_name: String,
  pub self_loop: bool,
  pub deps_list: Vec<String>,
}

impl<'a> GenerateDepsVisitor<'a> {
  pub fn new(raw_fn_map: &'a HashMap<String, RenderFn>, fn_name: String) -> Self {
    GenerateDepsVisitor {
      raw_fn_map,
      fn_name,
      self_loop: false,
      deps_list: vec![],
    }
  }
}

impl VisitMut for GenerateDepsVisitor<'_> {
  fn visit_mut_call_expr(&mut self, n: &mut CallExpr) {
    if self.self_loop {
      return;
    }
    if let Callee::Expr(expr) = &n.callee {
      if let Expr::Ident(ident) = &**expr {
        if ident.sym.to_string() == self.fn_name {
          self.self_loop = true;
        }
        if self.raw_fn_map.contains_key(&ident.sym.to_string())
          && !self.deps_list.contains(&ident.sym.to_string())
        {
          self.deps_list.push(ident.sym.to_string());
        }
      }
    }

    n.visit_mut_children_with(self);
  }
}
