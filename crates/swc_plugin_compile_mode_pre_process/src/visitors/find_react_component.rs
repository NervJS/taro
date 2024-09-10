use std::collections::HashMap;

use serde_json::de;
use swc_core::{
    ecma::{
        ast::*, utils::function, visit::{VisitMut, VisitMutWith}
    },
    plugin::{
        plugin_transform,
        proxies::TransformPluginProgramMetadata
    }
};

use super::common::ReactComponent;

pub struct FindReactComponentVisitor<'a> {
    react_component_list: &'a mut Vec<ReactComponent>,
}

impl<'a> FindReactComponentVisitor<'a> {
    pub fn new(react_component_list: &'a mut Vec<ReactComponent>,) -> Self {
        FindReactComponentVisitor {
            react_component_list
        }
    }
}

// 因为这个 visitor 只是用来找模块最外层的作用域的，所以都不需要递归去找
impl VisitMut for FindReactComponentVisitor<'_> {
    fn visit_mut_var_decl(&mut self,n: &mut VarDecl) {
        for decl in &n.decls {
            let init = decl.clone().init.unwrap();
            if let Expr::Arrow(arrow_expr) = *init {
                match (&decl.name, *arrow_expr.body) {
                    (Pat::Ident(ident), BlockStmtOrExpr::BlockStmt(block_stmt)) => {
                        let react_component = ReactComponent::new(ident.sym.to_string(), Some(block_stmt));
                        self.react_component_list.push(react_component); 
                    },
                    _ => {}
                }
            }
        }
    }
    
    fn visit_mut_fn_decl(&mut self, n: &mut FnDecl) {
        // 针对场景 function xxx () {}
        let function_name = n.ident.sym.to_string();
        let block_stmt = n.function.body.clone();
        let react_component = ReactComponent::new(function_name, block_stmt);
        self.react_component_list.push(react_component);
    }

    fn visit_mut_export_decl(&mut self,n: &mut ExportDecl) {
        match &n.decl {
            // 针对场景 export function xxx () {}
            Decl::Fn(fn_decl) => {
                let function_name = fn_decl.ident.sym.to_string();
                let block_stmt = fn_decl.function.body.clone();
                let react_component = ReactComponent::new(function_name, block_stmt);
                self.react_component_list.push(react_component);
            },
            // 针对场景 export const xxx = () => {}
            Decl::Var(var_decl) => {
                for decl in &var_decl.decls {
                    let init = decl.clone().init.unwrap();
                    if let Expr::Arrow(arrow_expr) = *init {
                        match (&decl.name, *arrow_expr.body) {
                            (Pat::Ident(ident), BlockStmtOrExpr::BlockStmt(block_stmt)) => {
                                let react_component = ReactComponent::new(ident.sym.to_string(), Some(block_stmt));
                                self.react_component_list.push(react_component); 
                            },
                            _ => {}
                        }
                    }
                }
            },
            _ => {}
        }
    }

    fn visit_mut_export_default_decl(&mut self,n: &mut ExportDefaultDecl) {
        // export default 可以是匿名的组件
        match &n.decl {
            // 适配 export default function xxx () {}
            DefaultDecl::Fn(fn_decl) => {
                let block_stmt = fn_decl.function.body.clone();
                let react_component = ReactComponent::new(String::from("default"), block_stmt);
                self.react_component_list.push(react_component);
            },
            _ => {}
        }
    }

    fn visit_mut_export_default_expr(&mut self,n: &mut ExportDefaultExpr) {
        // export default 可以是匿名的组件
        match &*n.expr {
            // 适配 export default () => {}
            Expr::Arrow(arrow_expr) => {
                if let BlockStmtOrExpr::BlockStmt(block_stmt) = *arrow_expr.body.clone() {
                    let react_component = ReactComponent::new(String::from("default"), Some(block_stmt));
                    self.react_component_list.push(react_component);
                }
            },
            _ => {}
        }
    }
}