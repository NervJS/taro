#![deny(clippy::all)]

#[macro_use]
extern crate napi_derive;

#[napi]
pub fn add(i: i32, j: i32) -> i32 {
  i + j
}
