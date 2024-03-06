pub enum RubyStatus {
  // iOS plugins will not work, installation required.
  NotInstalled,

  // iOS plugins might not work, upgrade recommended.
  UnknownVersion,
  
  // iOS plugins will not work, upgrade required.
  BelowMinimumVersion,
  
  // iOS plugins may not work in certain situations (Swift, static libraries),
  // upgrade recommended.
  BelowRecommendedVersion,
  
  // Everything should be fine.
  Recommended,
  
  // iOS plugins will not work, re-install required.
  BrokenInstall,
}


pub struct Ruby {
  status: RubyStatus
}


impl Ruby {
  pub fn new (status: RubyStatus) -> Ruby {
    Ruby {
      status
    }
  }
}

#[async_trait]
impl Process for Ruby {
  async fn is_installed () -> Result<bool> {
    let output = ProcessUtils::exits_happy("which", vec!["ruby"]).await?;
    Ok(output != "ruby not found")
  }

  async fn get_version () -> Result<Version> {
    let output = ProcessUtils::exits_happy("ruby", vec!["--version"]).await?;
    Ok(Version::parse(output.as_str())?)
  }
}



