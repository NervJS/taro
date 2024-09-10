
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



pub struct RenderFn {
    pub params: Vec<Param>,
    pub jsx_element: JSXElement,
}

impl Clone for RenderFn {
    fn clone(&self) -> Self {
        RenderFn {
            params: self.params.clone(),
            jsx_element: self.jsx_element.clone(),
        }
    }
}


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
        ReactComponent {
            name,
            block_stmt,
        }
    }

    pub fn get_name(&self) -> String {
        self.name.clone()
    }

    pub fn is_valid (&self) -> bool {
        // todo 还要判断返回的JSX里面有没有 compilerMode
        self.name.chars().next().unwrap().is_uppercase()
    }
}