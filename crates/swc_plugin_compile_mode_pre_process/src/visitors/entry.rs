use std::collections::HashMap;

use swc_core::{
    ecma::{
        ast::*,
        visit::{VisitMutWith, VisitMut},
    },
    plugin::{
        plugin_transform,
        proxies::TransformPluginProgramMetadata
    }
};
use crate::{visitors::find_react_component, PluginConfig};

use super::common::*;
use super::collect_render_fn::CollectRenderFnVisitor;
use super::find_react_component::FindReactComponentVisitor;
pub struct EntryVisitor {
    visitor_context: VisitorContext,
}

struct VisitorContext {
    react_component_list: Vec<ReactComponent>,
    raw_render_fn_map: HashMap<String, HashMap< String, RenderFn>>,
}

impl EntryVisitor {
    pub fn new(config: PluginConfig) -> Self {
        EntryVisitor {
            visitor_context: VisitorContext {
                raw_render_fn_map: HashMap::new(),
                react_component_list: vec![],
            }
        }
    }
}


impl VisitMut for EntryVisitor {
    fn visit_mut_module(&mut self, n: &mut Module) {
        print!("visit_mut_module start");
        //这个只是入口，这里面按顺序调用各种visitor，然后把处理的内容都挂在visitorContext上

        self.find_react_component(n);
        // 这里处理收集到的 react_component 数据结构 hashMap：{name: react_component}

        self.collect_each_component_render_fn();
        // 这里处理收集到的 raw_render_fn_map 数据结构 hashMap：{name: raw_fn}
        // let render_fn_deps_map = generate_render_fn_dep_map(self.visitorContext.raw_render_fn_map);
        // 1. 可能存在互相引用，得梳理一下他们之间的依赖关系 数据结构 hashMap：{name:[dep1, dep2,...]}

        // 2. 根据依赖表，生成解析的列表 sort queue 先进先出
        // let sort_queue = generate_sort_queue(&render_fn_deps_map);
        // 3. 根据 sort queue 生成 formatted_fn_map 数据结构 hashMap：{name: formatted_fn}
        
        // 4. 交给下一个 visitor 处理
        print!("visit_mut_module done");
        n.visit_mut_children_with(self);
    }
}


impl EntryVisitor {
    fn find_react_component (&mut self, n: &mut Module) {
        // 先找到当前的文件中的 react 组件 因为有些人会在一个 jsx 文件中 写多个 react 组件，保留他的函数体 BlockStatement，他们各自是独立的，所以用数组保存就行
        let mut find_react_component_visitor = FindReactComponentVisitor::new(&mut self.visitor_context.react_component_list);
        n.visit_mut_children_with(&mut find_react_component_visitor);
        // 必须要合法的 react 组件才能继续往下走
        let valid_react_component_list = self.visitor_context.react_component_list.clone().into_iter().filter(|react_component| react_component.is_valid()).collect();
        self.visitor_context.react_component_list = valid_react_component_list;
    }

    fn collect_each_component_render_fn (&mut self) {
        // 遍历每一个 react 组件，找到他们的 render 函数并收集起来
        self.visitor_context.react_component_list.clone().into_iter().for_each(|mut react_component| {
            let mut collect_render_fn_visitor = CollectRenderFnVisitor::new(&mut self.visitor_context.raw_render_fn_map, react_component.get_name());
            react_component.block_stmt.visit_mut_children_with(&mut collect_render_fn_visitor);
        });
    }
}

fn generate_render_fn_dep_map (raw_fn_map: &HashMap<String, RenderFn>)-> HashMap<String, Vec<String>> {
    let mut render_fn_deps_map = HashMap::new();
    for (name, render_fn) in raw_fn_map {
        let mut deps: Vec<String> = vec![];
        let cloned_jsx_element = render_fn.jsx_element.clone();
        // @todo use visitor to collect deps
        render_fn_deps_map.insert(name.clone(), deps);
    }
    // todo：通过 visitor 收集依赖，只能收集到最表层的依赖，如果有嵌套的依赖，需要递归处理，可能会出现循环，如果出现循环的话，按么循环的那两个组件都要去掉 也是数据结构算法
    render_fn_deps_map
}

fn generate_sort_queue (render_fn_deps_map: &HashMap<String, Vec<String>>) -> Vec<String> {
    let mut sort_queue = vec![];
    for (name, deps) in render_fn_deps_map {
        // todo 完全的数据结构算法
    }
    sort_queue
}

fn generate_formatted_fn_map (sort_queue: Vec<String>, raw_fn_map: &HashMap<String, RenderFn>) -> HashMap<String, RenderFn> {
    let mut formatted_fn_map = HashMap::new();
    for name in sort_queue {
        if let Some(raw_fn) = raw_fn_map.get(&name) {
            let mut formatted_fn = raw_fn.clone();
            // todo 格式化 raw_fn 为 formatted_fn 
            // 涉及模版拼接和参数转化，和下面的 transform 要做的事情一样，等抽象出来
            formatted_fn_map.insert(name, formatted_fn);
        }
    }
  
    formatted_fn_map
}