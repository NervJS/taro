use swc_core::ecma::ast::*;

pub struct RenderFn {
  pub params: Vec<Pat>,
  pub jsx_element: JSXElement,
}

impl RenderFn {
  pub fn new(params: Vec<Pat>, jsx_element: JSXElement) -> Self {
    RenderFn {
      params,
      jsx_element,
    }
  }
}

impl Clone for RenderFn {
  fn clone(&self) -> Self {
    RenderFn {
      params: self.params.clone(),
      jsx_element: self.jsx_element.clone(),
    }
  }
}
