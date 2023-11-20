
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
use std::{collections::HashMap, cell::RefCell};
use std::rc::Rc;
use crate::PluginConfig;
use crate::utils::{self, constants::*, harmony::components::*};

pub struct PreVisitor {
  is_in_jsx_expr_container: Rc<bool>,
  is_in_and_expr: bool,
}
impl PreVisitor {
    fn new () -> Self {
        Self {
            is_in_jsx_expr_container: Rc::new(true),
            is_in_and_expr: false,
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

        // is_in_and_expr 为 false 时，表示为当前 expr 的第一个 && 表达式，即当出现 aa && bb && <View /> 这种表达式时，只会处理最右侧的 && 表达式    
        match expr {
            // 将 aa && <B /> 转换为 aa ? <B /> : <B compileIgnore />
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
    pub node_stack: HashMap<String, Vec<i32>>,
    pub node_name: Vec<String>,
    pub templates: HashMap<String, String>,
    pub get_tmpl_name: Box<dyn FnMut() -> String>,
    pub node_name_vec: Vec<String>,
    pub get_node_name: Box<dyn FnMut() -> String>
}

impl TransformVisitor {
    pub fn new (config: PluginConfig) -> Self {
        let get_tmpl_name = Box::new(utils::named_iter(
            format!("{}t", config.tmpl_prefix)
        ));
        let get_node_name = Box::new(utils::named_iter(
        String::from("node"))
        );
        Self {
            config,
            is_compile_mode: false,
            node_name: vec![],
            node_stack: HashMap::new(),
            templates: HashMap::new(),
            get_tmpl_name,
            node_name_vec: vec![],
            get_node_name
        }
    }

    fn build_ets_element (&mut self, el: &mut JSXElement) -> String {
        let opening_element = &mut el.opening;

        let child_string = match &opening_element.name {
            JSXElementName::Ident(ident) => {
                let name = utils::to_kebab_case(&ident.sym);

                // TODO 先全部都添加
                // jsx 节点添加动态 id，需要判断是否存在静态节点
                let dynmaic_node_name: String;

                // 如果是半编译状态下碰到的第一个 jsx，或者 jsx 含有动态属性，则创建新的 node_name
                if !self.check_jsx_is_static(opening_element) || self.node_stack.is_empty() {
                    dynmaic_node_name = utils::create_jsx_dynamic_id(el, self);
                    self.node_name.push(dynmaic_node_name.clone());
                } else {
                    dynmaic_node_name = String::from("static_node");
                }

                match self.config.components.get(&name) {
                    // 内置组件
                    Some(attrs_map) => {
                    //   let attrs: Option<String> = self.build_xml_attrs(opening_element, attrs_map);
                    //   if attrs.is_none() { return String::new() };
                    //   format!("<{}{}>{}</{}>", name, attrs.unwrap(), children, name)
                    let children = self.build_ets_children(el);
                    match name.as_str() {
                        VIEW_TAG => utils::add_spaces_to_lines(&get_view_component_str(&dynmaic_node_name, &children)),
                        TEXT_TAG => utils::add_spaces_to_lines(&get_text_component_str(&dynmaic_node_name)),
                        IMAGE_TAG => utils::add_spaces_to_lines(&get_image_component_str(&dynmaic_node_name)),
                        _ => String::new()
                    }
                    },
                    None => {
                        // React 组件
                        // 原生自定义组件
                    //   let node_path = self.get_current_node_path();
                    //   format!(r#"<template is="{{{{xs.a(c, {}.nn, l)}}}}" data="{{{{i:{},c:c+1,l:xs.f(l,{}.nn)}}}}" />"#, node_path, node_path, node_path)
                        String::new()
                    }
                }
            }
            _ => String::new()
        };

        child_string
    }

    fn build_ets_children (&mut self, el: &mut JSXElement) -> String {
        let mut children_string = String::new();
        let mut retain_child_counter = 0;

        // 迭代 el.children
        el.children.iter_mut().for_each(|child| {
            self.node_stack.entry(self.node_name.last().unwrap().clone()).or_insert(vec![]).push(retain_child_counter);

            match child {
                JSXElementChild::JSXElement(child_el) => {
                    let child_string = self.build_ets_element(&mut **child_el);
                    children_string.push_str(&child_string);
                    retain_child_counter += 1;
                }
                _ => (),
            }
            
            self.node_stack.entry(self.node_name.last().unwrap().clone()).or_insert(vec![]).pop();
        });

        children_string
    }

    fn check_jsx_is_static (&self, opening_element: &mut JSXOpeningElement) -> bool {
        for attr in opening_element.attrs.iter_mut() {
            if let JSXAttrOrSpread::JSXAttr(jsx_attr) = attr {
                if let JSXAttrName::Ident(..) = &jsx_attr.name {
                    if let JSXAttrName::Ident(Ident { sym: name, .. }) = &jsx_attr.name {
                        let jsx_attr_name = name.to_string();
                        let event_name = utils::identify_jsx_event_key(&jsx_attr_name);
                        let is_event = event_name.is_some();
                        if let Some(value) = &jsx_attr.value {
                            match value {
                                JSXAttrValue::Lit(..) => (),
                                JSXAttrValue::JSXExprContainer(JSXExprContainer{ expr, .. }) => {
                                    // jsx_attr 是事件，而且事件的 value 不是一个变量，那么当作静态属性，否则 JSXExprContainer 情况下都当作非静态属性
                                    if is_event {
                                        if let JSXExpr::Expr(expr) = &expr {
                                            if let Expr::Ident(..) = &**expr {
                                                return false
                                            }
                                        }
                                    } else {
                                        return false
                                    }
                                    
                                },
                                _ => return false
                            }
                        }
                    }
                }
            }
        }
        return true;
    }

    // fn get_current_node_path (&self) -> String {
    //     // return: i.cn[0].cn[0]....
    //     self.node_stack
    //         .iter()
    //         .fold(String::from("i"), |mut acc, item| {
    //             if item == &LOOP_WRAPPER_ID {
    //                 return String::from("item")
    //             }
    //             acc.push_str(&format!(".cn[{}]", item));
    //             return acc;
    //         })
    // }
//   fn build_xml_attrs (&self, opening_element: &mut JSXOpeningElement, attrs_map: &HashMap<String, String>) -> Option<String> {
//       let mut props = HashMap::new();
//       let mut attrs_string = String::new();

//       // 在 transform 中使用的是 retain_mut 方法，在 retain_mut 中，如果 return false，就代表该属性不需要保留，在小程序中主要用于剪枝静态属性，鸿蒙这里不需要处理
//       for attr in opening_element.attrs.iter_mut() {
//         if let JSXAttrOrSpread::JSXAttr(jsx_attr) = attr {
//             if let JSXAttrName::Ident(Ident { sym: name, .. }) = &jsx_attr.name {
//                 let jsx_attr_name = name.to_string();

//                 let miniapp_attr_name = utils::convert_jsx_attr_key(&jsx_attr_name, &self.config.adapter);
//                 let event_name = utils::identify_jsx_event_key(&jsx_attr_name);
//                 let is_event = event_name.is_some();
//                 match &jsx_attr.value {
//                     Some(jsx_attr_value) => {
//                         match jsx_attr_value {
//                             JSXAttrValue::Lit(Lit::Str(Str { value, ..  })) => {
//                                 // 静态属性在 xml 中保留即可，jsx 中可以删除
//                                 if jsx_attr_name != COMPILE_MODE {
//                                     props.insert(miniapp_attr_name, value.to_string());
//                                 }
//                             },
//                             JSXAttrValue::JSXExprContainer(..) => {
//                                 let mut node_path = self.get_current_node_path();
//                                 if is_event {
//                                     props.insert(event_name.unwrap(), String::from(EVENT_HANDLER));
//                                     if props.get(DATA_SID).is_none() {
//                                         props.insert(String::from(DATA_SID), format!("{{{{{}.sid}}}}", node_path));
//                                     }
//                                 }

//                                 // 小程序组件标准属性 -> 取 @tarojs/shared 传递过来的属性值；非标准属性 -> 取属性名
//                                 let value: &str = attrs_map.get(&miniapp_attr_name).unwrap_or(&jsx_attr_name);
//                                 // 按当前节点在节点树中的位置换算路径
//                                 node_path.push('.');
//                                 let value = if value.contains(TMPL_DATA_ROOT) {
//                                     value.replace(TMPL_DATA_ROOT, &node_path)
//                                 } else {
//                                     format!("{}{}", node_path, value)
//                                 };
//                                 // 得出最终的模板属性值
//                                 let miniapp_attr_value = format!("{{{{{}}}}}", value);

//                                 props.insert(miniapp_attr_name, miniapp_attr_value);
//                             },
//                             _ => ()
//                         }
//                     },
//                     None => {
//                         if
//                             jsx_attr_name == COMPILE_ELSE ||
//                             jsx_attr_name == COMPILE_IGNORE
//                         {
//                             props.insert(miniapp_attr_name, String::from(jsx_attr_name));
//                         } else if jsx_attr_name == COMPILE_FOR {
//                             let current_path = self.get_current_loop_path();
//                             let miniapp_attr_value = format!("{{{{{}}}}}", current_path);
//                             props.insert(miniapp_attr_name, miniapp_attr_value);
//                         } else {
//                             props.insert(miniapp_attr_name, String::from("true"));
//                         }
//                     }
//                 }
//             }
//         }
//       }

//       // 组件包含事件，但没有设置自定义 id 的话，把 id 设为 sid
//       if props.get(DATA_SID).is_some() && props.get(ID).is_none() {
//           props.insert(String::from(ID), props.get(DATA_SID).unwrap().clone());
//       }

//       // 生成的 template 需要幂等
//       let mut keys: Vec<&String> = props.keys().collect();
//       keys.sort();
//       for key in keys {
//           let value = props.get(key).unwrap();
//           if value == COMPILE_IGNORE {
//               return None
//           } else if value == COMPILE_ELSE {
//               attrs_string.push_str(&format!(" {}", key));
//           } else {
//               attrs_string.push_str(&format!(r#" {}="{}""#, key, value));
//           }
//       }

//       Some(attrs_string)
//   }



//   fn get_current_loop_path (&self) -> String {
//       // return: i.cn[0]...cn
//       self.node_stack
//           .iter()
//           .identify_last()
//           .fold(String::from("i"), |mut acc, (is_last, item)| {
//               let str = if is_last {
//                   String::from(".cn")
//               } else {
//                   if item == &LOOP_WRAPPER_ID {
//                       return String::from("item")
//                   }
//                   format!(".cn[{}]", item)
//               };
//               acc.push_str(&str);
//               return acc;
//           })
//   }
}

impl VisitMut for TransformVisitor {
  // Implement necessary visit_mut_* methods for actual custom transform.
  // A comprehensive list of possible visitor methods can be found here:
  // https://rustdoc.swc.rs/swc_ecma_visit/trait.VisitMut.html
  // 半编译模式入口，遍历 jsx 语法树，寻找拥有 COMPILE_MODE 属性节点，预处理节点所在的子树，并根据子树信息生成 tmpl_contents
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

          let tmpl_build_contents = format!("build() {{\n{content}}}", content = self.build_ets_element(el));
          let tmpl_node_declare_contents = self.node_name_vec.iter().fold(String::new(), |mut acc, item| {
              acc.push_str(&format!("@State {}: TaroElement = new TaroIgnoreElement()\n", item));
              return acc;
          });
          let tmpl_main_contents = utils::add_spaces_to_lines(&format!("{}\n{}", tmpl_node_declare_contents, tmpl_build_contents));
          let tmpl_contents = format!("`{}`",
            HARMONY_IMPORTER.to_owned() +
            // TODO: 此处应该收集需要 Extend 的组件，而不是直接写死
            HARMONY_FLEX_STYLE_BIND +
            format!(
r#"@Component
struct TARO_TEMPLATES_{name} {{
  nodeInfoMap: any = {{}}
  dynamicCenter: DynamicCenter
  @ObjectLink node: TaroElement

  aboutToAppear () {{
    this.dynamicCenter = new DynamicCenter()
    this.dynamicCenter.bindComponentToNodeWithDFS(this.node, this)
  }}

{content}}}
export default TARO_TEMPLATES_{name}
"#,
                name = &tmpl_name,
                content = tmpl_main_contents
            ).as_str());

          self.templates.insert(tmpl_name, tmpl_contents);
          self.is_compile_mode = false;
      } else {
          el.visit_mut_children_with(self)
      }
  }

  // 将生成的模板字符串以变量的形式插入在文件最上面，等待后续编译抽离
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
                          raw: Some(Atom::new(value.as_str()))
                      })))),
                      definite: false,
                  }],
              }))))
          });
      ecma::utils::prepend_stmts(body_stmts, stmts_being_inserted);
  }
}
