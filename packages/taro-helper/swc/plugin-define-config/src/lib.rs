use swc_core::ecma::{
    ast::*,
    transforms::testing::test,
    visit::{as_folder, FoldWith, VisitMut, VisitMutWith},
};
use swc_core::common::{DUMMY_SP, SyntaxContext};
use swc_core::plugin::{plugin_transform, proxies::TransformPluginProgramMetadata};

struct DefineConfig {
    found: bool,
    fn_name: String,
    ctxt: SyntaxContext
}

impl DefineConfig {
    fn new() -> Self {
        Self {
            found: false,
            fn_name: String::from(""),
            ctxt: SyntaxContext::empty()
        }
    }
}

impl VisitMut for DefineConfig {
  fn visit_mut_call_expr(&mut self, node: &mut CallExpr) {
    node.visit_mut_children_with(self);

    let callee = &node.callee;
    if let Some(expr_box) = callee.as_expr() {
      if let Expr::Ident(ident) = &**expr_box {
        if &ident.sym == "defineAppConfig" || &ident.sym == "definePageConfig" {
          self.found = true;
          self.fn_name = String::from(&*ident.sym);
          self.ctxt = ident.span.ctxt;
        }
      }
    }
  }
}

pub struct TransformVisitor;

impl VisitMut for TransformVisitor {
    fn visit_mut_module_items(&mut self, module_item: &mut Vec<ModuleItem>) {
      module_item.visit_mut_children_with(self);

      let mut define_config = DefineConfig::new();
      let mut line_to_be_insert: usize = 0;

      for (idx, item) in module_item.iter_mut().enumerate() {
        match item {
          ModuleItem::Stmt(stmt) => {
            stmt.visit_mut_with(&mut define_config);
            if define_config.found {
              line_to_be_insert = idx;
              break;
            }
          }
          ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultExpr(expr)) => {
            expr.visit_mut_with(&mut define_config);
            if define_config.found {
              line_to_be_insert = idx;
              break;
            }
          }
          _ => ()
        }
      }

      if define_config.found {
        let func = Stmt::Decl(Decl::Fn(FnDecl {
          ident: Ident::new(define_config.fn_name.into(), DUMMY_SP.with_ctxt(define_config.ctxt)),
          declare: false,
          function: Box::new(Function {
            span: DUMMY_SP,
            params: vec![Param {
              span: DUMMY_SP,
              decorators: Default::default(),
              pat: Pat::Ident(BindingIdent::from(Ident::new("config".into(), DUMMY_SP))),
            }],
            body: Some(BlockStmt {
              span: DUMMY_SP,
              stmts: vec![Stmt::Return(ReturnStmt {
                span: DUMMY_SP,
                arg: Some(Box::new(Expr::Ident(Ident::new("config".into(), DUMMY_SP)))),
              })],
            }),
            is_generator: false,
            is_async: false,
            type_params: Default::default(),
            decorators: Default::default(),
            return_type: Default::default(),
          }),
        }));

        module_item.insert(line_to_be_insert, ModuleItem::Stmt(func));
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
