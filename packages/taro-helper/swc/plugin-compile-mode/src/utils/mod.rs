use swc_core::{
    ecma::{
        atoms::Atom,
        ast::*
    },
    common::{
        iter::IdentifyLast,
        DUMMY_SP as span
    },
};
use std::collections::HashMap;

use self::constants::{COMPILE_IF, COMPILE_ELSE};

pub mod constants;

pub fn named_iter (str: String) -> impl FnMut() -> String {
    let mut count = -1;
    return move || {
        count += 1;
        format!("{str}{count}")
    };
}

fn jsx_text_to_string (atom: &Atom) -> String {
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

pub fn is_empty_jsx_text_line (atom: &Atom) -> bool {
    let str = jsx_text_to_string(atom);
    str.is_empty()
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
    } else if jsx_key == COMPILE_IF {
        let if_adapter = adapter.get("if").expect("[compile mode] 模板 if 语法未配置");
        return if_adapter.clone()
    } else if jsx_key == COMPILE_ELSE {
        let else_adapter = adapter.get("else").expect("[compile mode] 模板 else 语法未配置");
        return else_adapter.clone()
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

pub fn create_self_closing_jsx_element_expr (name: JSXElementName) ->  Expr {
    Expr::JSXElement(Box::new(JSXElement {
        span,
        opening: JSXOpeningElement {
            name,
            span,
            attrs: vec![],
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

#[test]
fn test_jsx_text () {
    assert_eq!("   span  ", jsx_text_to_string(&"   span  ".into()));
    assert_eq!("   s xxx   ", jsx_text_to_string(&"   s\n     \n  \n   xxx   ".into()));
    assert_eq!("a   b", jsx_text_to_string(&"   \n    \n   a   b  \n   ".into()));
    assert_eq!("", jsx_text_to_string(&"\n\n\n\n\n\n                   \n\n                ".into()));
    assert_eq!("", jsx_text_to_string(&"".into()));
}