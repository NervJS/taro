
use swc_core::{
    common::{
        util::take::Take,
        DUMMY_SP as span
    },
    ecma::{
        self,
        ast::*,
        visit::{VisitMut, VisitMutWith},
    },
};
use std::collections::HashMap;
use crate::PluginConfig;
use crate::utils::{self, constants::*};

pub struct TransformVisitor {
    pub config: PluginConfig,
    pub is_compile_mode: bool,
    pub node_stack: Vec<usize>,
    pub templates: HashMap<String, String>,
}

impl TransformVisitor {
    pub fn new (config: PluginConfig) -> Self {
        Self {
            config,
            is_compile_mode: false,
            node_stack: vec![],
            templates: HashMap::new(),
        }
    }

    fn build_xml_element (&mut self, el: &mut JSXElement) -> String {
        let opening_element = &mut el.opening;
        match &opening_element.name {
            JSXElementName::Ident(ident) => {
                // @TODO 内置组件才算
                let name = ident.sym.to_lowercase();
                let alias_map = self.config.component_alias.get(&name);
                let attrs = self.build_xml_attrs(opening_element, alias_map);
                let children = self.build_xml_children(el);
                format!("<{}{}>{}</{}>", name, attrs, children, name)
            }
            _ => String::new()
        }
    }

