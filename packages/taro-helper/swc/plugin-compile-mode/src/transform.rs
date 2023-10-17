
use swc_core::{
    common::{
        util::take::Take,
        DUMMY_SP as span
    },
    ecma::{
        self,
        ast::*,
        atoms::Atom,
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
    pub get_tmpl_name: Box<dyn FnMut() -> String>
}

impl TransformVisitor {
    pub fn new (config: PluginConfig) -> Self {
        let get_tmpl_name = Box::new(utils::named_iter(
            format!("{}t", config.tmpl_prefix)
        ));
        Self {
            config,
            is_compile_mode: false,
            node_stack: vec![],
            templates: HashMap::new(),
            get_tmpl_name
        }
    }

    fn build_xml_element (&mut self, el: &mut JSXElement) -> String {
        let opening_element = &mut el.opening;
        match &opening_element.name {
            JSXElementName::Ident(ident) => {
                let name = utils::to_kebab_case(&ident.sym);
                match self.config.components.get(&name) {
                    // 内置组件
                    Some(attrs_map) => {
                        let attrs = self.build_xml_attrs(opening_element, attrs_map);
                        let children = self.build_xml_children(el);
                        format!("<{}{}>{}</{}>", name, attrs, children, name)
                    },
                    // TODO 原生自定义组件
                    // TODO React 组件
                    None => String::new()
                }
            }
            _ => String::new()
        }
    }

    fn build_xml_attrs (&self, opening_element: &mut JSXOpeningElement, attrs_map: &HashMap<String, String>) -> String {
        let mut props = HashMap::new();
        let mut attrs_string = String::new();

        opening_element.attrs.retain_mut(|attr| {
            if let JSXAttrOrSpread::JSXAttr(jsx_attr) = attr {
                if let JSXAttrName::Ident(Ident { sym: name, .. }) = &jsx_attr.name {
                    let jsx_attr_name = name.to_string();
                    let miniapp_attr_name = utils::convert_jsx_attr_key(&jsx_attr_name, &self.config.adapter);
                    let event_name = utils::identify_jsx_event_key(&jsx_attr_name);
                    let is_event = event_name.is_some();
                    match &jsx_attr.value {
                        Some(jsx_attr_value) => {
                            match jsx_attr_value {
                                JSXAttrValue::Lit(Lit::Str(Str { value, ..  })) => {
                                    // 静态属性在 xml 中保留即可，jsx 中可以删除
                                    if jsx_attr_name != COMPILE_MODE {
                                        props.insert(miniapp_attr_name, value.to_string());
                                        return false
                                    }
                                },
                                JSXAttrValue::JSXExprContainer(..) => {
                                    let mut node_path = self.get_current_node_path();
                                    if is_event {
                                        props.insert(event_name.unwrap(), String::from("eh"));
                                        if props.get("data-sid").is_none() {
                                            props.insert(String::from("data-sid"), format!("{{{{{}.sid}}}}", node_path));
                                        }
                                        return true
                                    }

                                    // 小程序组件标准属性 -> 取 @tarojs/shared 传递过来的属性值；非标准属性 -> 取属性名
                                    let value: &str = attrs_map.get(&miniapp_attr_name).unwrap_or(&jsx_attr_name);
                                    // 按当前节点在节点树中的位置换算路径
                                    node_path.push('.');
                                    let value = if value.contains("i.") {
                                        value.replace("i.", &node_path)
                                    } else {
                                        format!("{}{}", node_path, value)
                                    };
                                    // 得出最终的模板属性值
                                    let miniapp_attr_value = format!("{{{{{}}}}}", value);

                                    props.insert(miniapp_attr_name, miniapp_attr_value);
                                },
                                _ => ()
                            }
                        },
                        None => {
                            // 布尔值在 jsx 中也可以删除了
                            props.insert(miniapp_attr_name, String::from("true"));
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

        // 生成的 template 需要幂等
        let mut keys: Vec<&String> = props.keys().collect();
        keys.sort();
        for key in keys {
            let value = props.get(key).unwrap();
            attrs_string.push_str(&format!(r#" {}="{}""#, key, value));
        }

        attrs_string
    }

    fn build_xml_children (&mut self, el: &mut JSXElement) -> String {
        let mut children_string = String::new();
        let mut retain_child_counter = 0;

        el.children
            .iter_mut()
            .for_each(|child| {
                self.node_stack.push(retain_child_counter);
                match child {
                    JSXElementChild::JSXElement(child_el) => {
                        let child_string = self.build_xml_element(&mut **child_el);
                        children_string.push_str(&child_string);

                        let is_pure = utils::is_static_jsx(child_el);
                        if is_pure {
                            let raw: Atom = "To be removed".into();
                            *child = JSXElementChild::JSXText(JSXText { span, value: raw.clone(), raw });
                        } else {
                            retain_child_counter = retain_child_counter + 1;
                        }
                    },
                    JSXElementChild::JSXExprContainer(JSXExprContainer {
                        expr: JSXExpr::Expr(jsx_expr),
                        ..
                    }) => {
                        // TODO 只要表达式不包含 JSX，都可以转为取值？
                        match &mut **jsx_expr {
                            Expr::Ident(_) => {
                                let node_path = self.get_current_node_path();
                                let code = format!("{{{{{}.v}}}}", node_path);
                                children_string.push_str(&code);
                            },
                            Expr::Bin(BinExpr { op, left, right, .. }) => {
                                if *op == op!("&&") {
                                    let mut handle_condition_if = |el: &mut Box<JSXElement>| {
                                        let opening = &mut el.opening;
                                        opening.attrs.push(JSXAttrOrSpread::JSXAttr(JSXAttr {
                                            span,
                                            name: JSXAttrName::Ident(Ident::new("compileIf".into(), span)),
                                            value: Some(JSXAttrValue::JSXExprContainer(JSXExprContainer {
                                                span,
                                                expr: JSXExpr::Expr(left.take())
                                            }))
                                        }));

                                        let child_string = self.build_xml_element(el);
                                        children_string.push_str(&child_string);
                                    };
                                    match &mut **right {
                                        Expr::JSXElement(el) => {
                                            handle_condition_if(el);
                                            **jsx_expr = Expr::JSXElement(el.take());
                                        },
                                        Expr::Paren(ParenExpr { expr: paren_expr, .. }) => {
                                            if paren_expr.is_jsx_element() {
                                                let el = paren_expr.as_mut_jsx_element().unwrap();
                                                handle_condition_if(el);
                                                **jsx_expr = Expr::JSXElement(el.take());
                                            }
                                        },
                                        _ => ()
                                    }
                                }
                            },
                            _ => {
                                println!("_ expr: {:?} ", jsx_expr);
                            }
                        }
                        retain_child_counter = retain_child_counter + 1
                    },
                    JSXElementChild::JSXText(jsx_text) => {
                        if !utils::is_empty_jsx_text_line(&jsx_text.value) {
                            children_string.push_str(&jsx_text.value);
                        }
                    },
                    _ => ()
                }
                self.node_stack.pop();
            });

        el.children.retain_mut(|item| {
            // JSX 过滤掉静态文本节点，只在模板中保留
            match item {
                JSXElementChild::JSXText(jsx_text) => {
                    utils::is_empty_jsx_text_line(&jsx_text.value)
                },
                _ => true
            }
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
                        tmpl_name = (self.get_tmpl_name)();
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

        let mut keys: Vec<&String> = self.templates.keys().collect();
        keys.sort();
        let stmts_being_inserted = keys.into_iter()
            .map(|key| {
                let value = self.templates.get(key).unwrap();
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
