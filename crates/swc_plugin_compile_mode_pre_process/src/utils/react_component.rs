use swc_core::ecma::{ast::BlockStmt, visit::VisitMutWith};

use crate::visitors::is_compile_mode_component::IsCompileModeVisitor;

pub struct ReactComponent {
  pub name: String,
  pub block_stmt: Option<BlockStmt>,
}

impl Clone for ReactComponent {
  fn clone(&self) -> Self {
    ReactComponent {
      name: self.name.clone(),
      block_stmt: self.block_stmt.clone(),
    }
  }
}

impl ReactComponent {
  pub fn new(name: String, block_stmt: Option<BlockStmt>) -> Self {
    ReactComponent { name, block_stmt }
  }

  pub fn get_name(&self) -> String {
    self.name.clone()
  }

  pub fn is_valid(&mut self) -> bool {
    // 1. 名称是否是大写字母开头
    let is_first_char_uppercase = self.get_name().chars().next().unwrap().is_uppercase();
    // 2. 返回的 JSX 里面有没有 compilerMode
    let mut is_compile_mode_component: IsCompileModeVisitor = IsCompileModeVisitor::new();
    if let Some(block_stmt) = &mut self.block_stmt {
      block_stmt.visit_mut_with(&mut is_compile_mode_component);
    }
    is_first_char_uppercase && is_compile_mode_component.valid
  }
}
