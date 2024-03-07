use anyhow::Result;
use async_trait::async_trait;


#[async_trait]
pub trait DoctorValidator {
  async fn validate () -> Result<()>;
}

