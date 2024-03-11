
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
use std::rc::Rc;
use std::collections::HashSet;
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
                                alt: Box::new(Expr::Lit(Lit::Str(Str { span, value: String::new().into(), raw: None })))
                            })
                        },
                        _ => {
                            // TODO Unknown fallback to template
                            println!("unknown expr: {right:?}");
                        }
                    }
                }
            },
            Expr::Cond(CondExpr { test, cons, ..}) => {
                let compile_if = utils::create_jsx_expr_attr(COMPILE_IF, test.clone());
                let process_cond_arm = |arm: &mut Box<Expr>, attr: JSXAttrOrSpread| {
                    match &mut **arm {
                        Expr::JSXElement(el) => {
                            el.opening.attrs.push(attr);
                        },
                        _ => ()
                    }
                };
                process_cond_arm(cons, compile_if);
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
    pub component_set: HashSet<String>,
    pub templates: HashMap<String, String>,
    pub get_tmpl_name: Box<dyn FnMut() -> String>,
    pub node_name_vec: Vec<String>,
    pub get_node_name: Box<dyn FnMut() -> String>
}

impl TransformVisitor {
    pub fn new (config: PluginConfig) -> Self {
        let get_node_name = Box::new(utils::named_iter(String::from("node")));
        let get_tmpl_name = Box::new(utils::named_iter(format!("{}t", config.tmpl_prefix)));

        Self {
            config,
            is_compile_mode: false,
            node_name: vec![],
            node_stack: HashMap::new(),
            templates: HashMap::new(),
            get_tmpl_name,
            component_set: HashSet::new(),
            node_name_vec: vec![],
            get_node_name
        }
    }

    fn build_ets_element (&mut self, el: &mut JSXElement) -> String {
        // jsx 节点添加动态 id，需要判断是否存在静态节点
        let dynmaic_node_name: String;
        let mut is_node_name_created = false;

        // 如果是半编译状态下碰到的第一个 jsx，或者 jsx 含有动态属性，则创建新的 node_name
        if !self.check_jsx_is_static(el) || self.node_stack.is_empty() {
            dynmaic_node_name = utils::create_jsx_dynamic_id(el, self);
            self.node_name.push(dynmaic_node_name.clone());
            is_node_name_created = true;
        } else {
            dynmaic_node_name = self.get_current_node_path();
        }

        let opening_element = &mut el.opening;

        let child_string = match &opening_element.name {
            JSXElementName::Ident(ident) => {
                let name = utils::to_kebab_case(&ident.sym);

                match self.config.support_components.iter().find(|&component| component == &name) {
                    // 内置组件
                    Some(_) => {
                        // 事件的处理，根据事件添加对应的 ets 事件处理函数
                        let event_string: String = self.build_ets_event(opening_element);

                        // 判断 el 的子元素是否只有一个循环，如果是的话，直接使用 createNode 来生成后续子节点
                        let is_loop_exist = utils::check_jsx_element_children_exist_loop(el);
                        let mut children = utils::create_original_node_renderer(self);

                        if !is_loop_exist {
                            children = self.build_ets_children(el);
                        }

                        // 当前 node_name 节点树已全部递归完毕
                        if is_node_name_created {
                            self.node_name.pop();
                        }

                        let mut code = match name.as_str() {
                            VIEW_TAG => {
                                self.component_set.insert(name.clone());
                                get_view_component_str(&dynmaic_node_name, &children)
                            },
                            TEXT_TAG => {
                                self.component_set.insert(name.clone());
                                get_text_component_str(&dynmaic_node_name)
                            },
                            IMAGE_TAG => {
                                self.component_set.insert(name.clone());
                                get_image_component_str(&dynmaic_node_name)
                            },
                            _ => String::new()
                        };

                        code.push_str(event_string.as_str());
                        utils::add_spaces_to_lines(code.as_str())
                    },
                    None => {
                        // React 组件
                        // 原生自定义组件
                        // 半编译暂未支持的组件
                        utils::create_original_node_renderer(self)
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
                    retain_child_counter = retain_child_counter + 1;
                },
                JSXElementChild::JSXExprContainer(JSXExprContainer {
                    expr: JSXExpr::Expr(jsx_expr),
                    ..
                }) => {
                    // 如果套着 ()，则获取括号里面的内容
                    if let Expr::Paren(ParenExpr { expr, .. }) = &mut **jsx_expr {
                        *jsx_expr = expr.take();
                    }
                    match &mut **jsx_expr {
                        Expr::Cond(cond_expr) => {
                            children_string.push_str(self.build_ets_cond_expr(cond_expr).as_str());
                        },
                        _ => {
                            // TODO: 全部当普通文本处理，后续根据前缀是否为 render 来判断是 jsx 还是普通文本，后续会支持 render 开头的函数调用返回 JSX
                            // Expr::Call(_)
                            let node_path = self.get_current_node_path();
                            let code = utils::add_spaces_to_lines(get_text_component_str(&node_path).as_str());
                            self.component_set.insert(TEXT_TAG.to_string());
                            children_string.push_str(&code);
                        }
                    };
                    retain_child_counter = retain_child_counter + 1;
                },
                JSXElementChild::JSXText(jsx_text) => {
                    let content = utils::jsx_text_to_string(&jsx_text.value);
                    if !content.is_empty() {
                        let current_path = self.get_current_node_path();
                        let code = utils::add_spaces_to_lines(get_text_component_str(&current_path).as_str());

                        children_string.push_str(code.as_str());
                        self.component_set.insert(TEXT_TAG.to_string());
                        retain_child_counter = retain_child_counter + 1;
                    }
                },
                _ => (),
            }

            self.node_stack.entry(self.node_name.last().unwrap().clone()).or_insert(vec![]).pop();
        });

        children_string
    }

