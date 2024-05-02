
use swc_core::{
    common::{
        iter::IdentifyLast,
        util::take::Take,
        DUMMY_SP as span,
        Spanned,
    },
    ecma::{
        self,
        ast::*,
        visit::{VisitMut, VisitMutWith},
        utils::{quote_ident, quote_str},
    },
    plugin::errors::HANDLER,
    atoms::Atom,
};
use std::collections::HashMap;
use crate::{PluginConfig, utils::as_xscript_expr_string};
use crate::utils::{self, constants::*};

struct PreVisitor;
impl PreVisitor {
    fn new () -> Self {
        Self {}
    }
}
impl VisitMut for PreVisitor {
    fn visit_mut_jsx_element_children(&mut self, children: &mut Vec<JSXElementChild>) {
        let len = children.len();

        // 当 JSX 循环表达式存在兄弟节点，且这些兄弟节点中有动态节点（存在 JSX 表达式）时，
        // 自动为该循环体外层包裹一个 <block>。
        // 对应测试用例：should_loop_be_wrapped_when_its_not_the_only_child
        if len > 1 {
            let mut list: Vec<usize> = vec![];

            // 收集 JSX 循环表达式到 list
            children
                .iter()
                .enumerate()
                .for_each(|(i, child)| {
                    if let JSXElementChild::JSXExprContainer(JSXExprContainer { expr: JSXExpr::Expr(expr), .. }) = child {
                        if let Expr::Call(CallExpr { callee: Callee::Expr(callee_expr), args, .. }) = &**expr {
                            if utils::is_call_expr_of_loop(callee_expr, args) {
                                list.push(i);
                            }
                        }
                    }
                });

            // 遍历 list，为每个 child 的外层包裹 <block>
            fn wrap (list: Vec<usize>, children: &mut Vec<JSXElementChild>) {
                list.into_iter().for_each(|i| {
                    let child = &mut children[i];
                    if let JSXElementChild::JSXExprContainer(JSXExprContainer { expr: JSXExpr::Expr(expr), .. }) = child {
                        let expr = expr.take();
                        *child = JSXElementChild::JSXElement(Box::new(JSXElement {
                            span,
                            opening: JSXOpeningElement {
                                name: JSXElementName::Ident(quote_ident!("block")),
                                span,
                                attrs: vec![],
                                self_closing: false,
                                type_args: None
                            },
                            children: vec![JSXElementChild::JSXExprContainer(JSXExprContainer { span, expr: JSXExpr::Expr(expr) })],
                            closing: Some(JSXClosingElement { span, name: JSXElementName::Ident(quote_ident!("block")) })
                        }));
                    }
                });
            }

            if list.len() == 1 {
                // 只有一个 JSX 循环表达式时，检查兄弟节点是否全是静态节点，如果不是则要包裹 <block>
                let mut pure = true;
                let index = list[0];
                for i in 0..len {
                    if i != index && !utils::is_static_jsx_element_child(&children[i]) {
                        pure = false;
                        break;
                    }
                }
                if !pure {
                    wrap(list, children);
                }
            } else if list.len() > 1 {
                // 有多个 JSX 循环表达式时一定要包裹 <block>
                wrap(list, children);
            }
        }

        children.visit_mut_children_with(self);
    }
    fn visit_mut_jsx_element_child (&mut self, child: &mut JSXElementChild) {
        if let JSXElementChild::JSXExprContainer(JSXExprContainer { expr: JSXExpr::Expr(expr), .. }) = child {
            if let Expr::Paren(ParenExpr { expr: e, .. }) = &mut **expr {
                *expr = e.take();
            }

            match &mut **expr {
                Expr::Bin(BinExpr { op, left, right, ..}) => {
                    // C&&A 替换为 C?A:A'，原因是为了无论显示还是隐藏都保留一个元素，从而不影响兄弟节点的变量路径
                    if *op == op!("&&") {
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
                                **expr = get_element_double(element_name, left, right);
                            },
                            Expr::Paren(ParenExpr { expr: paren_expr, .. }) => {
                                if paren_expr.is_jsx_element() {
                                    let el: &mut Box<JSXElement> = paren_expr.as_mut_jsx_element().unwrap();
                                    let element_name = el.opening.name.clone();
                                    inject_compile_if(el, left);
                                    **expr = get_element_double(element_name, left, paren_expr);
                                }
                            },
                            Expr::Lit(_) => {
                                **expr = Expr::Cond(CondExpr {
                                    span,
                                    test: left.take(),
                                    cons: right.take(),
                                    alt: Box::new(Expr::Lit(Lit::Str(quote_str!(COMPILE_IGNORE))))
                                })
                            },
                            _ => {
                                let jsx_el_name = JSXElementName::Ident(quote_ident!("block"));
                                let mut block = Box::new(JSXElement {
                                    span,
                                    opening: JSXOpeningElement { name: jsx_el_name.clone(), span, attrs: vec![], self_closing: false, type_args: None },
                                    children: vec![JSXElementChild::JSXExprContainer(JSXExprContainer { span, expr: JSXExpr::Expr(right.take()) })],
                                    closing: Some(JSXClosingElement { span, name: jsx_el_name.clone() })
                                });
                                inject_compile_if(&mut block, left);
                                **expr = get_element_double(jsx_el_name, left, &mut Box::new(Expr::JSXElement(block)));
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
                                let jsx_el_name = JSXElementName::Ident(quote_ident!("block"));
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

            expr.visit_mut_children_with(self);
        } else {
            child.visit_mut_children_with(self);
        }
    }
}

pub struct TransformVisitor {
    pub config: PluginConfig,
    pub is_compile_mode: bool,
    pub node_stack: Vec<i32>,
    pub templates: HashMap<String, String>,
    pub get_tmpl_name: Box<dyn FnMut() -> String>,
    pub xs_module_names: Vec<String>,
    pub xs_sources: Vec<String>,
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
            get_tmpl_name,
            xs_module_names: vec![],
            xs_sources: vec![],
        }
    }

    fn build_xml_element (&mut self, el: &mut JSXElement) -> String {
        let is_inner_component = utils::is_inner_component(el, &self.config);
        let opening_element = &mut el.opening;

        match &opening_element.name {
            JSXElementName::Ident(ident) => {
                if is_inner_component {
                    // 内置组件
                    let mut name = utils::to_kebab_case(ident.as_ref());
                    let attrs = self.build_xml_attrs(opening_element, &name);
                    if attrs.is_none() { return String::new() };
                    let (children, ..) = self.build_xml_children(&mut el.children, None);

                    if utils::is_xscript(&name) {
                        name = match self.config.adapter.get("xs") {
                            Some(xs) => {
                                xs.to_string()
                            },
                            None => {
                                HANDLER.with(|handler| {
                                    handler
                                        .struct_span_err(el.span, "Taro CompileMode 语法错误")
                                        .span_label(el.span, "当前小程序平台不支持 xs 语法")
                                        .emit();
                                    panic!()
                                })
                            }
                        };
                    }

                    format!("<{}{}>{}</{}>", name, attrs.unwrap_or_default(), children, name)
                } else {
                    // 回退到旧的渲染模式（React 组件、原生自定义组件）
                    let node_path = self.get_current_node_path();
                    format!(r#"<template is="{{{{xs.a(c, {}.nn, l)}}}}" data="{{{{i:{},c:c+1,l:xs.f(l,{}.nn)}}}}" />"#, node_path, node_path, node_path)
                }
            }
            JSXElementName::JSXMemberExpr(JSXMemberExpr { prop, .. }) => {
                if prop.sym == "Provider" {
                    let idx = self.node_stack.pop().map(|i| i as u32);
                    let (children, ..) = self.build_xml_children(&mut el.children, idx);
                    children
                } else {
                    // 回退到旧的渲染模式
                    let node_path = self.get_current_node_path();
                    format!(r#"<template is="{{{{xs.a(c, {}.nn, l)}}}}" data="{{{{i:{},c:c+1,l:xs.f(l,{}.nn)}}}}" />"#, node_path, node_path, node_path)
                }
            }
            _ => String::new()
        }
    }

    fn build_xml_attrs (&mut self, opening_element: &mut JSXOpeningElement, element_name: &str) -> Option<String> {
        let mut props = HashMap::new();
        let mut attrs_string = String::new();
        let attrs_map = self.config.components.get(element_name).unwrap();
        let is_xscript = utils::is_xscript(element_name);
        let mut attrs_wait_for_inserting: Vec<JSXAttrOrSpread> = vec![];
        let mut get_xs_attrs_name = utils::named_iter("xs".into());

        opening_element.attrs.retain_mut(|attr| {
            if let JSXAttrOrSpread::JSXAttr(jsx_attr) = attr {
                if let JSXAttrName::Ident(Ident { sym: name, .. }) = &jsx_attr.name {
                    let jsx_attr_name = name.to_string();

                    if REACT_RESERVED.contains(&jsx_attr_name.as_str()) {
                        return true;
                    }

                    let miniapp_attr_name = utils::convert_jsx_attr_key(&jsx_attr_name, &self.config.adapter);
                    let event_name = utils::identify_jsx_event_key(&jsx_attr_name, &self.config.platform);
                    let is_event = event_name.is_some();
                    match &mut jsx_attr.value {
                        Some(jsx_attr_value) => {
                            match jsx_attr_value {
                                JSXAttrValue::Lit(Lit::Str(Str { value, ..  })) => {
                                    // 静态属性在 xml 中保留即可，jsx 中可以删除
                                    if jsx_attr_name != COMPILE_MODE {
                                        props.insert(miniapp_attr_name, value.to_string());
                                        return false
                                    }
                                },
                                JSXAttrValue::JSXExprContainer(JSXExprContainer { expr: jsx_expr, .. }) => {
                                    let mut node_path = self.get_current_node_path();

                                    // 处理 wxs 表达式属性
                                    if self.is_xscript_used() {
                                        if let JSXExpr::Expr(expr) = jsx_expr {
                                            match &mut **expr {
                                                // wxs 表达式
                                                Expr::Member(member) => {
                                                    let expr_string = as_xscript_expr_string(member, &self.xs_module_names);
                                                    if expr_string.is_some() {
                                                        let miniapp_attr_value = utils::gen_template(&expr_string.unwrap());
                                                        // 将结果输出到 <template>
                                                        props.insert(if is_event { event_name.unwrap() } else { miniapp_attr_name }, miniapp_attr_value);
                                                        // 该属性看作静态属性，可以从 JSX 中删除
                                                        return false
                                                    }
                                                },
                                                // wxs 调用表达式
                                                Expr::Call(CallExpr { callee: Callee::Expr(callee_expr), args, .. }) => {
                                                    if callee_expr.is_member() {
                                                        let expr_string = as_xscript_expr_string(callee_expr.as_member().unwrap(), &self.xs_module_names);
                                                        if expr_string.is_some() {
                                                            // 处理参数
                                                            let args_string: Vec<String> = args.iter_mut()
                                                                .map(|arg| {
                                                                    match &*arg.expr {
                                                                        Expr::Lit(lit) => {
                                                                            // 静态值：转换为字符串
                                                                            match lit {
                                                                                Lit::Str(Str { value, .. }) => { format!(r#"'{}'"#, value) },
                                                                                Lit::Num(Number { value, .. }) => { value.to_string() },
                                                                                Lit::Bool(Bool { value, .. }) => { value.to_string() },
                                                                                Lit::Null(_) => { String::from("null") },
                                                                                _ => {
                                                                                    HANDLER.with(|handler| {
                                                                                        handler
                                                                                            .struct_span_err(lit.span(), "Taro CompileMode 语法错误")
                                                                                            .span_label(lit.span(), "暂不支持传递此种类型的参数")
                                                                                            .emit();
                                                                                        panic!()
                                                                                    })
                                                                                },
                                                                            }
                                                                        }
                                                                        _ => {
                                                                            // 表达式
                                                                            let name = get_xs_attrs_name();
                                                                            let expr = arg.expr.take();
                                                                            // 把表达式记录下来，后续插入到相同节点的 JSX Attribute 中
                                                                            attrs_wait_for_inserting.push(JSXAttrOrSpread::JSXAttr(JSXAttr {
                                                                                span,
                                                                                name: JSXAttrName::Ident(quote_ident!(name.clone())),
                                                                                value: Some(JSXAttrValue::JSXExprContainer(JSXExprContainer { span, expr: JSXExpr::Expr(expr) }))
                                                                            }));
                                                                            format!("{}.{}", node_path, name)
                                                                        }
                                                                    }
                                                                })
                                                                .collect();
                                                            // 将结果输出到 <template>
                                                            let miniapp_attr_value = utils::gen_template(&format!("{}({})", expr_string.unwrap(), args_string.join(",")));
                                                            props.insert(miniapp_attr_name, miniapp_attr_value);
                                                            // 把该属性从 JSX 中删除
                                                            return false
                                                        }
                                                    }
                                                },
                                                _ => ()
                                            }
                                        }
                                    }

                                    // 处理事件属性
                                    if is_event {
                                        props.insert(event_name.unwrap(), String::from(EVENT_HANDLER));
                                        if props.get(DATA_SID).is_none() {
                                            props.insert(String::from(DATA_SID), format!("{{{{{}.sid}}}}", node_path));
                                        }
                                        return true
                                    }

                                    // 小程序组件标准属性 -> 取 @tarojs/shared 传递过来的属性值；非标准属性 -> 取属性名
                                    let value: &str = attrs_map.get(&miniapp_attr_name)
                                        .map(|res| res.as_str())
                                        .unwrap_or(if miniapp_attr_name == "id" { "uid" } else { &jsx_attr_name });
                                    // 按当前节点在节点树中的位置换算路径
                                    node_path.push('.');
                                    let value = if value.contains(TMPL_DATA_ROOT) {
                                        value.replace(TMPL_DATA_ROOT, &node_path)
                                    } else {
                                        format!("{}{}", node_path, value)
                                    };
                                    // 得出最终的模板属性值
                                    let miniapp_attr_value = utils::gen_template(&value);

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

        // 插入需要额外放进到 JSX Attribute 的属性
        for item in attrs_wait_for_inserting {
            opening_element.attrs.push(item)
        }

        // 组件包含事件，但没有设置自定义 id 的话，把 id 设为 sid
        if props.get(DATA_SID).is_some() && props.get(ID).is_none() {
            props.insert(String::from(ID), props.get(DATA_SID).unwrap().clone());
        }

        // 收集 wxs 标签上的 module 和 src 属性
        if is_xscript {
            let module = props.get("module");
            if module.is_some() {
                self.xs_module_names.push(module.unwrap().to_string());
            } else {
                HANDLER.with(|handler| {
                    handler
                        .struct_span_err(opening_element.span, "Taro CompileMode 语法错误")
                        .span_label(opening_element.span, "缺少 [module] 属性")
                        .emit();
                    panic!()
                })
            }
            let source = props.get("src");
            if source.is_some() {
                self.xs_sources.push(source.unwrap().to_string());
            } else {
                HANDLER.with(|handler| {
                    handler
                        .struct_span_err(opening_element.span, "Taro CompileMode 语法错误")
                        .span_label(opening_element.span, "缺少 [src] 属性")
                        .emit();
                    panic!()
                })
            }
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

    fn build_xml_children (&mut self, children: &mut Vec<JSXElementChild>, retain_start_from: Option<u32>) -> (String, u32) {
        let mut children_string = String::new();
        let start = if retain_start_from.is_some() { retain_start_from.unwrap() } else { 0 };
        let mut retain_child_counter = start;
        let mut jsx_exprs_wait_for_inserting: HashMap<u32, Box<Expr>> = HashMap::new();

        children
            .retain_mut(|child| {
                let mut is_retain = true;
                self.node_stack.push(retain_child_counter as i32);
                match child {
                    JSXElementChild::JSXElement(child_el) => {
                        let child_string = self.build_xml_element(&mut **child_el);
                        children_string.push_str(&child_string);

                        if utils::is_static_jsx(child_el) && utils::is_inner_component(child_el, &self.config) {
                            is_retain = false
                        } else {
                            retain_child_counter += 1;
                        }
                    },
                    JSXElementChild::JSXExprContainer(JSXExprContainer {
                        expr: JSXExpr::Expr(jsx_expr),
                        ..
                    }) => {
                        if let Expr::Paren(ParenExpr { expr, .. }) = &mut **jsx_expr {
                            *jsx_expr = expr.take();
                        }
                        let node_path = self.get_current_node_path();
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
                                                if value == COMPILE_IGNORE {
                                                    return ();
                                                }
                                            }
                                            // {condition1 && 'Hello'} 在预处理时会变成 {condition1 ? 'Hello' : "compileIgnore"}
                                            // 而普通文本三元则会被 block 标签包裹，因此处理后只有上述情况会存在 lit 类型的表达式
                                            // 由于这种情况没有办法使用 wx:if 来处理，需要特殊处理成 {{i.cn[3].v==="compileIgnore"?"":i.cn[3].v}} 的形式
                                            let str = format!(r#"{{{{{}.v==="{}"?"":{}.v}}}}"#, node_path, COMPILE_IGNORE, node_path);
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
                                } else if utils::is_render_fn(callee_expr) {
                                    let tmpl = format!(r#"<template is="{{{{xs.a(c, {}.nn, l)}}}}" data="{{{{i:{},c:c+1,l:xs.f(l,{}.nn)}}}}" />"#, node_path, node_path, node_path);
                                    children_string.push_str(&tmpl)
                                } else {
                                    let mut xscript_expr_string: Option<String> = None;

                                    if self.is_xscript_used() && callee_expr.is_member() {
                                        // 判断 callee 是否 wxs 表达式
                                        xscript_expr_string = utils::as_xscript_expr_string(callee_expr.as_member().unwrap(), &self.xs_module_names);
                                    }

                                    let code: String = if xscript_expr_string.is_some() {
                                        // wxs 调用表达式
                                        // 1. 处理参数
                                        //   1.1 将每个参数生成对应的 <template> 中的字符串，静态参数和动态参数分开处理
                                        //   1.2 把动态参数记录下来，稍后插入回去 JSX 中
                                        let args_string: String = args.iter_mut()
                                            .map(|arg| {
                                                match &mut*arg.expr {
                                                    Expr::Lit(lit) => {
                                                        match lit {
                                                            Lit::Str(Str { value, .. }) => { format!(r#""{}""#, value) },
                                                            Lit::Num(Number { value, .. }) => { value.to_string() },
                                                            Lit::Bool(Bool { value, .. }) => { value.to_string() },
                                                            Lit::Null(_) => { String::from("null") },
                                                            _ => {
                                                                HANDLER.with(|handler| {
                                                                    handler
                                                                        .struct_span_err(lit.span(), "Taro CompileMode 语法错误")
                                                                        .span_label(lit.span(), "暂不支持传递此种类型的参数")
                                                                        .emit();
                                                                    panic!()
                                                                })
                                                            },
                                                        }
                                                    }
                                                    _ => {
                                                        let expr = arg.expr.take();
                                                        jsx_exprs_wait_for_inserting.insert(retain_child_counter, expr);
                                                        self.node_stack.pop();
                                                        self.node_stack.push(retain_child_counter as i32);
                                                        let node_path = self.get_current_node_path();
                                                        retain_child_counter = retain_child_counter + 1;
                                                        format!("{}.v", node_path)
                                                    }
                                                }
                                            })
                                            .collect::<Vec<String>>()
                                            .join(",");
                                        // 2. 在 JSX 中删除此 JSX 表达式
                                        is_retain = false;
                                        // 3. 将结果直接输出到 <template>
                                        utils::gen_template(&format!("{}({})", xscript_expr_string.unwrap(), args_string))
                                    } else {
                                        // 正常的调用表达式，当作文本节点渲染
                                        utils::gen_template_v(&node_path)
                                    };
                                    children_string.push_str(&code);
                                }
                            },
                            _ => {
                                let mut xscript_expr_string: Option<String> = None;

                                if self.is_xscript_used() && jsx_expr.is_member() {
                                    // 判断是否 wxs 表达式
                                    xscript_expr_string = utils::as_xscript_expr_string(jsx_expr.as_member().unwrap(), &self.xs_module_names);
                                }

                                let code: String = if xscript_expr_string.is_some() {
                                    // wxs 表达式，可以从 JSX 中删除，将结果直接输出到 <template>
                                    is_retain = false;
                                    utils::gen_template(&xscript_expr_string.unwrap())
                                } else {
                                    // 正常的表达式，当作文本节点渲染
                                    utils::gen_template_v(&node_path)
                                };

                                children_string.push_str(&code);
                            }
                        }
                        if is_retain {
                            retain_child_counter = retain_child_counter + 1
                        }
                    },
                    JSXElementChild::JSXText(JSXText { value, .. }) => {
                        let content = utils::jsx_text_to_string(value);
                        if !content.is_empty() {
                            children_string.push_str(&content);
                            // JSX 过滤掉静态文本节点，只在模板中保留。同时保留用于换行、空格的静态文本节点
                            is_retain = false
                        }
                    },
                    JSXElementChild::JSXFragment(child_el) => {
                        self.node_stack.pop();
                        let (child_string, inner_retain) = self.build_xml_children(&mut child_el.children, Some(retain_child_counter));
                        children_string.push_str(&child_string);
                        if inner_retain == 0 {
                            // 静态 fragment，在 JSX 中删除
                            is_retain = false
                        } else {
                            retain_child_counter += inner_retain;
                        }
                        self.node_stack.push(retain_child_counter as i32);
                    },
                    _ => ()
                }
                self.node_stack.pop();
                return is_retain
            });

        // children 里使用了 wxs 函数，需要把该 wxs 函数用到的动态参数插回到 children 里。
        if jsx_exprs_wait_for_inserting.len() > 0 {
            let mut xs_args_ids: Vec<u32> = jsx_exprs_wait_for_inserting.keys().map(|k| k.clone()).collect();
            xs_args_ids.sort();
            for key in xs_args_ids {
                let value = jsx_exprs_wait_for_inserting.remove(&key).unwrap();
                children.insert(key as usize, JSXElementChild::JSXExprContainer(JSXExprContainer { span, expr: JSXExpr::Expr(value) }));
            }
        }

        (children_string, retain_child_counter - start)
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

    fn is_xscript_used (&self) -> bool {
        return self.xs_module_names.len() > 0
    }

    fn reset_states (&mut self) -> () {
        self.xs_module_names = vec![];
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
                    if jsx_attr_name.sym == COMPILE_MODE {
                        self.is_compile_mode = true;
                        tmpl_name = (self.get_tmpl_name)();
                        jsx_attr.value = Some(JSXAttrValue::Lit(Lit::Str(quote_str!(tmpl_name.as_str()))));
                        break;
                    }
                }
            }
        }
        if self.is_compile_mode {
            self.reset_states();
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
        let mut stmts_being_inserted: Vec<ModuleItem> = keys.into_iter()
            .map(|key| {
                let value = self.templates.get(key).unwrap();
                ModuleItem::Stmt(Stmt::Decl(Decl::Var(Box::new(VarDecl {
                    span,
                    kind: VarDeclKind::Const,
                    declare: false,
                    decls: vec![VarDeclarator {
                        span,
                        name: Pat::Ident(Ident::new(Atom::new(format!("TARO_TEMPLATES_{}", key)), span).into()),
                        init: Some(Box::new(Expr::Lit(Lit::Str(quote_str!(value.as_str()))))),
                        definite: false,
                    }],
                }))))
            })
            .collect();

        if self.xs_sources.len() > 0 {
            let elems: Vec<Option<ExprOrSpread>> = self.xs_sources.iter()
                .map(|item| {
                    Some(ExprOrSpread { spread: None, expr: Box::new(Expr::Lit(Lit::Str(quote_str!(item.clone()))))})
                })
                .collect();
            let list = Expr::Array(ArrayLit { span, elems });
            let module_stmt = ModuleItem::Stmt(Stmt::Decl(Decl::Var(Box::new(VarDecl {
                span,
                kind: VarDeclKind::Const,
                declare: false,
                decls: vec![VarDeclarator {
                    span,
                    name: Pat::Ident(Ident::new("TARO_XML_SOURCES".into(), span).into()),
                    init: Some(Box::new(list)),
                    definite: false,
                }],
            }))));
            stmts_being_inserted.push(module_stmt)
        }

        ecma::utils::prepend_stmts(body_stmts, stmts_being_inserted.into_iter());
    }
}
