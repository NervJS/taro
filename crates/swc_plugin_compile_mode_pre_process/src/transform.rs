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
use crate::PluginConfig;
pub struct TransformVisitor {
    
}

impl TransformVisitor {
    pub fn new(config: PluginConfig) -> Self {
        TransformVisitor {
            
        }
    }
}

impl VisitMut for TransformVisitor {
    fn visit_mut_jsx_element (&mut self, el: &mut JSXElement) {
        match &el.opening.name {
            JSXElementName::Ident(ident) => {
                println!("TagName {}", ident.sym);
            },
            _ => {
                println!("??");
            }
        }
        el.visit_mut_children_with(self)
    }
}