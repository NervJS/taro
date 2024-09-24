use swc_core::ecma::{
  ast::*,
  visit::{VisitMut, VisitMutWith},
};

use crate::utils::constant::COMPILE_MODE;

pub struct IsCompileModeVisitor {
  pub valid: bool,
  in_component_return_block: bool,
  in_outmost_block_scope: bool,
}

impl IsCompileModeVisitor {
  pub fn new() -> Self {
    IsCompileModeVisitor {
      valid: false,
      in_component_return_block: false,
      in_outmost_block_scope: true,
    }
  }
}

impl VisitMut for IsCompileModeVisitor {
  fn visit_mut_block_stmt(&mut self, n: &mut BlockStmt) {
    if !self.in_outmost_block_scope {
      return;
    }
    for stmt in &mut n.stmts {
      match stmt {
        Stmt::Return(return_stmt) => {
          self.in_component_return_block = true;
          return_stmt.visit_mut_children_with(self);
          self.in_component_return_block = false;
        }
        _ => {}
      }
    }
    self.in_outmost_block_scope = false
  }

  fn visit_mut_jsx_element(&mut self, el: &mut JSXElement) {
    if self.in_component_return_block && !self.valid {
      for attr in &mut el.opening.attrs {
        if let JSXAttrOrSpread::JSXAttr(jsx_attr) = attr {
          if let JSXAttrName::Ident(jsx_attr_name) = &jsx_attr.name {
            if jsx_attr_name.sym == COMPILE_MODE {
              self.valid = true;
              break;
            }
          }
        }
      }
      el.visit_mut_children_with(self);
    }
  }
}
