use std::{path::{Path, PathBuf}, env::current_dir, thread, sync::{Arc, Mutex, Condvar}, fs};

use actix_web::{HttpServer, App, rt::System};
use serde::Serialize;
use anyhow::Context;
use webbrowser;
use napi_derive::napi;
use spinners::{Spinner, Spinners};
use taro_shared::{constants::FileType, utils::generate_with_template_content_sync};

use crate::{common::{Compiler, AssetType}, env::Env as EnvInfo};

#[derive(Debug, Clone, Serialize)]
#[napi(object)]
pub struct AssetItem {
  pub name: String,
  pub size: u32,
  #[serde(skip_serializing_if = "Option::is_none")]
  pub kind: Option<AssetType>,
}

#[derive(Debug)]
#[napi(object)]
pub struct SummaryOptions {
  pub compiler: Compiler,
  pub file_type: FileType,
  pub assets: Vec<AssetItem>,
}

#[derive(Debug, Clone, Serialize)]
pub struct AssetTypeInfo {
  pub total: f32,
  pub count: u32,
  pub assets: Vec<AssetItem>,
}

#[derive(Debug, Clone, Serialize)]
pub struct AssetsInfo {
  pub total: f32,
  pub total_str: String,
  pub script_assets: AssetTypeInfo,
  pub style_assets: AssetTypeInfo,
  pub template_assets: AssetTypeInfo,
  pub json_assets: AssetTypeInfo,
  pub image_assets: AssetTypeInfo,
  pub media_assets: AssetTypeInfo,
  pub font_assets: AssetTypeInfo,
  pub other_assets: AssetTypeInfo,
}

impl AssetsInfo {
  pub fn new() -> Self {
    AssetsInfo {
      total: 0.0,
      total_str: "0.0".to_string(),
      script_assets: AssetTypeInfo {
        total: 0.0,
        count: 0,
        assets: vec![],
      },
      style_assets: AssetTypeInfo {
        total: 0.0,
        count: 0,
        assets: vec![],
      },
      template_assets: AssetTypeInfo {
        total: 0.0,
        count: 0,
        assets: vec![],
      },
      json_assets: AssetTypeInfo {
        total: 0.0,
        count: 0,
        assets: vec![],
      },
      image_assets: AssetTypeInfo {
        total: 0.0,
        count: 0,
        assets: vec![],
      },
      media_assets: AssetTypeInfo {
        total: 0.0,
        count: 0,
        assets: vec![],
      },
      font_assets: AssetTypeInfo {
        total: 0.0,
        count: 0,
        assets: vec![],
      },
      other_assets: AssetTypeInfo {
        total: 0.0,
        count: 0,
        assets: vec![],
      },
    }
  }
}

#[derive(Debug, Clone, Serialize)]
pub struct SummaryInfo {
  pub compiler: Compiler,
  pub env_info: EnvInfo,
  pub assets: AssetsInfo,
}

