use swc_core::{
    ecma::{
        atoms::Atom,
        ast::*,
        utils::{quote_ident, quote_str},
        visit::{Visit, VisitWith},
    },
    common::{
        iter::IdentifyLast,
        util::take::Take,
        DUMMY_SP as span
    },
};
use std::collections::HashMap;

use self::constants::*;
use crate::PluginConfig;
use crate::transform_harmony::TransformVisitor;

pub mod harmony;
pub mod constants;

pub fn named_iter (str: String) -> impl FnMut() -> String {
    let mut count = -1;
    return move || {
        count += 1;
        format!("{str}{count}")
    };
}

pub fn jsx_text_to_string (atom: &Atom) -> String {
    let content = atom.replace("\t", " ");

    let res = content
        .lines()
        .enumerate()
        .identify_last()
        .fold(String::new(), |mut acc, (is_last, (index, line))| {
            // 首行不 trim 头
            let line = if index == 0 {
                line
            } else {
                line.trim_start()
            };

            // 尾行不 trim 尾
            let line = if is_last {
                line
            } else {
                line.trim_end()
            };

            if !acc.is_empty() && !line.is_empty() {
                acc.push(' ');
            }

            acc.push_str(line);
            acc
        });
    res
}

// 将驼峰写法转换为 kebab-case，即 aBcD -> a-bc-d
pub fn to_kebab_case (val: &str) -> String {
    let mut res = String::new();
    val
        .chars()
        .enumerate()
        .for_each(|(idx, c)| {
            if idx != 0 && c.is_uppercase() {
                res.push('-');
            }
            res.push(c.to_ascii_lowercase());
        });
    res
}

pub fn convert_jsx_attr_key (jsx_key: &str, adapter: &HashMap<String, String>) -> String {
    if jsx_key == "className" {
        return String::from("class");
    } else if
        jsx_key == COMPILE_IF ||
        jsx_key == COMPILE_ELSE ||
        jsx_key == COMPILE_FOR ||
        jsx_key == COMPILE_FOR_KEY
    {
        let expr = match jsx_key {
            COMPILE_IF => "if",
            COMPILE_ELSE => "else",
            COMPILE_FOR => "for",
            COMPILE_FOR_KEY => "key",
            _ => ""
        };
        let adapter = adapter.get(expr).expect(&format!("[compile mode] 模板 {} 语法未配置", expr));
        return adapter.clone()
    }
    to_kebab_case(jsx_key)
}

pub fn check_is_event_attr (val: &str) -> bool {
    val.starts_with("on") && val.chars().nth(2).is_some_and(|x| x.is_uppercase())
}

pub fn identify_jsx_event_key (val: &str, platform: &str) -> Option<String> {
    if check_is_event_attr(val) {
        let event_name = val.get(2..).unwrap().to_lowercase();
        let event_name = if event_name == "click" {
            "tap"
        } else {
            &event_name
        };
        let event_binding_name = match platform {
            "ALIPAY" => {
                if event_name == "tap" {
                    String::from("onTap")
                } else {
                    String::from(val)
                }
            },
            _ => {
                format!("bind{}", event_name)
            }
        };
        Some(event_binding_name)
    } else {
        return None;
    }
}

pub fn is_inner_component (el: &JSXElement, config: &PluginConfig) -> bool {
    let opening = &el.opening;
    if let JSXElementName::Ident(Ident { sym, .. }) = &opening.name {
        let name = to_kebab_case(&sym);
        return config.components.get(&name).is_some();
    }

    false
}

pub fn is_static_jsx (el: &Box<JSXElement>) -> bool {
    if el.opening.attrs.len() > 0 {
        return false
    }

    for child in &el.children {
        if let JSXElementChild::JSXText(_) = child {
        } else {
            return false
        }
    }

    true
}

pub fn create_self_closing_jsx_element_expr (name: JSXElementName, attrs: Option<Vec<JSXAttrOrSpread>>) ->  Expr {
    Expr::JSXElement(Box::new(JSXElement {
        span,
        opening: JSXOpeningElement {
            name,
            span,
            attrs: attrs.unwrap_or(vec![]),
            self_closing: true,
            type_args: None
        },
        children: vec![],
        closing: None
    }))
}

pub fn create_jsx_expr_attr (name: &str, expr: Box<Expr>) -> JSXAttrOrSpread {
    JSXAttrOrSpread::JSXAttr(JSXAttr {
        span,
        name: JSXAttrName::Ident(Ident::new(name.into(), span)),
        value: Some(JSXAttrValue::JSXExprContainer(JSXExprContainer {
            span,
            expr: JSXExpr::Expr(expr)
        }))
    })
}

