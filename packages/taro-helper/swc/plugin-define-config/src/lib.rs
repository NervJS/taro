use swc_core::{
    ecma::{
        ast::*,
        transforms::testing::test,
        visit::{as_folder, FoldWith, VisitMut, VisitMutWith},
        utils::{quote_ident, FunctionFactory, prepend_stmt},
    },
    common::{DUMMY_SP as span, SyntaxContext },
    plugin::{plugin_transform, proxies::TransformPluginProgramMetadata},
};

struct DefineConfigVisitor {
    fn_name: Option<Ident>
}

impl VisitMut for DefineConfigVisitor {
    fn visit_mut_call_expr(&mut self, expr: &mut CallExpr) {
        expr.visit_mut_children_with(self);
        if let Callee::Expr(expr) = &expr.callee {
            if let Expr::Ident(ident) = &**expr {
                if ident.sym == "defineAppConfig" || ident.sym == "definePageConfig" {
                    self.fn_name = Some(ident.clone());
                }
            }
        }
    }
}

pub struct TransformVisitor;

impl VisitMut for TransformVisitor {
    fn visit_mut_module_items(&mut self, items: &mut Vec<ModuleItem>) {
        let mut folder = DefineConfigVisitor { fn_name: None };

        let is_found = items.iter_mut().any(|item| {
            item.visit_mut_with(&mut folder);
            folder.fn_name.is_some()
        });

        if is_found {
            let fn_name = folder.fn_name.take().unwrap();
            let func = Function {
                span,
                decorators: Default::default(),
                params: vec![Param {
                    span,
                    decorators: Default::default(),
                    pat: Pat::Ident(quote_ident!("config").into()),
                }],
                body: Some(BlockStmt {
                    span,
                    stmts: vec![Stmt::Return(ReturnStmt {
                      span,
                      arg: Some(Box::new(quote_ident!("config").into())),
                    })],
                  }),
                is_async: false,
                is_generator: false,
                type_params: None,
                return_type: None,
            };
            prepend_stmt(items, ModuleItem::Stmt(Stmt::Decl(Decl::Fn(func.into_fn_decl(fn_name)))));
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
    r#"export default defineAppConfig({})"#
);

test!(
    Default::default(),
    |_| as_folder(TransformVisitor),
    module_decl_default_page,
    r#"export default definePageConfig({})"#
);

test!(
    Default::default(),
    |_| as_folder(TransformVisitor),
    var_decl_app,
    r#"
    const config = defineAppConfig({})
    export default config
    "#
);

test!(
    Default::default(),
    |_| as_folder(TransformVisitor),
    var_decl_page,
    r#"
    const config = definePageConfig({})
    export default config
    "#
);

test!(
    Default::default(),
    |_| as_folder(TransformVisitor),
    module_exports,
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
    "#
);
