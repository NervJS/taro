use swc_core::ecma::{ast::*, visit::VisitMut};

use crate::utils::{constant::DEFAULT_COMPONENT, react_component::ReactComponent};

pub struct FindReactComponentVisitor<'a> {
  react_component_list: &'a mut Vec<ReactComponent>,
}

impl<'a> FindReactComponentVisitor<'a> {
  pub fn new(react_component_list: &'a mut Vec<ReactComponent>) -> Self {
    FindReactComponentVisitor {
      react_component_list,
    }
  }
}

// 因为这个 visitor 只是用来找模块最外层的作用域的，所以都不需要递归去找
impl VisitMut for FindReactComponentVisitor<'_> {
  fn visit_mut_var_decl(&mut self, n: &mut VarDecl) {
    for decl in &n.decls {
      let init = decl.clone().init.unwrap();
      match *init {
        // 适配 const xxx = () => {}
        Expr::Arrow(arrow_expr) => match (&decl.name, *arrow_expr.body) {
          (Pat::Ident(ident), BlockStmtOrExpr::BlockStmt(block_stmt)) => {
            let react_component = ReactComponent::new(ident.sym.to_string(), Some(block_stmt));
            self.react_component_list.push(react_component);
          }
          _ => {}
        },
        Expr::Fn(FnExpr { ident: _, function }) => {
          // 适配 const xxx = function () {}
          match (&decl.name, (*function).body) {
            (Pat::Ident(ident), Some(block_stmt)) => {
              let react_component = ReactComponent::new(ident.sym.to_string(), Some(block_stmt));
              self.react_component_list.push(react_component);
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
    let function_name = n.ident.sym.to_string();
    let block_stmt = n.function.body.clone();
    let react_component = ReactComponent::new(function_name, block_stmt);
    self.react_component_list.push(react_component);
  }

  fn visit_mut_export_default_decl(&mut self, n: &mut ExportDefaultDecl) {
    // export default 可以是匿名的组件
    match &n.decl {
      // 适配 export default function xxx () {}
      DefaultDecl::Fn(fn_decl) => {
        let block_stmt = fn_decl.function.body.clone();
        let react_component = ReactComponent::new(DEFAULT_COMPONENT.to_string(), block_stmt);
        self.react_component_list.push(react_component);
      }
      _ => {}
    }
  }

  fn visit_mut_export_default_expr(&mut self, n: &mut ExportDefaultExpr) {
    // export default 可以是匿名的组件
    match &*n.expr {
      // 适配 export default () => {}
      Expr::Arrow(arrow_expr) => {
        if let BlockStmtOrExpr::BlockStmt(block_stmt) = *arrow_expr.body.clone() {
          let react_component =
            ReactComponent::new(DEFAULT_COMPONENT.to_string(), Some(block_stmt));
          self.react_component_list.push(react_component);
        }
      }
      _ => {}
    }
  }
}
