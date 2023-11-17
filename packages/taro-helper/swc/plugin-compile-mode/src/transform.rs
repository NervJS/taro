
use swc_core::{
    common::{
        iter::IdentifyLast,
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
use std::rc::Rc;
use crate::PluginConfig;
use crate::utils::{self, constants::*};

struct PreVisitor {
    is_in_jsx_expr_container: Rc<bool>,
    is_in_and_expr: bool,
}
impl PreVisitor {
    fn new () -> Self {
        Self {
            is_in_jsx_expr_container: Rc::new(true),
            is_in_and_expr: false
        }
    }
}
impl VisitMut for PreVisitor {
    fn visit_mut_jsx_expr_container (&mut self, container: &mut JSXExprContainer) {
        let _counter = Rc::clone(&self.is_in_jsx_expr_container);
        // TODO 目前的判断可能误伤函数内的三元表达式、条件表达式
        container.visit_mut_children_with(self);
    }
    fn visit_mut_expr (&mut self, expr: &mut Expr) {
        if Rc::strong_count(&self.is_in_jsx_expr_container) == 1 { return };
        let mut is_first_and_expr = false;
        
        match expr {
            Expr::Bin(BinExpr { op, left, right, ..}) => {
                // C&&A 替换为 C?A:A'，原因是为了无论显示还是隐藏都保留一个元素，从而不影响兄弟节点的变量路径
                if *op == op!("&&") && !self.is_in_and_expr {
                    is_first_and_expr = true;
                    fn inject_compile_if (el: &mut Box<JSXElement>, condition: &mut Box<Expr>) -> () {
                        el.opening.attrs.push(utils::create_jsx_expr_attr(COMPILE_IF, condition.clone()));
                    }
                    fn get_element_double (element_name: JSXElementName, condition: &mut Box<Expr>, right: &mut Box<Expr>) -> Expr {
                        Expr::Cond(CondExpr {
                            span,
                            test: condition.take(),
                            cons: right.take(),
                            alt: Box::new(utils::create_self_closing_jsx_element_expr(
                                element_name, // element 替换为同类型的元素。在显示/隐藏切换时，让运行时 diff 只更新必要属性而不是整个节点刷新
                                Some(vec![utils::create_jsx_bool_attr(COMPILE_IGNORE)]
                            )))
                        })
                    }
                    match &mut **right {
                        Expr::JSXElement(el) => {
                            let element_name = el.opening.name.clone();
                            inject_compile_if(el, left);
                            *expr = get_element_double(element_name, left, right);
                        },
                        Expr::Paren(ParenExpr { expr: paren_expr, .. }) => {
                            if paren_expr.is_jsx_element() {
                                let el: &mut Box<JSXElement> = paren_expr.as_mut_jsx_element().unwrap();
                                let element_name = el.opening.name.clone();
                                inject_compile_if(el, left);
                                *expr = get_element_double(element_name, left, paren_expr);
                            }
                        },
                        Expr::Lit(_) => {
                            *expr = Expr::Cond(CondExpr {
                                span,
                                test: left.take(),
                                cons: right.take(),
                                alt: Box::new(Expr::Lit(Lit::Str(Str { span, value: COMPILE_IGNORE.into(), raw: None })))
                            })
                        },
                        _ => {
                            // TODO Unknown fallback to template
                            println!("unknown expr: {right:?}");
                        }
                    }
                }
            },
            Expr::Cond(CondExpr { test, cons, alt, ..}) => {
                let compile_if = utils::create_jsx_expr_attr(COMPILE_IF, test.clone());
                let compile_else = utils::create_jsx_bool_attr(COMPILE_ELSE);
                let process_cond_arm = |arm: &mut Box<Expr>, attr: JSXAttrOrSpread| {
                    match &mut **arm {
                        Expr::JSXElement(el) => {
                            el.opening.attrs.push(attr);
                        },
                        _ => {
                            let temp = arm.take();
                            let jsx_el_name = JSXElementName::Ident(Ident { span, sym: "block".into(), optional: false });
                            **arm = Expr::JSXElement(Box::new(JSXElement {
                                span,
                                opening: JSXOpeningElement { name: jsx_el_name.clone(), span, attrs: vec![attr], self_closing: false, type_args: None },
                                children: vec![JSXElementChild::JSXExprContainer(JSXExprContainer { span, expr: JSXExpr::Expr(temp)})],
                                closing: Some(JSXClosingElement { span, name: jsx_el_name })
                            }))
                        }
                    }
                };
                process_cond_arm(cons, compile_if);
                process_cond_arm(alt, compile_else);
            },
            _ => (),
        }

        if is_first_and_expr {
            self.is_in_and_expr = true;
        }

        expr.visit_mut_children_with(self);

        if is_first_and_expr {
            self.is_in_and_expr = false;
        }
    }
}

pub struct TransformVisitor {
    pub config: PluginConfig,
    pub is_compile_mode: bool,
    pub node_stack: Vec<i32>,
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
                        if attrs.is_none() { return String::new() };
                        let children = self.build_xml_children(el);
                        format!("<{}{}>{}</{}>", name, attrs.unwrap(), children, name)
                    },
                    None => {
                        // React 组件
                        // 原生自定义组件
                        let node_path = self.get_current_node_path();
                        format!(r#"<template is="{{{{xs.a(c, {}.nn, l)}}}}" data="{{{{i:{},c:c+1,l:xs.f(l,{}.nn)}}}}" />"#, node_path, node_path, node_path)
                    }
                }
            }
            _ => String::new()
        }
    }

    fn build_xml_attrs (&self, opening_element: &mut JSXOpeningElement, attrs_map: &HashMap<String, String>) -> Option<String> {
        let mut props = HashMap::new();
        let mut attrs_string = String::new();

        opening_element.attrs.retain_mut(|attr| {
            if let JSXAttrOrSpread::JSXAttr(jsx_attr) = attr {
                if let JSXAttrName::Ident(Ident { sym: name, .. }) = &jsx_attr.name {
                    let jsx_attr_name = name.to_string();
                    
                    if jsx_attr_name == "key" {
                        return true;
                    }

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
                                        props.insert(event_name.unwrap(), String::from(EVENT_HANDLER));
                                        if props.get(DATA_SID).is_none() {
                                            props.insert(String::from(DATA_SID), format!("{{{{{}.sid}}}}", node_path));
                                        }
                                        return true
                                    }

                                    // 小程序组件标准属性 -> 取 @tarojs/shared 传递过来的属性值；非标准属性 -> 取属性名
                                    let value: &str = attrs_map.get(&miniapp_attr_name).unwrap_or(&jsx_attr_name);
                                    // 按当前节点在节点树中的位置换算路径
                                    node_path.push('.');
                                    let value = if value.contains(TMPL_DATA_ROOT) {
                                        value.replace(TMPL_DATA_ROOT, &node_path)
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
                            if
                                jsx_attr_name == COMPILE_ELSE ||
                                jsx_attr_name == COMPILE_IGNORE
                            {
                                props.insert(miniapp_attr_name, String::from(jsx_attr_name));
                            } else if jsx_attr_name == COMPILE_FOR {
                                let current_path = self.get_current_loop_path();
                                let miniapp_attr_value = format!("{{{{{}}}}}", current_path);
                                props.insert(miniapp_attr_name, miniapp_attr_value);
                            } else {
                                props.insert(miniapp_attr_name, String::from("true"));
                            }
                            // 布尔值在 jsx 中也可以删除了
                            return false
                        }
                    }
                }
            }
            return true
        });

        // 组件包含事件，但没有设置自定义 id 的话，把 id 设为 sid
        if props.get(DATA_SID).is_some() && props.get(ID).is_none() {
            props.insert(String::from(ID), props.get(DATA_SID).unwrap().clone());
        }

        // 生成的 template 需要幂等
        let mut keys: Vec<&String> = props.keys().collect();
        keys.sort();
        for key in keys {
            let value = props.get(key).unwrap();
            if value == COMPILE_IGNORE {
                return None
            } else if value == COMPILE_ELSE {
                attrs_string.push_str(&format!(" {}", key));
            } else {
                attrs_string.push_str(&format!(r#" {}="{}""#, key, value));
            }
        }

        Some(attrs_string)
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
                        if let Expr::Paren(ParenExpr { expr, .. }) = &mut **jsx_expr {
                            *jsx_expr = expr.take();
                        }
                        match &mut **jsx_expr {
                            Expr::Cond(CondExpr { cons, alt, ..}) => {
                                let mut process_condition_expr = |arm: &mut Box<Expr>| {
                                    match &mut **arm {
                                        Expr::JSXElement(el) => {
                                            let child_string = self.build_xml_element(el);
                                            children_string.push_str(&child_string);
                                        },
                                        Expr::Lit(lit) => {
                                            if let Lit::Str(Str { value, .. }) = lit {
                                                if &*value == COMPILE_IGNORE {
                                                    return ();
                                                }
                                            }
                                            let current_path = self.get_current_node_path();
                                            // {condition1 && 'Hello'} 在预处理时会变成 {condition1 ? 'Hello' : "compileIgnore"}
                                            // 而普通文本三元则会被 block 标签包裹，因此处理后只有上述情况会存在 lit 类型的表达式
                                            // 由于这种情况没有办法使用 wx:if 来处理，需要特殊处理成 {{i.cn[3].v==="compileIgnore"?"":i.cn[3].v}} 的形式
                                            let str = format!(r#"{{{{{}.v==="{}"?"":{}.v}}}}"#, current_path, COMPILE_IGNORE, current_path);
                                            children_string.push_str(&str);
                                        },
                                        _ => ()
                                    }
                                };
                                process_condition_expr(cons);
                                process_condition_expr(alt);
                            },
                            Expr::Call(CallExpr {
                                callee: Callee::Expr(callee_expr),
                                args,
                                ..
                            }) => {
                                // 处理循环
                                if let Some(return_value) =  utils::extract_jsx_loop(callee_expr, args) {
                                    self.node_stack.pop();
                                    self.node_stack.push(LOOP_WRAPPER_ID);
                                    let child_string = self.build_xml_element(&mut *return_value);
                                    children_string.push_str(&child_string);
                                }
                            },
                            // TODO 只支持 render 开头的函数调用返回 JSX
                            // Expr::Call(_)
                            _ => {
                                // println!("_ expr: {:?} ", jsx_expr);
                                let node_path = self.get_current_node_path();
                                let code = format!("{{{{{}.v}}}}", node_path);
                                children_string.push_str(&code);
                            }
                        }
                        retain_child_counter = retain_child_counter + 1
                    },
                    JSXElementChild::JSXText(jsx_text) => {
                        let content = utils::jsx_text_to_string(&jsx_text.value);
                        if !content.is_empty() {
                            children_string.push_str(&content);
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
                if item == &LOOP_WRAPPER_ID {
                    return String::from("item")
                }
                acc.push_str(&format!(".cn[{}]", item));
                return acc;
            })
    }

    fn get_current_loop_path (&self) -> String {
        // return: i.cn[0]...cn
        self.node_stack
            .iter()
            .identify_last()
            .fold(String::from("i"), |mut acc, (is_last, item)| {
                let str = if is_last {
                    String::from(".cn")
                } else {
                    if item == &LOOP_WRAPPER_ID {
                        return String::from("item")
                    }
                    format!(".cn[{}]", item)
                };
                acc.push_str(&str);
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
            el.visit_mut_children_with(&mut PreVisitor::new());
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