pub fn create_jsx_bool_attr (name: &str) -> JSXAttrOrSpread {
    JSXAttrOrSpread::JSXAttr(JSXAttr {
        span,
        name: JSXAttrName::Ident(Ident::new(name.into(), span)),
        value: None
    })
}

pub fn create_jsx_lit_attr (name: &str, lit: Lit) -> JSXAttrOrSpread {
    JSXAttrOrSpread::JSXAttr(JSXAttr {
        span,
        name: JSXAttrName::Ident(Ident::new(name.into(), span)),
        value: Some(JSXAttrValue::Lit(lit))
    })
}

pub fn create_jsx_dynamic_id (el: &mut JSXElement, visitor: &mut TransformVisitor) -> String {
    let node_name = (visitor.get_node_name)();

    visitor.node_name_vec.push(node_name.clone());
    el.opening.attrs.push(create_jsx_lit_attr(DYNAMIC_ID, node_name.clone().into()));
    node_name
}

pub fn add_spaces_to_lines(input: &str) -> String {
    let count = 2;
    let mut result = String::new();

    for line in input.lines() {
        let spaces = " ".repeat(count);
        result.push_str(&format!("{}{}\n", spaces, line));
    }

    result
}

pub fn get_harmony_component_style (visitor: &mut TransformVisitor) -> String {
    let component_set = &visitor.component_set;
    let mut harmony_component_style = String::new();

    let mut build_component = |component_tag: &str, component_style: &str| {
        if component_set.contains(component_tag) {
            harmony_component_style.push_str(component_style);
        }
    };

    build_component(VIEW_TAG, HARMONY_FLEX_STYLE_BIND);
    build_component(IMAGE_TAG, HARMONY_IMAGE_STYLE_BIND);
    build_component(TEXT_TAG, HARMONY_TEXT_STYLE_BIND);

    harmony_component_style
}

pub fn check_jsx_element_has_compile_ignore (el: &JSXElement) -> bool {
    for attr in &el.opening.attrs {
        if let JSXAttrOrSpread::JSXAttr(JSXAttr { name, .. }) = attr {
            if let JSXAttrName::Ident(Ident { sym, .. }) = name {
                if sym == COMPILE_IGNORE {
                    return true
                }
            }
        }
    }
    false
}

/**
 * identify: `xx.map(function () {})` or `xx.map(() => {})`
 */
pub fn is_call_expr_of_loop (callee_expr: &Box<Expr>, args: &Vec<ExprOrSpread>) -> bool {
    if let Expr::Member(MemberExpr { prop: MemberProp::Ident(Ident { sym, ..}), .. }) = &**callee_expr {
        if sym == "map" {
            if let Some(ExprOrSpread { expr, .. }) = args.get(0) {
                return expr.is_arrow() || expr.is_fn_expr()
            }
        }
    }
    return false
}

pub fn is_render_fn (callee_expr: &mut Box<Expr>) -> bool {
    fn is_starts_with_render (name: &str) -> bool {
        name.starts_with("render")
    }
    match &**callee_expr {
        Expr::Member(MemberExpr { prop: MemberProp::Ident(Ident { sym: name, .. }), .. }) => {
            is_starts_with_render(name)
        },
        Expr::Ident(Ident { sym: name, .. }) => {
            is_starts_with_render(name)
        },
        _ => false
    }
}

