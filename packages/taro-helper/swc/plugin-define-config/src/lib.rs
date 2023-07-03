use swc_core::{
  ecma::{
      ast::*,
      transforms::testing::test,
      visit::{as_folder, FoldWith, VisitMut, VisitMutWith},
  },
  common::{
      DUMMY_SP,
      SyntaxContext
  },
};
use swc_ecma_utils::{quote_ident, FunctionFactory};
use swc_core::plugin::{plugin_transform, proxies::TransformPluginProgramMetadata};

pub struct TransformVisitor;

struct DefineFoler {
  name: Option<String>,
  ctxt: Option<SyntaxContext>,
}

impl VisitMut for DefineFoler {
  fn visit_mut_call_expr(&mut self, expr: &mut CallExpr) {
      expr.visit_mut_children_with(self);
      if let Callee::Expr(expr) = &expr.callee {
          if let Expr::Ident(ident) = &**expr {
              if &*ident.sym == "defineAppConfig" || &*ident.sym == "definePageConfig" {
                  self.name = Some(String::from(&*ident.sym));
                  self.ctxt = Some(ident.span.ctxt);
              }
          }
      }
  }
}

impl VisitMut for TransformVisitor {
  fn visit_mut_module_items(&mut self, items: &mut Vec<ModuleItem>) {
      let mut folder = DefineFoler { name: None, ctxt: None };
      let mut line_to_be_insert: usize = 0;

      for (index, item) in items.iter_mut().enumerate() {
          item.visit_mut_with(&mut folder);
          if folder.name.is_some() {
              line_to_be_insert = index;
              break
          }
      }
      if let Some(name) = &folder.name {
          let func_name = quote_ident!(DUMMY_SP.with_ctxt(folder.ctxt.unwrap()), name.as_str());
          let func = Function {
              span: DUMMY_SP,
              decorators: Default::default(),
              params: vec![Param {
                  span: DUMMY_SP,
                  decorators: Default::default(),
                  pat: Pat::Ident(quote_ident!("config").into()),
              }],
              body: Some(BlockStmt {
                  span: DUMMY_SP,
                  stmts: vec![Stmt::Return(ReturnStmt {
                    span: DUMMY_SP,
                    arg: Some(Box::new(quote_ident!("config").into())),
                  })],
                }),
              is_async: false,
              is_generator: false,
              type_params: None,
              return_type: None,
          };
          items.insert(line_to_be_insert, ModuleItem::Stmt(Stmt::Decl(Decl::Fn(func.into_fn_decl(func_name)))));
      }
  }
}

/// An example plugin function with macro support.
/// `plugin_transform` macro interop pointers into deserialized structs, as well
/// as returning ptr back to host.
///
/// It is possible to opt out from macro by writing transform fn manually
/// if plugin need to handle low-level ptr directly via
/// `__transform_plugin_process_impl(
///     ast_ptr: *const u8, ast_ptr_len: i32,
///     unresolved_mark: u32, should_enable_comments_proxy: i32) ->
///     i32 /*  0 for success, fail otherwise.
///             Note this is only for internal pointer interop result,
///             not actual transform result */`
///
/// This requires manual handling of serialization / deserialization from ptrs.
/// Refer swc_plugin_macro to see how does it work internally.
#[plugin_transform]
pub fn process_transform(program: Program, _metadata: TransformPluginProgramMetadata) -> Program {
  program.fold_with(&mut as_folder(TransformVisitor))
}

// An example to test plugin transform.
// Recommended strategy to test plugin's transform is verify
// the Visitor's behavior, instead of trying to run `process_transform` with mocks
// unless explicitly required to do so.
test!(
  Default::default(),
  |_| as_folder(TransformVisitor),
  module_decl_default_app,
  // Input codes
  r#"
  export default defineAppConfig({})
  "#,
  // Output codes after transformed with plugin
  r#"
  function defineAppConfig(config) {return config}
  export default defineAppConfig({})
  "#
);

test!(
  Default::default(),
  |_| as_folder(TransformVisitor),
  module_decl_default_page,
  // Input codes
  r#"
  export default definePageConfig({})
  "#,
  // Output codes after transformed with plugin
  r#"
  function definePageConfig(config) {return config}
  export default definePageConfig({})
  "#
);

test!(
Default::default(),
|_| as_folder(TransformVisitor),
var_decl_app,
// Input codes
r#"
const config = defineAppConfig({})
export default config
"#,
// Output codes after transformed with plugin
r#"
function defineAppConfig(config) {return config}
const config = defineAppConfig({})
export default config
"#
);

test!(
Default::default(),
|_| as_folder(TransformVisitor),
var_decl_page,
// Input codes
r#"
const config = definePageConfig({})
export default config
"#,
// Output codes after transformed with plugin
r#"
function definePageConfig(config) {return config}
const config = definePageConfig({})
export default config
"#
);

test!(
  Default::default(),
  |_| as_folder(TransformVisitor),
  module_exports,
  // Input codes
  r#"
  var require_index_config = __commonJS({
      "src/pages/index/index.config.ts": function(exports1, module) {
          var config = definePageConfig({
              navigationBarTitleText: "首页",
              usingComponents: {}
          });
          module.exports = config;
      }
  });
  var _default = require_index_config();
  "#,
  // Output codes after transformed with plugin
  r#"
  function definePageConfig(config) {return config}
  var require_index_config = __commonJS({
      "src/pages/index/index.config.ts": function(exports1, module) {
          var config = definePageConfig({
              navigationBarTitleText: "首页",
              usingComponents: {}
          });
          module.exports = config;
      }
  });
  var _default = require_index_config();
  "#
);
