use std::{path::Path, io::Result};

use futures::future::BoxFuture;

pub fn create_dir<P: AsRef<Path>>(dir: P) -> BoxFuture<'static, Result<()>> {
  let dir = dir.as_ref().to_string_lossy().to_string();
  let fut = async move { tokio::fs::create_dir(dir).await };
  Box::pin(fut)
}

pub fn create_dir_all<P: AsRef<std::path::Path>>(dir: P) -> BoxFuture<'static, Result<()>> {
  let dir = dir.as_ref().to_string_lossy().to_string();
  let fut = async move { tokio::fs::create_dir_all(dir).await };
  Box::pin(fut)
}

pub fn write<P: AsRef<std::path::Path>, D: AsRef<[u8]>>(
  file: P,
  data: D,
) -> BoxFuture<'static, Result<()>> {
  let file = file.as_ref().to_string_lossy().to_string();
  let data = data.as_ref().to_vec();
  let fut = async move { tokio::fs::write(file, data).await };
  Box::pin(fut)
}

pub fn remove_file<P: AsRef<Path>>(file: P) -> BoxFuture<'static, Result<()>> {
  let file = file.as_ref().to_string_lossy().to_string();
  let fut = async move { tokio::fs::remove_file(file).await };
  Box::pin(fut)
}

pub fn remove_dir_all<P: AsRef<Path>>(dir: P) -> BoxFuture<'static, Result<()>> {
  let dir = dir.as_ref().to_string_lossy().to_string();
  let fut = async move { tokio::fs::remove_dir_all(dir).await };
  Box::pin(fut)
}

pub fn read<P: AsRef<Path>>(file: P) -> BoxFuture<'static, Result<Vec<u8>>> {
  let file = file.as_ref().to_string_lossy().to_string();
  let fut = async move { tokio::fs::read(file).await };
  Box::pin(fut)
}

pub fn metadata<P: AsRef<Path>>(file: P) -> BoxFuture<'static, Result<std::fs::Metadata>> {
  let file = file.as_ref().to_string_lossy().to_string();
  let fut = async move { tokio::fs::metadata(file).await };
  Box::pin(fut)
}

pub fn rename<P: AsRef<Path>, Q: AsRef<Path>>(from: P, to: Q) -> BoxFuture<'static, Result<()>> {
  let from = from.as_ref().to_string_lossy().to_string();
  let to = to.as_ref().to_string_lossy().to_string();
  let fut = async move { tokio::fs::rename(from, to).await };
  Box::pin(fut)
}

pub fn set_permissions<P: AsRef<Path>>(
  file: P,
  perm: std::fs::Permissions,
) -> BoxFuture<'static, Result<()>> {
  let file = file.as_ref().to_string_lossy().to_string();
  let fut = async move { tokio::fs::set_permissions(file, perm).await };
  Box::pin(fut)
}

pub fn copy<P: AsRef<Path>, Q: AsRef<Path>>(from: P, to: Q) -> BoxFuture<'static, Result<u64>> {
  let from = from.as_ref().to_path_buf();
  let to = to.as_ref().to_path_buf();
  let fut = async move {
    let bytes_copied = tokio::fs::copy(&from, &to).await?;
    // 以下部分仅适用于 UNIX 系统
    #[cfg(unix)]
    {
      // 获取源文件的元数据
      let src_metadata = metadata(&from).await?;
      // 获取源文件权限
      let src_permissions = src_metadata.permissions();
      // 设置目标文件的权限
      set_permissions(&to, src_permissions).await?;
    }
    Ok(bytes_copied)
  };
  Box::pin(fut)
}
