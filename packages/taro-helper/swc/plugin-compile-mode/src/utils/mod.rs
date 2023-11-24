use swc_core::{
    ecma::{
        atoms::Atom,
        ast::*
    },
    common::{
        iter::IdentifyLast,
        util::take::Take,
        DUMMY_SP as span
    },
};
use std::collections::HashMap;

use self::constants::*;

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

pub fn identify_jsx_event_key (val: &str) -> Option<String> {
    if
        val.starts_with("on") &&
        val.chars().nth(2).is_some_and(|x| x.is_uppercase())
    {
        let event_name = val.get(2..).unwrap().to_lowercase();
        let event_name = if event_name == "click" {
            "tap"
        } else {
            &event_name
        };
        Some(format!("bind{}", event_name))
    } else {
        return None;
    }
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

/**
 * identify: `xx.map(function () {})` or `xx.map(() => {})`
 */
pub fn is_call_expr_of_loop (callee_expr: &mut Box<Expr>, args: &mut Vec<ExprOrSpread>) -> bool {
    if let Expr::Member(MemberExpr { prop: MemberProp::Ident(Ident { sym, ..}), .. }) = &mut **callee_expr {
        if &**sym == "map" {
            if let Some(ExprOrSpread { expr, .. }) = args.get_mut(0) {
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
                    el.opening.attrs.push(create_jsx_lit_attr(COMPILE_FOR_KEY, Lit::Str(Str { span, value: "sid".into(), raw: None})));
                    return Some(el)
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

pub fn gen_template_v (node_path: &str) -> String {
    format!("{{{{{}.v}}}}", node_path)
}

#[test]
fn test_jsx_text () {
    assert_eq!("   span  ", jsx_text_to_string(&"   span  ".into()));
    assert_eq!("   s xxx   ", jsx_text_to_string(&"   s\n     \n  \n   xxx   ".into()));
    assert_eq!("a   b", jsx_text_to_string(&"   \n    \n   a   b  \n   ".into()));
    assert_eq!("", jsx_text_to_string(&"\n\n\n\n\n\n                   \n\n                ".into()));
    assert_eq!("", jsx_text_to_string(&"".into()));
}