    fn build_xml_attrs (&self, opening_element: &mut JSXOpeningElement, alias_map: Option<&HashMap<String, String>>) -> String {
        let mut props = HashMap::new();
        let mut attrs_string = String::new();

        opening_element.attrs.retain_mut(|attr| {
            if let JSXAttrOrSpread::JSXAttr(jsx_attr) = attr {
                if let JSXAttrName::Ident(Ident { sym: name, .. }) = &jsx_attr.name {
                    let key = name.to_string();
                    let event_name = utils::identify_jsx_event_key(&key);
                    let is_event = event_name.is_some();
                    match &jsx_attr.value {
                        Some(jsx_attr_value) => {
                            match jsx_attr_value {
                                JSXAttrValue::Lit(Lit::Str(Str { value, ..  })) => {
                                    // 静态属性在 xml 中保留即可，jsx 中可以删除
                                    if key != COMPILE_MODE {
                                        props.insert(key, value.to_string());
                                        return false
                                    }
                                },
                                JSXAttrValue::JSXExprContainer(..) => {
                                    // @TODO xs 指令
                                    let node_path = self.get_current_node_path();
                                    if is_event {
                                        props.insert(event_name.unwrap(), String::from("eh"));
                                        if props.get("data-sid").is_none() {
                                            props.insert(String::from("data-sid"), format!("{{{{{}.sid}}}}", node_path));
                                        }
                                        return true
                                    }
                                    let attr_alias: &str = match alias_map {
                                        Some(m) => {
                                            let alias = m.get(&key).unwrap_or(&key);
                                            if alias == "className" {
                                                "cl"
                                            } else if alias == "style" {
                                                "st"
                                            } else {
                                                alias
                                            }
                                        },
                                        None => &key
                                    };
                                    let val = format!("{{{{{}.{}}}}}", node_path, attr_alias);
                                    props.insert(key, val);
                                },
                                _ => ()
                            }
                        },
                        None => {
                            // 布尔值属在 jsx 中也可以删除了
                            props.insert(key, String::from("true"));
                            return false
                        }
                    }
                }
            }
            return true
        });

        // 组件包含事件，但没有设置自定义 id 的话，把 id 设为 sid
        if props.get("data-sid").is_some() && props.get("id").is_none() {
            props.insert(String::from("id"), props.get("data-sid").unwrap().clone());
        }

        for (key, value) in props {
            let key = utils::convert_jsx_attr_key(&key, &self.config.adapter);
            attrs_string.push_str(&format!(r#" {}="{}""#, key, value));
        }

        attrs_string
    }

    fn build_xml_children (&mut self, el: &mut JSXElement) -> String {
        let mut children_string = String::new();

        el.children
            .iter_mut()
            .filter(|child| {
                // 过滤只包含换行、空格、制表符的 JSXText
                match child {
                    JSXElementChild::JSXText(JSXText { value, ..}) => {
                        return !utils::is_empty_jsx_text_line(value);
                    },
                    _ => return true
                }
            })
            .enumerate()
            .for_each(|(idx, child)| {
                self.node_stack.push(idx);
                match child {
                    JSXElementChild::JSXElement(child_el) => {
                        let child_string = self.build_xml_element(&mut **child_el);
                        children_string.push_str(&child_string);
                    },
                    JSXElementChild::JSXExprContainer(JSXExprContainer {
                        expr: JSXExpr::Expr(jsx_expr),
                        ..
                    }) => {
                        // @TODO 只要表达式不包含 JSX，都可以转为取值？
                        match &mut **jsx_expr {
                            Expr::Ident(_) => {
                                let node_path = self.get_current_node_path();
                                let code = format!("{{{{{}.v}}}}", node_path);
                                children_string.push_str(&code);
                            },
                            Expr::Bin(BinExpr { op, left, right, .. }) => {
                                if *op == op!("&&") {
                                    if let Expr::Paren(ParenExpr { expr : paren_expr, .. }) = &mut **right {
                                        if paren_expr.is_jsx_element() {
                                            let el = paren_expr.as_mut_jsx_element().unwrap();
                                            let opening = &mut el.opening;

                                            opening.attrs.push(JSXAttrOrSpread::JSXAttr(JSXAttr {
                                                span,
                                                name: JSXAttrName::Ident(Ident::new("compileIf".into(), span)),
                                                value: Some(JSXAttrValue::JSXExprContainer(JSXExprContainer {
                                                    span,
                                                    expr: JSXExpr::Expr(left.take())
                                                })),
                                            }));

                                            let child_string = self.build_xml_element(&mut **el);
                                            children_string.push_str(&child_string);

                                            let right = paren_expr.take();
                                            *jsx_expr = right;
                                        }
                                    }
                                }
                            },
                            _ => {
                                println!("_ expr: {:?} ", jsx_expr);
                            }
                        }
                    },
                    JSXElementChild::JSXText(jsx_text) => {
                        // @TODO JSX 是否要过滤掉静态文本节点
                        children_string.push_str(&jsx_text.value);
                    },
                    _ => ()
                }
                self.node_stack.pop();
            });

        children_string
    }

    fn get_current_node_path (&self) -> String {
        // return: i.cn[0].cn[0]....
        self.node_stack
            .iter()
            .fold(String::from("i"), |mut acc, item| {
                acc.push_str(&format!(".cn[{}]", item));
                return acc;
            })
    }
}

impl VisitMut for TransformVisitor {
    // Implement necessary visit_mut_* methods for actual custom transform.
    // A comprehensive list of possible visitor methods can be found here:
    // https://rustdoc.swc.rs/swc_ecma_visit/trait.VisitMut.html
    fn visit_mut_jsx_element (&mut self, el: &mut JSXElement) {
        let mut tmpl_name = String::new();
        for attr in &mut el.opening.attrs {
            if let JSXAttrOrSpread::JSXAttr(jsx_attr) = attr {
                if let JSXAttrName::Ident(jsx_attr_name) = &jsx_attr.name {
                    if &*jsx_attr_name.sym == COMPILE_MODE {
                        self.is_compile_mode = true;
                        let tmpl_prefix = format!("{}t", self.config.tmpl_prefix);
                        // @TODO 测试同一文件多个编译模式的情况
                        let mut get_tmpl_name = utils::named_iter(&tmpl_prefix);
                        tmpl_name = get_tmpl_name();
                        jsx_attr.value = Some(JSXAttrValue::Lit(Lit::Str(Str {
                            span,
                            value: tmpl_name.clone().into(),
                            raw: None,
                        })));
                        break;
                    }
                }
            }
        }
        if self.is_compile_mode {
            let tmpl_contents = format!(r#"<template name="tmpl_0_{}">{}</template>"#,
                &tmpl_name,
                self.build_xml_element(el)
            );
            self.templates.insert(tmpl_name, tmpl_contents);
            self.is_compile_mode = false;
        } else {
            el.visit_mut_children_with(self)
        }
    }

    fn visit_mut_module_items (&mut self, body_stmts: &mut Vec<ModuleItem>) {
        body_stmts.visit_mut_children_with(self);

        let stmts_being_inserted = self.templates.iter()
            .map(|(key, value)| {
                println!("value.as_str().into(): {}", value);
                ModuleItem::Stmt(Stmt::Decl(Decl::Var(Box::new(VarDecl {
                    span,
                    kind: VarDeclKind::Const,
                    declare: false,
                    decls: vec![VarDeclarator {
                        span,
                        name: Pat::Ident(Ident::new(format!("TARO_TEMPLATES_{}", key).as_str().into(), span).into()),
                        init: Some(Box::new(Expr::Lit(Lit::Str(Str {
                            span,
                            value: value.as_str().into(),
                            raw: None
                        })))),
                        definite: false,
                    }],
                }))))
            });
        ecma::utils::prepend_stmts(body_stmts, stmts_being_inserted);
    }
}