    fn build_ets_cond_expr (&mut self, cond_expr: &mut CondExpr) -> String {
        let mut children_string = String::new();
        let mut process_condition_expr = |arm: &mut Box<Expr>| {
            match &mut **arm {
                Expr::JSXElement(el) => {
                    // 判断 el 的属性中是否存在 COMPILE_IGNORE，如果存在则返回空字符串
                    if utils::check_jsx_element_has_compile_ignore(el) {
                        String::new()
                    } else {
                        self.build_ets_element(el)
                    }
                },
                Expr::Lit(_) => {
                    // {condition1 && 'Hello'} 在预处理时会变成 {condition1 ? 'Hello' : "compileIgnore"}
                    // 而普通文本三元则会被 block 标签包裹，因此处理后只有上述情况会存在 lit 类型的表达式
                    // 由于这种情况没有办法使用 wx:if 来处理，需要特殊处理成 {{i.cn[3].v==="compileIgnore"?"":i.cn[3].v}} 的形式
                    let current_path = self.get_current_node_path();

                    self.component_set.insert(TEXT_TAG.to_string());
                    utils::add_spaces_to_lines(get_text_component_str(&current_path).as_str())
                },
                Expr::Cond(cond_expr) => self.build_ets_cond_expr(cond_expr),
                _ => String::new()
            }
        };
        let alt_children_string = process_condition_expr(&mut cond_expr.alt);
        let cons_children_string = process_condition_expr(&mut cond_expr.cons as &mut Box<Expr>);

        children_string.push_str(format!("if (this.{}._attrs.compileIf) {{\n{}}}", self.get_current_node_path(), cons_children_string).as_str());
        if !alt_children_string.is_empty() {
            children_string.push_str(format!(" else {{\n{}}}", alt_children_string).as_str());
        }

        utils::add_spaces_to_lines(&children_string)
    }

    fn check_jsx_is_static (&self, el: &mut JSXElement) -> bool {
        let opening_element = &mut el.opening;

        for attr in opening_element.attrs.iter_mut() {
            if let JSXAttrOrSpread::JSXAttr(jsx_attr) = attr {
                if let JSXAttrName::Ident(..) = &jsx_attr.name {
                    if let JSXAttrName::Ident(Ident { sym: name, .. }) = &jsx_attr.name {
                        let jsx_attr_name = name.to_string();
                        let event_name = utils::identify_jsx_event_key(&jsx_attr_name, &self.config.platform);
                        let is_event = event_name.is_some();
                        let is_condition = jsx_attr_name == COMPILE_IF;

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
                                    } else if !is_condition {
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
        // 判断当前 el 的 children 是否是表达式，表达式的话父节点需要标注为非静态
        for child in el.children.iter_mut() {
            if let JSXElementChild::JSXExprContainer(JSXExprContainer { .. }) = child {
                return false
            }
        }

        return true;
    }

    fn build_ets_event (&self, opening_element: &mut JSXOpeningElement) -> String {
        let mut event_string = String::new();

        // 在 transform 中使用的是 retain_mut 方法，在 retain_mut 中，如果 return false，就代表该属性不需要保留，在小程序中主要用于剪枝静态属性，鸿蒙这里不需要处理
        for attr in opening_element.attrs.iter_mut() {
            if let JSXAttrOrSpread::JSXAttr(jsx_attr) = attr {
                if let JSXAttrName::Ident(Ident { sym: name, .. }) = &jsx_attr.name {
                    let mut jsx_attr_name = name.to_string();
                    let common_event = &self.config.support_events;
                    let is_event = utils::check_is_event_attr(&jsx_attr_name);

                    // 如果不是事件或者不是 common_event 里的事件，则执行下一次迭代
                    if !is_event || !common_event.iter().any(|event| event == &jsx_attr_name) {
                        continue;
                    }

                    let harmony_event_name = self.config.event_adapter.get(jsx_attr_name.as_str());

                    if harmony_event_name.is_some() {
                        jsx_attr_name = harmony_event_name.unwrap().to_string();
                    }

                    event_string.push_str(&create_component_event(jsx_attr_name.as_str(), &self.get_current_node_path()))
                }
            }
        }

        event_string
    }

    fn get_current_node_path (&self) -> String {
        let current_node_name = self.node_name.last().unwrap().clone();
        let current_node_stack = match self.node_stack.get(&current_node_name) {
            Some(stack) => stack,
            None => return current_node_name
        };

        // return: node0.childNodes[0].childNodes[0]....
        current_node_stack.iter().fold(current_node_name, |mut acc, item| {
            acc.push_str(&format!(".childNodes[{}]", item));
            return acc;
        })
    }
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
          let tmpl_contents =
            HARMONY_IMPORTER.to_owned() +
            utils::get_harmony_component_style(self).as_str() +
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
                name = tmpl_name,
                content = tmpl_main_contents
            ).as_str();

          self.templates.insert(tmpl_name, format!("`{}`", tmpl_contents));

          // 数据清理
          self.node_stack.clear();
          self.node_name.clear();
          self.node_name_vec.clear();
          self.component_set.clear();
          self.is_compile_mode = false;
          self.get_node_name = Box::new(utils::named_iter(String::from("node")));
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
