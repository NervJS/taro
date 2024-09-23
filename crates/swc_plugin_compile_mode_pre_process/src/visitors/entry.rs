use std::{collections::{HashMap, HashSet, VecDeque}, ops::Index};

use swc_core::ecma::{
        ast::*,
        visit::{VisitMutWith, VisitMut},
    };
use crate::PluginConfig;

use super::{common::*, generate_deps::GenerateDepsVisitor};
use super::collect_render_fn::CollectRenderFnVisitor;
use super::find_react_component::FindReactComponentVisitor;
use super::transform::component_entry::ComponentEntryVisitor;
pub struct EntryVisitor {
    visitor_context: VisitorContext,
}

struct VisitorContext {
    react_component_list: Vec<ReactComponent>,
    react_component_raw_render_fn_map: HashMap<String, HashMap< String, RenderFn>>,
    react_component_formatted_render_fn_map: HashMap<String, HashMap< String, RenderFn>>,
}

impl EntryVisitor {
    pub fn new(config: PluginConfig) -> Self {
        EntryVisitor {
            visitor_context: VisitorContext {
                react_component_raw_render_fn_map: HashMap::new(),
                react_component_formatted_render_fn_map: HashMap::new(),
                react_component_list: vec![],
            }
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
    fn find_react_component (&mut self, n: &mut Module) {
        // 先找到当前的文件中的 react 组件 因为有些人会在一个 jsx 文件中 写多个 react 组件，保留他的函数体 BlockStatement，他们各自是独立的，所以用数组保存就行
        let mut find_react_component_visitor = FindReactComponentVisitor::new(&mut self.visitor_context.react_component_list);
        n.visit_mut_children_with(&mut find_react_component_visitor);
        // 必须要合法的 react 组件才能继续往下走
        let mut valid_react_component_list = vec![];
        self.visitor_context.react_component_list.clone().into_iter().for_each(| mut react_component| {
            if react_component.is_valid() {
                valid_react_component_list.push(react_component);
            }
        });
        self.visitor_context.react_component_list = valid_react_component_list;
    }

    fn collect_each_component_render_fn (&mut self) {
        // 遍历每一个 react 组件，找到他们的 render 函数并收集起来
        self.visitor_context.react_component_list.clone().into_iter().for_each(|mut react_component| {
            let mut collect_render_fn_visitor = CollectRenderFnVisitor::new();
            react_component.block_stmt.visit_mut_with(&mut collect_render_fn_visitor);
            
            // debug
            collect_render_fn_visitor.raw_render_fn_map.clone().into_iter().for_each(|(name, _render_fn)| {
                println!("component name: {}, renderFnName{}\n", react_component.get_name(), name);
            });
            self.visitor_context.react_component_raw_render_fn_map.insert(react_component.get_name(), collect_render_fn_visitor.raw_render_fn_map.clone());
        });
    }

    fn transform_render_fn (&mut self) {
        let mut formatted_render_fn_map: HashMap<String, HashMap< String, RenderFn>> = HashMap::new();
        self.visitor_context.react_component_raw_render_fn_map.clone().into_iter().for_each(|(name, raw_fn_map)| {
            // 1. 可能存在互相引用，得梳理一下他们之间的依赖关系 数据结构 hashMap：{name:[dep1, dep2,...]}
            let render_fn_deps_map = generate_render_fn_dep_map(&raw_fn_map);
            
            for (fn_name, deps) in &render_fn_deps_map {
                println!("component_name: {}, fn_name: {} deps: {:?}", name, fn_name, deps);
            }

            // 2. 根据依赖表，生成解析的列表 sort queue 先进先出
            get_deps_circular(&render_fn_deps_map);
            let sort_queue = generate_sort_queue(&render_fn_deps_map);
            println!("component_name: {}, sort_queue: {:?}", name, sort_queue);
            // 3. 根据 sort queue 生成 formatted_fn_map 数据结构 hashMap：{name: formatted_fn}
            let formatted_fn_map = generate_formatted_fn_map(sort_queue, &raw_fn_map, &render_fn_deps_map);
            formatted_render_fn_map.insert(name, formatted_fn_map);
        });
        for (component_name, formatted_fn_map) in &formatted_render_fn_map {
            for (fn_name, formatted_fn) in formatted_fn_map {
                println!("component_name: {}, fn_name: {}, formatted_fn: {:?}", component_name, fn_name, formatted_fn.jsx_element);
            }
        }
        self.visitor_context.react_component_formatted_render_fn_map = formatted_render_fn_map;
    }

    fn transform (&mut self, n: &mut Module) {
        let mut transform_visitor = ComponentEntryVisitor::new(&self.visitor_context.react_component_formatted_render_fn_map);
        n.visit_mut_children_with(&mut transform_visitor);
    }
}

fn generate_render_fn_dep_map (raw_fn_map: &HashMap<String, RenderFn>)-> HashMap<String, Vec<String>> {
    let mut render_fn_deps_map = HashMap::new();
    for (name, render_fn) in raw_fn_map {
        let mut cloned_jsx_element = render_fn.jsx_element.clone();
        let mut generate_deps_visitor = GenerateDepsVisitor::new(raw_fn_map, name.clone());
        cloned_jsx_element.visit_mut_with(&mut generate_deps_visitor);
        let deps = generate_deps_visitor.deps_list.clone();
        if generate_deps_visitor.self_loop {
            println!("self loop found in render function: {}", name);
        } else {
            render_fn_deps_map.insert(name.clone(), deps);
        }

    }
    // todo：通过 visitor 收集依赖，只能收集到最表层的依赖，如果有嵌套的依赖，需要递归处理，可能会出现循环，如果出现循环的话，按么循环的那两个组件都要去掉 也是数据结构算法
    render_fn_deps_map
}

fn generate_sort_queue (render_fn_deps_map: &HashMap<String, Vec<String>>) -> Vec<String> {
    //已经遍历过的节点 剪纸用的
    let mut visited = HashSet::new();
    let mut result = VecDeque::new();
    let mut cycles = Vec::new();
    
    for key in render_fn_deps_map.keys() {
        let mut path = Vec::new();
        if dfs(key, render_fn_deps_map, &mut visited, &mut path, &mut result, &mut cycles) {
            cycles.push(path);
        }
    }

    for cycle in cycles {
        println!("Detected cycle: {:?}", cycle);
    }

    result.into_iter().collect()
}

fn generate_formatted_fn_map (sort_queue: Vec<String>, raw_fn_map: &HashMap<String, RenderFn>, render_fn_deps_map: &HashMap<String, Vec<String>>) -> HashMap<String, RenderFn> {
    let mut formatted_fn_map = HashMap::new();
    for name in &sort_queue {
        match (raw_fn_map.get(name), render_fn_deps_map.get(name)) {
            (Some(raw_fn), Some(deps)) => {
                let mut dep_map = HashMap::new();
                for dep in deps {
                    let formatted_dep = formatted_fn_map.get(dep);
                    if formatted_dep.is_some() {
                        dep_map.insert(dep.clone(), formatted_dep.unwrap());
                    }
                }
                formatted_fn_map.insert(name.clone(), raw_fn.clone());
            },
            _ => {}
        }
    }
  
    formatted_fn_map
}


fn dfs(node: &String, map: &HashMap<String, Vec<String>>, visited: &mut HashSet<String>, path: &mut Vec<String>, result: &mut VecDeque<String>, cycles: &mut Vec<Vec<String>>) -> bool {
    if path.contains(node) {
        //这里就是发现循环了

        return true;
    } else if !visited.contains(node) {
        // 已经遍历过就不需要再处理了，要么已经被 push 到 result 里面了，要么存在循环链，已经被摘除了
        visited.insert(node.clone());
        path.push(node.clone());

        if let Some(neighbors) = map.get(node) {
            for neighbor in neighbors {
                if dfs(neighbor, map, visited, path, result, cycles) {
                    return true;
                }
            }
        }

        path.pop();
        result.push_back(node.clone());
    }

    false
}

fn get_deps_circular(map: &HashMap<String, Vec<String>>)-> Vec<Vec<String>> {
    let mut result: Vec<Vec<String>> = vec![];
    let mut visited: HashSet<String> = HashSet::new();
    for key in map.keys() {
        let mut path: Vec<String> = vec![];
        dfs1(key, map, &mut visited, &mut path, &mut result);
    }
    println!("result: {:?}", result);
    result
}

fn dfs1(node: &String, map: &HashMap<String, Vec<String>>, visited: &mut HashSet<String>, path: &mut Vec<String>, res: &mut Vec<Vec<String>>){
    println!("node: {:?}", node);
    println!("path: {:?}", path);
    if let Some(index) = path.iter().position(|s| s == node) {
        println!("Found at index {}", index);
        print!("cycle found: ");
        res.push(path[index..].to_vec());
    } else {
        if !visited.contains(node) {
            visited.insert(node.clone());
            if let Some(neighbors) = map.get(node) {
                for neighbor in neighbors {
                    path.push(node.clone());
                    dfs1(neighbor, map, visited, path, res);
                    path.pop();
                }
            }
        }
    }
}