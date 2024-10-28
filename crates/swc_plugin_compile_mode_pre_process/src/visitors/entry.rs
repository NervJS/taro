use std::collections::{HashMap, HashSet};

use crate::{
  utils::{react_component::ReactComponent, render_fn::RenderFn},
  PluginConfig,
};
use swc_core::ecma::{
  ast::*,
  visit::{VisitMut, VisitMutWith},
};

use super::collect_render_fn::CollectRenderFnVisitor;
use super::find_react_component::FindReactComponentVisitor;
use super::generate_deps::GenerateDepsVisitor;
use super::transform::component_entry::ComponentEntryVisitor;
pub struct EntryVisitor {
  visitor_context: VisitorContext,
  config: PluginConfig,
}

struct VisitorContext {
  react_component_list: Vec<ReactComponent>,
  react_component_raw_render_fn_map: HashMap<String, HashMap<String, RenderFn>>,
  react_component_formatted_render_fn_map: HashMap<String, HashMap<String, RenderFn>>,
}

impl EntryVisitor {
  pub fn new(config: PluginConfig) -> Self {
    EntryVisitor {
      visitor_context: VisitorContext {
        react_component_raw_render_fn_map: HashMap::new(),
        react_component_formatted_render_fn_map: HashMap::new(),
        react_component_list: vec![],
      },
      config,
    }
  }
}

impl VisitMut for EntryVisitor {
  fn visit_mut_module(&mut self, n: &mut Module) {
    //这个只是入口，这里面按顺序调用各种visitor，然后把处理的内容都挂在visitorContext上
    self.find_react_component(n);
    // 这里处理收集到的 react_component 数据结构 hashMap：{name: react_component}
    self.collect_each_component_render_fn();
    self.transform_render_fn();
    self.transform(n);
  }
}

impl EntryVisitor {
  fn find_react_component(&mut self, n: &mut Module) {
    // 先找到当前的文件中的 react 组件 因为有些人会在一个 jsx 文件中 写多个 react 组件，保留他的函数体 BlockStatement，他们各自是独立的，所以用数组保存就行
    let mut find_react_component_visitor =
      FindReactComponentVisitor::new(&mut self.visitor_context.react_component_list);
    n.visit_mut_children_with(&mut find_react_component_visitor);
    // 必须要合法的 react 组件才能继续往下走
    let mut valid_react_component_list = vec![];
    self
      .visitor_context
      .react_component_list
      .clone()
      .into_iter()
      .for_each(|mut react_component| {
        if react_component.is_valid() {
          valid_react_component_list.push(react_component);
        }
      });
    self.visitor_context.react_component_list = valid_react_component_list;
  }

  fn collect_each_component_render_fn(&mut self) {
    // 遍历每一个 react 组件，找到他们的 render 函数并收集起来
    self
      .visitor_context
      .react_component_list
      .clone()
      .into_iter()
      .for_each(|mut react_component| {
        let mut collect_render_fn_visitor = CollectRenderFnVisitor::new(&self.config);
        react_component
          .block_stmt
          .visit_mut_with(&mut collect_render_fn_visitor);
        self
          .visitor_context
          .react_component_raw_render_fn_map
          .insert(
            react_component.get_name(),
            collect_render_fn_visitor.raw_render_fn_map.clone(),
          );
      });
  }

  fn transform_render_fn(&mut self) {
    let mut formatted_render_fn_map: HashMap<String, HashMap<String, RenderFn>> = HashMap::new();
    self
      .visitor_context
      .react_component_raw_render_fn_map
      .clone()
      .into_iter()
      .for_each(|(name, raw_fn_map)| {
        // 1. 可能存在互相引用，得梳理一下他们之间的依赖关系 数据结构 hashMap：{name:[dep1, dep2,...]}
        let render_fn_deps_map = generate_render_fn_dep_map(&raw_fn_map);
        // 2. 根据依赖表，检查里面有没有循环引用，如果有循环引用，需要把循环引用的那些函数都去掉
        // todo 错误处理
        let deps_circular_list = get_deps_circular(&render_fn_deps_map);
        // 3. 根据 deps_circular_list 生成 formatted_fn_map 数据结构 hashMap：{name: formatted_fn}
        let mut formatted_fn_map: HashMap<String, RenderFn> = HashMap::new();
        raw_fn_map
          .clone()
          .into_iter()
          .for_each(|(fn_name, raw_fn)| {
            if !deps_circular_list
              .iter()
              .any(|circular| circular.contains(&fn_name))
            {
              formatted_fn_map.insert(fn_name, raw_fn);
            }
          });
        formatted_render_fn_map.insert(name, formatted_fn_map);
      });
    self.visitor_context.react_component_formatted_render_fn_map = formatted_render_fn_map;
  }

  fn transform(&mut self, n: &mut Module) {
    let mut transform_visitor = ComponentEntryVisitor::new(
      &self.visitor_context.react_component_formatted_render_fn_map,
      &self.config,
    );
    n.visit_mut_children_with(&mut transform_visitor);
  }
}

fn generate_render_fn_dep_map(
  raw_fn_map: &HashMap<String, RenderFn>,
) -> HashMap<String, Vec<String>> {
  let mut render_fn_deps_map = HashMap::new();
  for (name, render_fn) in raw_fn_map {
    let mut cloned_jsx_element = render_fn.jsx_element.clone();
    let mut generate_deps_visitor = GenerateDepsVisitor::new(raw_fn_map, name.clone());
    cloned_jsx_element.visit_mut_with(&mut generate_deps_visitor);
    let deps = generate_deps_visitor.deps_list.clone();
    if generate_deps_visitor.self_loop {
      // todo 错误处理
      println!("self loop found in render function: {}", name);
    } else {
      render_fn_deps_map.insert(name.clone(), deps);
    }
  }
  render_fn_deps_map
}

fn get_deps_circular(map: &HashMap<String, Vec<String>>) -> Vec<Vec<String>> {
  let mut result: Vec<Vec<String>> = vec![];
  let mut visited: HashSet<String> = HashSet::new();
  fn dfs(
    node: &String,
    map: &HashMap<String, Vec<String>>,
    visited: &mut HashSet<String>,
    path: &mut Vec<String>,
    res: &mut Vec<Vec<String>>,
  ) {
    if let Some(index) = path.iter().position(|s| s == node) {
      res.push(path[index..].to_vec());
    } else {
      if !visited.contains(node) {
        visited.insert(node.clone());
        if let Some(neighbors) = map.get(node) {
          for neighbor in neighbors {
            path.push(node.clone());
            dfs(neighbor, map, visited, path, res);
            path.pop();
          }
        }
      }
    }
  }
  for key in map.keys() {
    let mut path: Vec<String> = vec![];
    dfs(key, map, &mut visited, &mut path, &mut result);
  }
  result
}
