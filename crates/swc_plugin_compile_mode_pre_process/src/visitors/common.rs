
use std::{clone, collections::HashMap};

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

use super::is_compile_mode_component::IsCompileModeVisitor;



pub const COMPILE_MODE: &str = "compileMode";
pub const DEFAULT_COMPONENT: &str = "Default_Component";
pub const COMPILE_MODE_SUB_COMPONENT: &str = "compileModeSubComponent";
pub struct RenderFn {
    pub params: ArrowAndFnParams,
    pub jsx_element: JSXElement,
}

impl RenderFn {
    pub fn new(params: ArrowAndFnParams, jsx_element: JSXElement) -> Self {
        RenderFn {
            params,
            jsx_element,
        }
    }
}

impl Clone for RenderFn {
    fn clone(&self) -> Self {
        RenderFn {
            params: self.params.clone(),
            jsx_element: self.jsx_element.clone(),
        }
    }
}

pub enum ArrowAndFnParams {
    Arrow(Vec<Pat>),
    Fn(Vec<Param>),
}

impl clone::Clone for ArrowAndFnParams {
    fn clone(&self) -> Self {
        match self {
            ArrowAndFnParams::Arrow(params) => ArrowAndFnParams::Arrow(params.clone()),
            ArrowAndFnParams::Fn(params) => ArrowAndFnParams::Fn(params.clone()),
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

    pub fn is_valid (&mut self) -> bool {
        // 1. 名称是否是大写字母开头
        let is_first_char_uppercase =  self.get_name().chars().next().unwrap().is_uppercase();
        // 2. 返回的 JSX 里面有没有 compilerMode
        let mut is_compile_mode_component: IsCompileModeVisitor = IsCompileModeVisitor::new();
        if let Some(block_stmt) = &mut self.block_stmt {
            block_stmt.visit_mut_with(&mut is_compile_mode_component);
        }
        is_first_char_uppercase && is_compile_mode_component.valid
    }
}