pub fn generate_summary(opts: SummaryOptions) -> anyhow::Result<()> {
  let mut assets = opts.assets;
  let file_type = opts.file_type;
  let file_type_script = file_type.script;
  let file_type_style = file_type.style;
  let file_type_templ = file_type.templ;
  let file_type_config = file_type.config;
  let mut sp = Spinner::new(
    Spinners::Dots9,
    "正在生成项目构建分析报告".to_string(),
  );
  for asset in assets.iter_mut() {
    let file = Path::new(&asset.name);
    asset.kind = match file.extension() {
      Some(ext) => {
        let ext = ext.to_str().unwrap();
        if file_type_script.contains(ext) {
          Some(AssetType::Script)
        } else if file_type_style.contains(ext) {
          Some(AssetType::Style)
        } else if file_type_templ.contains(ext) {
          Some(AssetType::Template)
        } else if file_type_config.contains(ext) {
          Some(AssetType::JSON)
        } else {
          match ext {
            "png" | "jpg" | "jpeg" | "gif" | "svg" | "webp" | "ico" | "bmp" => Some(AssetType::Image),
            "mp4" | "m3u8" | "rmvb" | "avi" | "swf" | "3gp" | "mkv" | "flv" | "mpg" | "mpeg" | "mov" | "wmv" | "asf" | "asx" | "dat" | "rm" | "navi" | "wav" | "mp3" | "mid" | "m4a" | "ogg" | "flac" | "aac" | "amr" | "wma" | "ape" | "aiff" | "au" | "vqf" | "mka" | "opus" => Some(AssetType::Media),
            "eot" | "ttf" | "woff" | "woff2" => Some(AssetType::Font),
            _ => Some(AssetType::Other),
          }
        }
      }
      None => Some(AssetType::Other)
    }
  }
  // 生成静态文件
  let static_files_path = PathBuf::from(current_dir().unwrap().join(".summary"));
  if !static_files_path.exists() {
    fs::create_dir(&static_files_path).with_context(|| "创建目录失败".to_string())?;
  }
  let index_path = static_files_path.join("index.html");
  let template_content = include_str!("../assets/template.tmpl");
  // 构建 assets_info
  let mut assets_info = AssetsInfo::new();
  for asset in assets.iter() {
    assets_info.total += asset.size as f32;
    match asset.kind {
      Some(AssetType::Script) => {
        assets_info.script_assets.total += asset.size as f32;
        assets_info.script_assets.count += 1;
        assets_info.script_assets.assets.push(asset.clone());
      }
      Some(AssetType::Style) => {
        assets_info.style_assets.total += asset.size as f32;
        assets_info.style_assets.count += 1;
        assets_info.style_assets.assets.push(asset.clone());
      }
      Some(AssetType::Template) => {
        assets_info.template_assets.total += asset.size as f32;
        assets_info.template_assets.count += 1;
        assets_info.template_assets.assets.push(asset.clone());
      }
      Some(AssetType::JSON) => {
        assets_info.json_assets.total += asset.size as f32;
        assets_info.json_assets.count += 1;
        assets_info.json_assets.assets.push(asset.clone());
      }
      Some(AssetType::Image) => {
        assets_info.image_assets.total += asset.size as f32;
        assets_info.image_assets.count += 1;
        assets_info.image_assets.assets.push(asset.clone());
      }
      Some(AssetType::Media) => {
        assets_info.media_assets.total += asset.size as f32;
        assets_info.media_assets.count += 1;
        assets_info.media_assets.assets.push(asset.clone());
      }
      Some(AssetType::Font) => {
        assets_info.font_assets.total += asset.size as f32;
        assets_info.font_assets.count += 1;
        assets_info.font_assets.assets.push(asset.clone());
      }
      Some(AssetType::Other) => {
        assets_info.other_assets.total += asset.size as f32;
        assets_info.other_assets.count += 1;
        assets_info.other_assets.assets.push(asset.clone());
      }
      None => {}
    }
  }
  assets_info.total = assets_info.total / 1024_f32 / 1024_f32;
  assets_info.total_str = format!("{:.2}", assets_info.total);
  // 构建 summary_info
  let mut summary_info = SummaryInfo {
    compiler: opts.compiler,
    env_info: EnvInfo::new(),
    assets: assets_info
  };
  summary_info.env_info.init();
  generate_with_template_content_sync(template_content, index_path.to_str().unwrap(), &summary_info)?;
  let server = StaticServer::new(
    "0.0.0.0".to_string(),
    9000,
    "index.html".to_string(),
    static_files_path,
  );
  sp.stop_with_message("项目构建分析报告已生成，访问地址：http://localhost:9000".to_string());
  server.start()?;

  Ok(())
}

struct StaticServer {
  running: Arc<(Mutex<bool>, Condvar)>,
  host: String,
  port: u16,
  static_files_path: PathBuf,
  index: String,
}

impl StaticServer {
  pub fn new(host: String, port: u16, index: String, static_files_path: PathBuf) -> Self {
    Self {
      running: Arc::new((Mutex::new(true), Condvar::new())),
      host,
      port,
      index,
      static_files_path,
    }
  }

  pub fn start(&self) -> anyhow::Result<()> {
    let running_clone = self.running.clone();
    let static_files_path = self.static_files_path.clone();
    let host = self.host.clone();
    let port = self.port;
    let index = self.index.clone();
    let r = running_clone.clone();
    // 设置 ctrl-c 信号处理器
    ctrlc::set_handler(move || {
      let (lock, cvar) = &*r;
      let mut running = lock.lock().unwrap();
      *running = false;
      cvar.notify_all();
    }).with_context(|| "错误设置 Ctrl-C 监听".to_string())?;
    thread::spawn(move || {
      let sys = System::new();
      // 构建服务器
      let server = HttpServer::new(move || {
        App::new().service(
          actix_files::Files::new("/", &static_files_path).index_file(&index),
        )
      })
        .bind(format!("{}:{}", host, port))
        .unwrap_or_else(|_| panic!("无法绑定到 {}:{}", host, port))
        .shutdown_timeout(0)
        .run();
      let server_handle = server.handle();
      if webbrowser::open(format!("http://{}:{}", "localhost", port).as_str()).is_err() {
        println!("无法打开浏览器，请手动打开 http://{}:{}", "localhost", port);
      }
      thread::spawn(move || {
        let running_clone_inner = Arc::clone(&running_clone);
        let (lock, cvar) = &*running_clone_inner;
          let mut running = lock.lock().unwrap();
          while *running {
            running = cvar.wait(running).unwrap();
          }
          System::new().block_on(async {
            server_handle.stop(true).await;
          });
      });
      sys.block_on(server).unwrap();
    });
    // 主线程将在这里等待直到收到关闭信号
    let (lock, cvar) = &*self.running;
    let mut running = lock.lock().unwrap();
    while *running {
      running = cvar.wait(running).unwrap();
    }
    Ok(())
  }
}
