use std::collections::HashMap;

use serde_json::de;
use swc_core::{
    ecma::{
        ast::*, utils::{function, swc_common::*}, visit::{VisitMut, VisitMutWith}
    },
    plugin::{
        plugin_transform,
        proxies::TransformPluginProgramMetadata
    }
};

use crate::visitors::common::RenderFn;
pub struct TransformProcessVisitor<'a> {
    component_name: String,
    render_fn_map: &'a HashMap<String, RenderFn>
}

impl<'a> TransformProcessVisitor<'a> {
    pub fn new(component_name: String, render_fn_map: &'a HashMap<String, RenderFn>) -> Self {
        TransformProcessVisitor {
            component_name,
            render_fn_map
        }
    }
}

impl<'a> VisitMut for TransformProcessVisitor<'a> {
    fn visit_mut_block_stmt(&mut self, n: &mut BlockStmt) {
        println!("process! component_name: {}\n", self.component_name);
        let other_sts = Decl::Var(Box::new(VarDecl {
            span: DUMMY_SP,
            kind: VarDeclKind::Const,
            declare: false,
            decls: vec![VarDeclarator {
                span: DUMMY_SP,
                name: Pat::Ident(Ident::new("a".into(), DUMMY_SP).into()),
                init: Some(Box::new(Expr::Lit(Lit::Num(Number {
                                span: DUMMY_SP,
                                value: 1.0,
                                raw: None
                            })))),
                definite: false,
            }],
        }));
        n.stmts.push(Stmt::Decl(other_sts));
    }
}