pub fn extract_jsx_loop <'a> (callee_expr: &mut Box<Expr>, args: &'a mut Vec<ExprOrSpread>) -> Option<&'a mut Box<JSXElement>> {
    if is_call_expr_of_loop(callee_expr, args) {
        if let Some(ExprOrSpread { expr, .. }) = args.get_mut(0) {
            fn update_return_el (return_value: &mut Box<Expr>) -> Option<&mut Box<JSXElement>> {
                if let Expr::Paren(ParenExpr { expr, .. }) = &mut **return_value {
                    *return_value = expr.take()
                }
                if return_value.is_jsx_element() {
                    let el = return_value.as_mut_jsx_element().unwrap();
                    el.opening.attrs.push(create_jsx_bool_attr(COMPILE_FOR));
                    el.opening.attrs.push(create_jsx_lit_attr(COMPILE_FOR_KEY, Lit::Str(quote_str!("sid"))));
                    return Some(el)
                } else if return_value.is_jsx_fragment() {
                    let el = return_value.as_mut_jsx_fragment().unwrap();
                    let children = el.children.take();
                    let block_el = Box::new(JSXElement {
                        span,
                        opening: JSXOpeningElement {
                            name: JSXElementName::Ident(quote_ident!("block")),
                            span,
                            attrs: vec![
                                create_jsx_bool_attr(COMPILE_FOR),
                                create_jsx_lit_attr(COMPILE_FOR_KEY, Lit::Str(quote_str!("sid")))
                            ],
                            self_closing: false,
                            type_args: None
                        },
                        children,
                        closing: Some(JSXClosingElement { span, name: JSXElementName::Ident(quote_ident!("block")) })
                    });
                    **return_value = Expr::JSXElement(block_el);
                    return Some(return_value.as_mut_jsx_element().unwrap())
                }
                None
            }
            match &mut **expr {
                Expr::Fn(FnExpr { function, .. }) => {
                    if let Function { body: Some(BlockStmt { stmts, .. }), .. } = &mut **function {
                        if let Some(Stmt::Return(ReturnStmt { arg: Some(return_value), .. })) = stmts.last_mut() {
                            return update_return_el(return_value);
                        }
                    }
                },
                Expr::Arrow(ArrowExpr { body, .. }) => {
                    match &mut **body {
                        BlockStmtOrExpr::BlockStmt(BlockStmt { stmts, .. }) => {
                            if let Some(Stmt::Return(ReturnStmt { arg: Some(return_value), .. })) = stmts.last_mut() {
                                return update_return_el(return_value);
                            }
                        },
                        BlockStmtOrExpr::Expr(return_value) => {
                            return update_return_el(return_value);
                        }
                    }
                },
                _ => ()
            }
        }
    }
    None
}

pub fn check_jsx_element_children_exist_loop (el: &mut JSXElement) -> bool {
    for child in el.children.iter_mut() {
        if let JSXElementChild::JSXExprContainer(JSXExprContainer { expr: JSXExpr::Expr(expr), .. }) = child {
            if let Expr::Call(CallExpr { callee: Callee::Expr(callee_expr), args, .. }) = &mut **expr {
                if is_call_expr_of_loop(callee_expr, args) {
                    return true
                }
            }
        }
    }

    false
}

pub fn is_static_jsx_element_child (jsx_element: &JSXElementChild) -> bool {
    struct Visitor {
        has_jsx_expr: bool
    }
    impl Visitor {
        fn new () -> Self {
            Visitor { has_jsx_expr: false }
        }
    }
    impl Visit for Visitor {
        fn visit_jsx_expr_container(&mut self, _n: &JSXExprContainer) {
            self.has_jsx_expr = true;
        }
    }
    let mut visitor = Visitor::new();
    jsx_element.visit_with(&mut visitor);
    return !visitor.has_jsx_expr;
}

pub fn create_original_node_renderer (visitor: &mut TransformVisitor) -> String {
    add_spaces_to_lines(format!("ForEach(this.{}.childNodes, item => {{\n  createNode(item)\n}}, item => item._nid)", visitor.node_name.last().unwrap().clone()).as_str())
}

pub fn gen_template (val: &str) -> String {
    format!("{{{{{}}}}}", val)
}

pub fn gen_template_v (node_path: &str) -> String {
    format!("{{{{{}.v}}}}", node_path)
}

pub fn is_xscript (name: &str) -> bool {
    return name == SCRIPT_TAG
}

pub fn as_xscript_expr_string (member: &MemberExpr, xs_module_names: &Vec<String>) -> Option<String> {
    if !member.prop.is_ident() {
        return None;
    }
    let prop = member.prop.as_ident().unwrap().sym.to_string();

    match &*member.obj {
        Expr::Member(lhs) => {
            let res = as_xscript_expr_string(lhs, xs_module_names);
            if res.is_some() {
                let obj = res.unwrap();
                return Some(format!("{}.{}", obj, prop));
            }
        },
        Expr::Ident(ident) => {
            let obj = ident.sym.to_string();
            if xs_module_names.contains(&obj) {
                return Some(format!("{}.{}", obj, prop));
            }
        },
        _ => ()
    }

    return None
}

#[test]
fn test_jsx_text () {
    assert_eq!("   span  ", jsx_text_to_string(&"   span  ".into()));
    assert_eq!("   s xxx   ", jsx_text_to_string(&"   s\n     \n  \n   xxx   ".into()));
    assert_eq!("a   b", jsx_text_to_string(&"   \n    \n   a   b  \n   ".into()));
    assert_eq!("", jsx_text_to_string(&"\n\n\n\n\n\n                   \n\n                ".into()));
    assert_eq!("", jsx_text_to_string(&"".into()));
}
