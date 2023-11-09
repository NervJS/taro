use std::{io::Error, path::Path};

use futures::future::BoxFuture;

pub type Result<T> = std::result::Result<T, Error>;

pub fn create_dir<P: AsRef<Path>>(dir: P) -> BoxFuture<'static, Result<()>> {
  let dir = dir.as_ref().to_string_lossy().to_string();
  let fut = async move { tokio::fs::create_dir(dir).await.map_err(Error::from) };
  Box::pin(fut)
}

pub fn create_dir_all<P: AsRef<std::path::Path>>(dir: P) -> BoxFuture<'static, Result<()>> {
  let dir = dir.as_ref().to_string_lossy().to_string();
  let fut = async move { tokio::fs::create_dir_all(dir).await.map_err(Error::from) };
  Box::pin(fut)
}

pub fn write<P: AsRef<std::path::Path>, D: AsRef<[u8]>>(
  file: P,
  data: D,
) -> BoxFuture<'static, Result<()>> {
  let file = file.as_ref().to_string_lossy().to_string();
  let data = data.as_ref().to_vec();
  let fut = async move { tokio::fs::write(file, data).await.map_err(Error::from) };
  Box::pin(fut)
}

pub fn remove_file<P: AsRef<Path>>(file: P) -> BoxFuture<'static, Result<()>> {
  let file = file.as_ref().to_string_lossy().to_string();
  let fut = async move { tokio::fs::remove_file(file).await.map_err(Error::from) };
  Box::pin(fut)
}

pub fn remove_dir_all<P: AsRef<Path>>(dir: P) -> BoxFuture<'static, Result<()>> {
  let dir = dir.as_ref().to_string_lossy().to_string();
  let fut = async move { tokio::fs::remove_dir_all(dir).await.map_err(Error::from) };
  Box::pin(fut)
}

pub fn read<P: AsRef<Path>>(file: P) -> BoxFuture<'static, Result<Vec<u8>>> {
  let file = file.as_ref().to_string_lossy().to_string();
  let fut = async move { tokio::fs::read(file).await.map_err(Error::from) };
  Box::pin(fut)
}
