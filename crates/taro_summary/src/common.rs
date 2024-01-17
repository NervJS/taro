use napi_derive::napi;
use serde::Serialize;
use taro_shared::constants::CompilerType;

#[derive(Debug, Clone, Serialize)]
#[napi(object)]
pub struct Compiler {
  pub name: CompilerType,
  pub version: String,
}

#[derive(Debug, Serialize)]
#[napi(string_enum)]
pub enum AssetType {
  Image,
  Script,
  Style,
  Font,
  Media,
  JSON,
  Template,
  Other,
}
